--- 
date: '2023-09-09'
---

集群服务器是三台，**每台**都需要按以下步骤操作，有区别配置会单独标注

**安装包已上传服务器**

```
//解压到目录 /usr/local

sudo tar -zxvf elasticsearch-7.13.0-linux-x86_64.tar.gz  -C /usr/local

```

 将jdk修改为es中自带jdk的配置目录

```
cd /usr/local/elasticsearch-7.13.0

vi ./bin/elasticsearch-env

#添加到头部 （#!/bin/bash后）

export JAVA_HOME=/usr/local/elasticsearch-7.13.0/jdk
export PATH=$JAVA_HOME/bin:$PATH

if [ -x "$JAVA_HOME/bin/java" ]; then
        JAVA="/usr/local/elasticsearch-7.13.0/jdk/bin/java"
else
        JAVA=`which java`
fi
```

修改elasticsearch 默认分配 jvm 内存 (设置服务器内存的50%)，如32G则设置16G

```
 vi config/jvm.options

-Xms16G
-Xmx16G
```

ES 使用单独用户管理
```
# 添加单独的ES用户

useradd user-es  
```

设置端口、允许远程访问、ES节点名称、绑定集群IP(需要与IT确认)

```
vi  config/elasticsearch.yml

# 直接在底部添加  
cluster.name: audit-wiki
http.port: 9202
network.host: 0.0.0.0  
# 该节点是主节点
node.master: true
# 该节点存储数据
node.data: true
#注意此IP需要与IT确认，用于发现集群中的其他节点
discovery.seed_hosts: ["192.168.1.101", "192.168.1.102", "192.168.1.103"]
# 指定可选主节点的名称
cluster.initial_master_nodes: ["node-1", "node-2", "node-3"]

#注意 三台服务器节点 分别设置为node-1、node-2、node-3
node.name: node-1

```


注：与IT确定数据盘的路径，如何没有单独数据盘，可忽略

```
mkdir -p /data/es-data/
mkdir -p /data/es-logs/


chown user-es:user-es -R /data/es-data/
chown user-es:user-es -R /data/es-logs/

vi  config/elasticsearch.yml

#新增
path.data: /data/es-data
path.logs: /data/es-logs
```



解决 elasticsearch用户拥有的内存权限太小，至少需要 62144，解决办法：

```
在 /etc/sysctl.conf 文件最后添加如下内容，
 
vi /etc/sysctl.conf

#最后添加如下内容
vm.max_map_count=655360

#保存退出，刷新配置文件
sudo sysctl -p

```

解决 max file descriptors [4096] for elasticsearch process is too low, increase to at least [65535] 

 
```
vi /etc/security/limits.conf
#结尾添加如下内容 

* soft nofile 65536
* hard nofile 131072
* soft nproc 4096
* hard nproc 4096

```


 安装IK分词器插件，

```

cd /usr/local/elasticsearch-7.13.0/plugins
mkdir ik
cd ik

//上传elasticsearch-analysis-ik-7.13.0.zip 到此路径
//解压 即可
unzip elasticsearch-analysis-ik-7.13.0.zip

```



**以上操作每台服务器都需要执行**

之后依次使用专用用户启动ES
 
```
 
chown user-es:user-es -R /usr/local/elasticsearch-7.13.0

su user-es
/usr/local/elasticsearch-7.13.0/bin/elasticsearch -d
```


设置登录密码，也需要每台都添加

```
vi ./config/elasticsearch.yml
```
```
# 最后添加

xpack.security.enabled: true
xpack.security.transport.ssl.enabled: true
```

**重新启动ES**


再其中一台服务器中设置密码即可， 设置  elastic，apm_system，kibana，kibana_system，logstash_system，beats_system，remote_monitoring_user

```
./bin/elasticsearch-setup-passwords interactive

# 确认y后输入一直粘贴密码   qwertyu8J
```
 

设置默认中文分词，为所有新创建的索引设置默认的分词器，使用索引模板（index template），索引模板命令如下：

```
curl 'http://localhost:9202/_index_template/default_analyzers' --user elastic:qwertyu8J  -X PUT -H "Content-Type:application/json"  -d '
{
  "index_patterns": ["*"],
  "template": {
    "settings": {
      "analysis": {
        "analyzer": {
          "default": {
            "type": "ik_max_word"
          },
          "default_search": {
            "type": "ik_smart"
          }
        }
      }
    }
  },
  "priority": 1
}'

```
>  显示 {"acknowledged":true} 说明设置成功

#### 其他：
因ES默认只显示10000条记录，所以站点启动完成后，需要手动设置ES索引的最大查询数量

```
curl 'http://localhost:9202/_all/_settings' --user elastic:qwertyu8J  -X PUT -H "Content-Type:application/json"  -d '{ "index": {"max_result_window":5000000}}'

```



ES安装完！
