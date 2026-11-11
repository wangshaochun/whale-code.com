---
title: Elasticsearch 跨集群迁移：快照、Reindex、Logstash 三种方案怎么选
description: 对比 Elasticsearch 快照、Reindex API、Logstash 三种跨集群迁移方案的适用场景、停机时间、版本兼容与操作步骤，附迁移后校验清单。
date: '2023-10-22'
updated: '2026-11-11'
tags: [Elasticsearch, 数据迁移, 快照, Reindex, Logstash, 运维]
author: 鲸码研发团队
draft: false
---

## 先说结论

| 方案 | 适合数据量 | 停机 | 版本要求 | 能否持续同步 | 典型场景 |
|---|---|---|---|---|---|
| 快照（Snapshot） | 大（几十 GB 到 TB） | 几乎不停机 | 目标版本 ≥ 源版本 | 否 | 同版本集群搬迁、机房迁移 |
| Reindex API | 小到中等（建议 < 50 GB） | 不停机 | 兼容即可 | 否 | 少量索引、按条件重建 |
| Logstash | 中等，持续增量 | 不停机 | 插件兼容即可 | 是 | 持续同步、双写过渡 |

**选型顺序**：数据量大、能共享存储或能拷文件 → 快照；数据量小、只想迁几个索引 → Reindex；需要持续同步、不能停写 → Logstash。

超过 1 GB 的整索引迁移，优先快照。Reindex 走网络和 scroll，数据量大时又慢又容易超时。

## 一、迁移前必须确认的事

1. **源集群和目标集群版本**：Elasticsearch 不支持从高版本恢复到低版本；跨大版本要先看官方兼容矩阵。
2. **索引数量、文档数、磁盘占用**：`GET _cat/indices?v&s=store.size:desc`。
3. **Mapping 和 Settings**：分片数、副本数、分析器、`refresh_interval`、别名、索引模板、ILM 策略。
4. **网络**：Reindex / Logstash 需要目标集群能访问源集群；快照需要能拷贝仓库目录。
5. **写入是否停止**：迁移期间如果源集群还在写，必须记录切换点，否则会丢增量。
6. **回滚方案**：目标集群索引先不要删，保留旧集群读权限，确认业务正常后再下线。

## 二、方案 A：快照迁移

适合大索引、同版本或目标版本更高、能挂共享存储或能拷贝文件的场景。

### 1. 源集群配置仓库路径

在 `elasticsearch.yml` 中加：

```yaml
path.repo: ["/data/es-backup"]
```

所有节点都要配，然后重启。创建目录并授权给 ES 用户：

```bash
mkdir -p /data/es-backup
chown -R elasticsearch:elasticsearch /data/es-backup
```

### 2. 注册快照仓库

```http
PUT /_snapshot/local_backup
{
  "type": "fs",
  "settings": {
    "location": "/data/es-backup",
    "compress": true
  }
}
```

### 3. 创建快照

```http
PUT /_snapshot/local_backup/snapshot_20261111?wait_for_completion=true
{
  "indices": "index_1,index_2",
  "ignore_unavailable": true,
  "include_global_state": false
}
```

查看进度：

```http
GET /_snapshot/local_backup/_all
GET /_snapshot/local_backup/snapshot_20261111/_status
```

### 4. 拷贝到目标集群

把 `/data/es-backup` 整个目录拷到目标集群相同路径。目标集群的 `path.repo` 也要配好，并注册**同名仓库**：

```http
PUT /_snapshot/local_backup
{
  "type": "fs",
  "settings": {
    "location": "/data/es-backup",
    "compress": true
  }
}
```

### 5. 恢复

```http
POST /_snapshot/local_backup/snapshot_20261111/_restore
{
  "indices": "index_1,index_2",
  "ignore_unavailable": true,
  "include_global_state": false,
  "rename_pattern": "(.+)",
  "rename_replacement": "$1"
}
```

如果目标集群已有同名索引，先确认是否要覆盖。恢复时可以用 `rename_pattern` / `rename_replacement` 改名，避免直接覆盖生产索引。

### 6. 验证

```http
GET _cat/indices?v&s=index
GET index_1/_count
GET index_1/_mapping
GET index_1/_settings
```

## 三、方案 B：Reindex API

适合少量索引、按条件迁移、或者只想重建部分数据。

### 1. 目标集群放行源地址

在目标集群 `elasticsearch.yml` 中加：

```yaml
reindex.remote.whitelist: "source-es:9200,192.168.0.10:9200"
```

重启目标集群。不要写成 `*`，生产环境按源地址白名单放行。

### 2. 执行 Reindex

```http
POST _reindex?wait_for_completion=false
{
  "source": {
    "remote": {
      "host": "http://source-es:9200",
      "username": "elastic",
      "password": "<源集群密码>"
    },
    "index": "old_index",
    "size": 1000
  },
  "dest": {
    "index": "new_index"
  }
}
```

返回一个 `task` ID，用下面的命令看进度：

```http
GET _tasks/<task_id>
```

### 3. 多索引迁移与改名

```http
POST _reindex?wait_for_completion=false
{
  "source": {
    "remote": {
      "host": "http://source-es:9200",
      "username": "elastic",
      "password": "<源集群密码>"
    },
    "index": "old_prefix_*"
  },
  "dest": {
    "index": "new_prefix"
  },
  "script": {
    "lang": "painless",
    "source": "ctx._index = 'new_' + ctx._index"
  }
}
```

### 4. 注意事项

- `wait_for_completion=false` 避免 HTTP 超时；大任务必须异步。
- 源集群有删除操作时，Reindex 不会同步删除。
- 目标索引最好提前建好 mapping，不要让 ES 动态映射。
- 网络不稳定时加 `source.size`、重试，必要时分批按时间范围迁。
- 版本跨度大时，字段类型和 analyzer 可能不兼容，先迁一个索引验证。

## 四、方案 C：Logstash 持续同步

适合不能停写、需要边迁移边验证的场景。注意：Logstash 适合“索引/更新”，**不负责删除同步**；源端删除的文档，目标端不会自动删。

### 1. ES → ES 配置

```ruby
input {
  elasticsearch {
    hosts => ["http://source-es:9200"]
    index => "source_index*"
    query => '{ "query": { "match_all": {} } }'
    scroll => "5m"
    size => 1000
    docinfo => true
    schedule => "* * * * *"
    user => "elastic"
    password => "<源集群密码>"
  }
}

filter {
  mutate {
    remove_field => ["@version"]
  }
}

output {
  elasticsearch {
    hosts => ["http://target-es:9200"]
    index => "%{[@metadata][_index]}"
    document_id => "%{[@metadata][_id]}"
    action => "index"
    user => "elastic"
    password => "<目标集群密码>"
  }
}
```

### 2. 增量同步

把 `query` 换成时间范围：

```ruby
query => '{
  "query": {
    "range": {
      "@timestamp": { "gte": "now-1h" }
    }
  }
}'
```

`schedule` 每分钟跑一次，适合做过渡期双写。切换完成后要停掉 Logstash，避免重复写入。

### 3. 数据库 → ES

如果源是 PostgreSQL/MySQL，用 JDBC input：

```ruby
input {
  jdbc {
    jdbc_driver_library => "/data/logstash/postgresql-42.7.4.jar"
    jdbc_driver_class => "org.postgresql.Driver"
    jdbc_connection_string => "jdbc:postgresql://10.0.0.20:5432/app_db"
    jdbc_user => "app_user"
    jdbc_password => "<数据库密码>"
    schedule => "* * * * *"
    statement => "SELECT id, title, content, updated_at FROM article WHERE updated_at > :sql_last_value"
    use_column_value => true
    tracking_column => "updated_at"
    tracking_column_type => "timestamp"
    last_run_metadata_path => "/data/logstash/.logstash_jdbc_last_run"
  }
}
```

`tracking_column` 做增量，`document_id => "%{id}"` 保证幂等更新。

## 五、迁移后校验清单

- [ ] 文档数与源集群一致（允许迁移期间新增的差异）
- [ ] 抽样文档字段、中文分词、日期格式正确
- [ ] Mapping 没有变成动态映射，字段类型一致
- [ ] 分片数、副本数、`refresh_interval` 符合目标集群规划
- [ ] 别名、索引模板、ILM 策略已迁移
- [ ] 搜索接口的召回和排序与源集群对比无明显差异
- [ ] 写入切换后，源集群停止写入或改为只读
- [ ] 保留旧集群快照和只读权限，确认观察期结束后再下线

## 六、常见坑

**1. 快照仓库路径不一致**  
目标集群注册的仓库名和路径必须与源集群一致，否则恢复时找不到快照。

**2. 版本降级恢复**  
从 8.x 快照恢复到 7.x 不支持。跨大版本先升级目标集群，或改用 Reindex/Logstash。

**3. Reindex 同步超时**  
大索引不要同步等待，使用 `wait_for_completion=false`，并监控 `_tasks`。

**4. Logstash 重复写入**  
`document_id` 必须设置，否则每次 schedule 都会新增文档。

**5. 忽略删除同步**  
Logstash/Reindex 都不同步删除。迁移期如果有删除，切换前要做一次全量对齐或人工清理。

**6. 迁移后没改副本和刷新间隔**  
迁移时为了速度常把 `refresh_interval` 设为 `-1`、副本设为 0，迁完忘记改回来，搜索延迟和可用性都会出问题。

## FAQ

**Q：快照迁移需要停写吗？**  
A：创建快照时可以不停止写入，但快照只代表某个时间点。切换前要停止写入或记录增量，避免丢数据。

**Q：Reindex 能跨版本吗？**  
A：一般可以从低版本迁到高版本，反向不支持。跨大版本先查官方兼容矩阵。

**Q：Logstash 能同步删除吗？**  
A：标准 ES output 不做删除同步。需要删除时，用自定义脚本或业务侧双写删除标记，再在目标集群执行 delete by query。

**Q：迁移后搜索变慢怎么办？**  
A：先看分片数、副本数、`refresh_interval`、堆内存和磁盘水位，再对比 mapping 和 analyzer。不要一上来就加节点。

## 相关阅读

- [Elasticsearch 集群运维与容量规划](/blog/elasticsearch-cluster-ops)
- [麒麟 V10 ARM 离线部署 Nginx、MySQL 8 与 Redis](/blog/kylin-v10-arm-offline-deploy)

我们做过 Elasticsearch 跨集群迁移、索引治理与日志平台交付。有类似需求可以看[项目案例](/cases)或[联系我们](/#contact)。
