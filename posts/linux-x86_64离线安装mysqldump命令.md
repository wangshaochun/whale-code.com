---
title: linux x86_64 离线安装mysqldump 命令
date: '2024-01-20'
---

在 Linux x86_64 系统上离线安装 mysqldump 命令， 下载相关rpm安装包
下载地址(如linux 8.x版本将下载地址中`el7`改为`el8`版本即可)：
```
wget https://dev.mysql.com/get/mysql-community-client-8.0.28-1.el7.x86_64.rpm
wget https://dev.mysql.com/get/mysql-community-client-plugins-8.0.28-1.el7.x86_64.rpm
wget https://dev.mysql.com/get/mysql-community-common-8.0.28-1.el7.x86_64.rpm
wget https://dev.mysql.com/get/mysql-community-libs-8.0.28-1.el7.x86_64.rpm

```
执行安装命令
```
sudo rpm -ivh mysql-community-common-8.0.28-1.el7.x86_64.rpm
sudo rpm -ivh mysql-community-client-plugins-8.0.28-1.el7.x86_64.rpm
sudo rpm -ivh mysql-community-libs-8.0.28-1.el7.x86_64.rpm
sudo rpm -ivh mysql-community-client-8.0.28-1.el7.x86_64.rpm

```
测试命令 `mysqldump`
```
[root@iZ2ze16fkp9j3so1500qrtZ ~]# mysqldump
Usage: mysqldump [OPTIONS] database [tables]
OR     mysqldump [OPTIONS] --databases [OPTIONS] DB1 [DB2 DB3...]
OR     mysqldump [OPTIONS] --all-databases [OPTIONS]
For more options, use mysqldump --help


```
