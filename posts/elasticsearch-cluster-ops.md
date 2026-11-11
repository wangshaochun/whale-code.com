---
title: Elasticsearch 集群运维与容量规划：分片、磁盘、Mapping 与告警
description: Elasticsearch 集群部署、容量评估、分片规划、nested 映射、ElastAlert 告警与日常监控的实战清单，附计算公式和常见坑。
date: '2023-09-09'
updated: '2026-11-11'
tags: [Elasticsearch, 集群, 容量规划, 分片, Nested, ElastAlert, 运维]
author: 鲸码研发团队
draft: false
---

## 先说结论

ES 集群出问题，80% 不是“机器不够”，而是这几件事没提前规划：

- 分片太多或太大，集群状态长期 yellow/red
- 磁盘按源数据 1:1 估，没算副本、段合并和安全水位
- Mapping 用了动态映射，字段爆炸
- 没有监控和告警，等业务反馈才知道挂了

下面是一套从部署到运维的检查清单，适合 3 节点起步的中小型集群。

## 一、集群部署基线

### 1. 系统层

```bash
# 关闭 swap 或降低 swappiness
sysctl -w vm.swappiness=1
echo 'vm.swappiness=1' >> /etc/sysctl.conf

# ES 需要足够的虚拟内存映射
sysctl -w vm.max_map_count=655360
echo 'vm.max_map_count=655360' >> /etc/sysctl.conf

# 文件句柄
cat >> /etc/security/limits.conf <<'EOF'
elasticsearch soft nofile 65536
elasticsearch hard nofile 131072
elasticsearch soft nproc 4096
elasticsearch hard nproc 4096
EOF
```

### 2. JVM 堆

```yaml
# config/jvm.options
-Xms16g
-Xmx16g
```

堆建议不超过物理内存的 50%，且不要超过 31G（压缩指针边界）。剩下的一半留给文件系统缓存，ES 很依赖 page cache。

### 3. 节点角色

3 节点小集群可以 master/data 合一，但生产建议至少 3 个 master-eligible 节点，避免脑裂。数据量上来后，再拆 dedicated master、coordinating 和 data 节点。

### 4. 安全

不要裸奔。至少开启：

```yaml
xpack.security.enabled: true
xpack.security.transport.ssl.enabled: true
```

密码不要写在文章、脚本和 Git 里。用 keystore 或密钥管理：

```bash
./bin/elasticsearch-keystore add bootstrap.password
```

## 二、容量与分片规划

### 1. 磁盘估算

一个常用的保守公式：

```text
最小磁盘 = 源数据 × (1 + 副本数) × 1.1（索引开销）
          ÷ (1 - 0.05)（系统预留）
          ÷ (1 - 0.20)（段合并/日志等内部开销）
          ÷ (1 - 0.15)（安全水位）
```

单副本时，大约是源数据的 **3.4 倍**。也就是说，100 GB 原始数据，至少准备 340 GB 磁盘。

实际还要看：

- 是否有大量 `text` 字段和分词
- 是否开启 `_source`、`doc_values`
- 是否有历史索引和副本
- 快照仓库是否在同一块盘

### 2. 分片大小

- 单个 shard 建议 **30 GB 以内**，特殊场景不超过 50 GB
- shard 数尽量是数据节点数的整数倍
- 单节点上同一索引的 shard 不要超过 5 个
- 小集群不要一上来建几百个 shard，元数据和恢复成本很高

一个粗略的 shard 数计算：

```text
主分片数 ≈ 索引总大小 ÷ 30 GB
```

再根据节点数和增长预期取整。索引创建后分片数不能直接改，只能 reindex 或 shrink/split，所以一开始要留余量。

### 3. 副本

- 生产至少 1 副本
- 2 副本能提高读吞吐和容灾，但磁盘翻倍
- 写入压力大时，可以先 0 副本迁数据，完成后再加副本

## 三、Mapping 与 Nested

### 1. 不要依赖动态映射

动态映射会把数字识别成 `long`、把日期识别成 `text`，后面再改就要 reindex。生产索引建议显式建 mapping：

```http
PUT /article
{
  "mappings": {
    "properties": {
      "title":    { "type": "text", "analyzer": "ik_max_word" },
      "author":   { "type": "keyword" },
      "content":  { "type": "text", "analyzer": "ik_max_word" },
      "created_at": { "type": "date" },
      "tags":     { "type": "keyword" }
    }
  }
}
```

`text` 用于全文检索，`keyword` 用于精确过滤、聚合和排序。不要所有字段都用 `text`。

### 2. Nested 适合什么

当数组里的对象需要保持字段间关系时，用 `nested`。例如一个用户有多个账户，要查“年龄大于 25 且 Bank A 余额大于 1000”的用户：

```http
PUT /user_index
{
  "mappings": {
    "properties": {
      "user": {
        "type": "nested",
        "properties": {
          "name": { "type": "text" },
          "age":  { "type": "integer" },
          "accounts": {
            "type": "nested",
            "properties": {
              "bank":    { "type": "keyword" },
              "balance": { "type": "float" }
            }
          }
        }
      }
    }
  }
}
```

查询：

```http
GET /user_index/_search
{
  "query": {
    "nested": {
      "path": "user",
      "query": {
        "bool": {
          "must": [
            { "range": { "user.age": { "gt": 25 } } },
            {
              "nested": {
                "path": "user.accounts",
                "query": {
                  "bool": {
                    "must": [
                      { "term": { "user.accounts.bank": "Bank A" } },
                      { "range": { "user.accounts.balance": { "gt": 1000 } } }
                    ]
                  }
                }
              }
            }
          ]
        }
      }
    }
  }
}
```

### 3. Nested 的代价

- 每个 nested 对象都会作为隐藏文档单独索引，存储和写入成本更高
- 更新 nested 对象要重建整个文档
- 默认嵌套字段上限 50，字段太多会导致 mapping 爆炸
- 能扁平化就别 nested；只有“数组对象内部字段必须关联”时才用

## 四、告警与监控

### 1. 必须监控的指标

| 指标 | 关注点 |
|---|---|
| 集群状态 | red 立即处理，yellow 看副本和节点 |
| JVM heap | 长期 > 75% 要扩容或排查大查询 |
| GC 时间 | 频繁 full GC 说明堆或查询有问题 |
| 磁盘水位 | 85% 低水位、90% 高水位、95% 危险 |
| 写入/查询延迟 | 对比基线，突增要查慢日志 |
| pending tasks | 长期堆积说明主节点或磁盘扛不住 |
| 线程池队列 | search/write 队列满会拒绝请求 |

### 2. ElastAlert 邮件告警

ElastAlert 适合快速搭一个“查 ES 日志 → 命中规则 → 发邮件”的告警。新版建议用 ElastAlert2：

```bash
python3 -m venv /opt/elastalert2
source /opt/elastalert2/bin/activate
pip install elastalert2
```

配置 `config.yaml`：

```yaml
es_host: 10.0.0.10
es_port: 9200
es_username: elastic
es_password: <从环境变量或密钥文件读取>
rules_folder: /opt/elastalert2/rules
run_every:
  minutes: 1
buffer_time:
  minutes: 15
writeback_index: elastalert_status
smtp_host: smtp.example.com
smtp_port: 465
from_addr: alert@example.com
smtp_auth_file: /opt/elastalert2/smtp_auth_file
```

规则示例：

```yaml
name: error-log-alert
type: any
index: logstash-*
filter:
  - query:
      query_string:
        query: "level:ERROR"
alert:
  - email
email:
  - ops@example.com
```

启动：

```bash
elastalert --config /opt/elastalert2/config.yaml
```

注意：

- 邮件密码不要明文写在配置里，用环境变量或受限权限文件
- ElastAlert 是轮询模型，分钟级延迟，不适合秒级告警
- 新版本也可以直接用 Kibana Alerting 或 Elasticsearch Watcher，少维护一个组件

## 五、索引生命周期与备份

- 日志类索引按天/周滚动，用 ILM 做 hot → warm → cold → delete
- 热索引副本可以少一点，冷索引可以降副本、force merge
- 快照仓库和集群磁盘分开，避免快照把生产盘写满
- 定期做恢复演练，不要只验证“快照创建成功”

## 六、日常检查清单

- [ ] `GET _cluster/health` 不是 red
- [ ] `GET _cat/indices?v&health=red` 为空
- [ ] 磁盘水位低于 85%
- [ ] JVM heap 长期低于 75%
- [ ] 没有大量 pending tasks
- [ ] 慢查询日志有基线，异常能告警
- [ ] 快照按计划执行，最近一次恢复演练通过
- [ ] Mapping 没有未知字段暴涨
- [ ] 证书和密码没有过期

## 常见坑

**1. 按源数据 1:1 买磁盘**  
副本、段合并、系统预留一加，实际需要 3 倍以上。

**2. 分片建太多**  
小索引也 5 分片，几百个索引就是几千个 shard，主节点压力大。

**3. 堆内存设太大**  
超过 31G 丢失压缩指针，剩下的内存也不给 page cache，反而更慢。

**4. 动态映射**  
上线时没建 mapping，后面字段类型冲突，只能 reindex。

**5. 没有监控磁盘水位**  
ES 到 95% 会强制只读，写入直接失败。提前告警，别等业务报错。

## FAQ

**Q：3 个节点需要独立 master 吗？**  
A：小集群可以 master/data 合一，但要保证 3 个 master-eligible 节点。数据量大、索引多时再拆 dedicated master。

**Q：一个 shard 多大合适？**  
A：30 GB 以内比较稳，最好不超过 50 GB。还要结合节点数、堆内存和查询模式。

**Q：nested 和 join 怎么选？**  
A：nested 适合“数组对象内部字段关联”的读多写少场景；join 适合父子文档但性能更差。能扁平化优先扁平化。

**Q：ElastAlert 和 Kibana Alerting 选哪个？**  
A：已经在用 Kibana 就优先 Kibana Alerting，少维护一套组件；需要灵活规则和邮件模板时再用 ElastAlert2。

## 相关阅读

- [Elasticsearch 跨集群迁移：快照、Reindex、Logstash 怎么选](/blog/elasticsearch-cross-cluster-migration)
- [麒麟 V10 ARM 离线部署 Nginx、MySQL 8 与 Redis](/blog/kylin-v10-arm-offline-deploy)

我们做过 Elasticsearch 集群部署、容量规划、迁移与日志平台运维。有类似需求可以看[项目案例](/cases)或[联系我们](/#contact)。
