Logstash 配置：将数据从一个 Elasticsearch 同步到另一个 Elasticsearch

Logstash配置信息如下：

```
input {
  elasticsearch {
    hosts => ["http://source-es-node1:9200"]  # 源ES集群地址
    index => "source_index*"                # 要同步的索引名，支持通配符
    query => '{ "query": { "match_all": {} } }'  # 查询条件，默认匹配所有文档
    scroll => "5m"                          # 滚动时间
    size => 1000                            # 每次批量获取的文档数
    docinfo => true                         # 保留文档元数据
    schedule => "* * * * *"                 # 定时任务，每分钟执行一次（持续同步）
    # schedule => "@once"                   # 只执行一次（全量同步）
  }
}

filter {
  # 这里可以添加任何需要的过滤处理
  # 例如移除某些字段、重命名字段等
  
  # 示例：移除某些不需要的字段
  mutate {
    remove_field => ["@timestamp", "@version"]
  }
}

output {
  elasticsearch {
    hosts => ["http://target-es-node1:9200"]  # 目标ES集群地址
    index => "%{[@metadata][_index]}"      # 保持与源索引相同的名称
    document_id => "%{[@metadata][_id]}"   # 保持与源文档相同的ID
    action => "index"                      # 默认操作是索引文档
    # 如果目标集群需要认证
    user => "elastic"
    password => "your_password"
    # 如果使用HTTPS
    ssl => true
    cacert => "/path/to/cert.pem"
  }
  
  # 可选：输出到控制台用于调试
  stdout {
    codec => rubydebug
  }
}
```
 
### 使用说明

将上述配置保存为 es-to-es.conf 文件

运行 Logstash 指定该配置文件：

bin/logstash -f es-to-es.conf


## 高级配置选项

增量同步：基于时间戳只同步新增或修改的文档，直接修改query参数即可

```
input {
  elasticsearch {
    # ...其他配置...
    query => '{
      "query": {
        "range": {
          "@timestamp": {
            "gte": "now-1h"  # 只同步最近1小时的数据
          }
        }
      }
    }'
  }
}
```
