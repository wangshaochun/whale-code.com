--- 
date: '2023-12-22'
---

### 查看当前系统版本

`uname -a`

如果输出为 aarch64，则确认是 ARM64 架构

### 安装包下载 

https://cdn.mysql.com/archives/mysql-8.0/mysql-8.0.28-1.el8.aarch64.rpm-bundle.tar

### 清理历史环境：

1.查看系统是否自带MySQL和MariaDB，并删除
```
rpm -qa | grep mysql
rpm -qa | grep mariadb
rpm -e --nodeps mariadb-libs
rpm -e mariadb-server --nodeps
yum -y remove mysql*
yum -y remove mariadb*
```


### 开始安装

1.解压

`tar -xvf mysql-8.0.28-1.el8.aarch64.rpm-bundle.tar`

2.安装必须软件（务必根据顺序来）

```
rpm -ivh mysql-community-common-8.0.28-1.el8.aarch64.rpm
rpm -ivh mysql-community-client-plugins-8.0.28-1.el8.aarch64.rpm
rpm -ivh mysql-community-libs-8.0.28-1.el8.aarch64.rpm
rpm -ivh mysql-community-client-8.0.28-1.el8.aarch64.rpm
rpm -ivh mysql-community-icu-data-files-8.0.28-1.el8.aarch64.rpm
rpm -ivh mysql-community-server-8.0.28-1.el8.aarch64.rpm

```

3.修改配置文件
```
vim /etc/my.cnf

[mysqld]
innodb_buffer_pool_size = 10G
innodb_log_file_size = 1G
innodb_log_buffer_size = 128M
#修改数据存在地址
datadir=/data/mysql-data
#数据库大小写不敏感
lower_case_table_names=1

```

4.初始化数据库
`mysqld --initialize --console`

5.目录授权

`chown -R mysql:mysql /var/lib/mysql/`

`chown -R mysql:mysql /data/mysql-data/`

6.启动mysql服务

`systemctl start mysqld`

7.查看临时密码

`cat /var/log/mysqld.log`

8.用临时密码登录

`mysql -u root -p`

如果mysql不是系统命令、编辑下环境变量
```
vim /etc/profile

末尾加上一行：

export PATH=$PATH:/usr/bin/mysql
```

9.修改密码

`ALTER USER 'root'@'localhost' IDENTIFIED BY '8@123456';`

10.设置远程访问
```
CREATE USER 'root'@'%' IDENTIFIED BY '8@123456';

GRANT ALL ON  *.*  TO 'root'@'%';

FLUSH PRIVILEGES;

```