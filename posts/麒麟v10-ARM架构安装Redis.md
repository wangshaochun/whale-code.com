--- 
date: '2023-08-12'
---

查看当前系统版本

`uname -a`

如果输出为 aarch64，则确认是 ARM64 架构

rpm下载地址

`wget https://repo.huaweicloud.com/kunpeng/yum/el/7/aarch64/Packages/bigdata/redis-5.0.5-1.el7.aarch64.rpm`

检查是否已经安装Redis

`rpm -qa | grep redis`

如果存在已安装包则卸载掉

`rpm -e --nodeps  pcp-pmda-redis-4.1.3-13.p04.ky10.aarch64`

开始安装

`rpm -ivh  redis-5.0.5-1.el7.aarch64.rpm `


查找Redis配置文件, 正在安装在/etc/redis.conf

`find / -name "redis.conf"`

修改redis的配置
```
vi /etc/redis.conf


将bind 127.0.0.1 改成了 bind 0.0.0.0

修改默认端口
把6379改成自己想要的端口

启动守护进程
daemonize no 改为 daemonize yes

如果需要修改Redis密码
requirepass foobared 改为  requirepass 你的密码

启动Redis
redis-server /etc/redis.conf

查看Redis启动状态
ps -ef | grep redis
```