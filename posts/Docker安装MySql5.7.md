--- 
date: '2024-01-20'
---

### 拉取镜像
```
# 默认下载MySQL5.7最新版本(其他版本可以指定比如 docker pull mysql:5.7.34)
docker pull mysql:5.7

```

###  配置容器MySQL数据、配置、日志挂载宿主机目录

```
# 数据存放目录
mkdir -p /usr/local/docker_data/mysql5.7/data
#配置文件目录
mkdir -p /usr/local/docker_data/mysql5.7/conf
mkdir -p /usr/local/docker_data/mysql5.7/conf/mysql.conf.d
# 日志目录
mkdir -p /usr/local/docker_data/mysql5.7/logs
# 新增mysql配置文件
cd /usr/local/docker_data/mysql5.7/conf
vi mysql.conf
```
### 复制以下信息到mysql.conf
```
[mysql]
#设置mysql客户端默认字符集
default-character-set=UTF8MB4
 
[mysqld]
#设置3306端口
port=3306
 
#允许最大连接数
max_connections=200
 
#允许连接失败的次数
max_connect_errors=10
 
#默认使用“mysql_native_password”插件认证
default_authentication_plugin=mysql_native_password
 
#服务端使用的字符集默认为8比特编码的latin1字符集
character-set-server=UTF8MB4
 
#开启查询缓存
explicit_defaults_for_timestamp=true
 
#创建新表时将使用的默认存储引擎
default-storage-engine=INNODB
 
#等待超时时间秒
wait_timeout=60
 
#交互式连接超时时间秒
interactive-timeout=600
secure_file_priv=/var/lib/mysql
 
[client]
default-character-set=UTF8MB4


```


### 启动镜像
```
#增加--privileged=true参数，让容器拥有真正的root权限
docker run --privileged=true --name mysql5.7 -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 -d  -v /usr/local/docker_data/mysql5.7/data:/var/lib/mysql -v /usr/local/docker_data/mysql5.7/conf:/etc/mysql/ -v /usr/local/docker_data/mysql5.7/logs:/var/log/mysql mysql:5.7
```

### 配置mysql 可远程访问
```
#查看容器ID
[root@iZ2ze16fkp9j3so1500qrtZ docker_data]# docker ps 
CONTAINER ID   IMAGE                        COMMAND                   CREATED          STATUS          PORTS                                                  NAMES
06eb6be30844   mysql:5.7                    "docker-entrypoint.s…"   2 minutes ago    Up 2 minutes    33060/tcp, 0.0.0.0:3307->3306/tcp, :::3307->3306/tcp   mysql5.7

[root@iZ2ze16fkp9j3so1500qrtZ docker_data]#  docker exec -it  06eb6be30844 /bin/bash
root@06eb6be30844:/# mysql -u root -p
Enter password: 
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 2
Server version: 5.7.36 MySQL Community Server (GPL)

Copyright (c) 2000, 2021, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
mysql>  use mysql;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
mysql> grant all privileges  on *.* to root@'%' identified by "123456";
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> flush privileges;
Query OK, 0 rows affected (0.00 sec)


```


