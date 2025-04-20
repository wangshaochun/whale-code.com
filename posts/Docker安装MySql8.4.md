--- 
date: '2023-11-11'
---

### 拉取镜像
```
# 默认下载MySQL8最新版本(其他版本可以指定比如 docker pull mysql:8.4)
docker pull mysql:8

```

###  配置容器MySQL数据、配置、日志挂载宿主机目录

```
# 数据存放目录
mkdir -p /data/mysql8/data
#配置文件目录
mkdir -p /data/mysql8/conf/conf.d
# 日志目录
mkdir -p /data/mysql8/logs
# 新增mysql配置文件
cd /data/mysql8/conf/conf.d
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
 docker run --privileged=true --name mysql8 -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 -d  -v /data/mysql8/data:/var/lib/mysql -v /data/mysql8/conf:/etc/mysql/ -v /data/mysql8/logs:/logs -v /data/mysql8/mysql-files:/var/lib/mysql-files mysql:8

```

### 配置mysql密码和可远程访问

8.0 版本发现密码添加失败(8.4版本正常)，使用命令再次添加 

```
#查看容器ID
docker ps 
docker exec -it  06eb6be30844 /bin/bash
 mysql -u root -p
#无密码两次回车即可
Enter password: 
 
mysql>  use mysql;
mysql> select user,host from user;
//设置密码
mysql>  ALTER user 'root'@'localhost' IDENTIFIED BY '123456';
//设置远程访问
mysql> update user set host='%' where user ='root';
Query OK, 0 rows affected, 1 warning (0.00 sec)
//刷新
mysql> flush privileges;
Query OK, 0 rows affected (0.00 sec)

```


