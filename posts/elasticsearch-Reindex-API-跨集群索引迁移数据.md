--- 
date: '2023-10-22' 
---


### 指定允许的远程主机

Elasticsearch 默认不允许从任意远程主机进行 reindex 操作,需要手动修改配置。
在目标集群的 elasticsearch.yml 配置文件中添加 reindex.remote.whitelist 设置
```
#如原服务器IP是192.168.0.2 （多个使用逗号分割 如："192.168.0.2:9200, 192.168.0.3:9200"）
reindex.remote.whitelist: "192.168.0.2:9200"
```
### 执行reindex 命令

```
POST _reindex
{
  "source": {
    "remote": {
      "host": "http://192.168.0.2:9200",
      "username": "elastic",
      "password": "123456"
    },
    "index": "old_index"
  },
  "dest": {
    "index": "new_index"
  }
}
```


### 同时迁移多个索引
```
POST _reindex
{
  "source": {
    "remote": {
      "host": "http://192.168.0.2:9200",
      "username": "elastic",
      "password": "123456"
    },
    "index": "index_prefix_*"
  },
  "dest": {
    "index": "new_index_prefix_{{index}}"
  },
  "script": {
    "lang": "painless",
    "source": "ctx._index = 'new_' + ctx._index"
  }
}
```

注： 如数据量超过1G建议使用快照方式传输