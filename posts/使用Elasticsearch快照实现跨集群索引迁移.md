--- 
date: '2023-10-23' 
---

Elasticsearch的快照(Snapshot)功能是一种高效可靠的跨集群数据迁移方式，适合大规模数据迁移场景。
如果是小规模数据，参考 [elasticsearch-Reindex-API-跨集群索引迁移数据]

前提条件
 1.两个集群的Elasticsearch版本需要兼容
 2. 有足够的存储空间存放快照

方案概述
1. 在源集群创建本地快照
2. 手动将快照文件复制到目标集群
3. 在目标集群注册相同的快照仓库
4. 从复制的文件中恢复数据

详细步骤
1. 在源集群创建本地快照仓库

```
PUT /_snapshot/local_backup
{
  "type": "fs",
  "settings": {
    "location": "/path/to/local/backup",
    "compress": true
  }
}
```

2. 创建源索引的快照

```
PUT /_snapshot/local_backup/snapshot_1?wait_for_completion=true
{
  "indices": "index_1,index_2",
  "ignore_unavailable": true,
  "include_global_state": false
}
```

3. 手动复制快照文件 - 找到快照存储位置（上述配置中的/path/to/local/backup），将整个目录复制到目标服务器：

```bash
# 在源服务器打包快照
tar -czvf es_snapshot.tar.gz /path/to/local/backup

# 将打包文件传输到目标服务器
scp es_snapshot.tar.gz user@target_server:/tmp/

# 在目标服务器解压
ssh user@target_server "tar -xzvf /tmp/es_snapshot.tar.gz -C /path/to/target/backup/"
```

4. 在目标集群配置相同仓库 - 注意确保使用与源集群相同的仓库名称和路径：

```
PUT /_snapshot/local_backup
{
  "type": "fs",
  "settings": {
    "location": "/path/to/target/backup",
    "compress": true
  }
}
```

5. 验证快照可用性

```
GET /_snapshot/local_backup/_all

```

6. 恢复数据

```
POST /_snapshot/local_backup/snapshot_1/_restore
{
  "indices": "index_1,index_2",
  "ignore_unavailable": true,
  "include_global_state": false
}
```