--- 
date: '2024-01-03'
---

>yum 默认安装的是很老的 redis，新版 redis 增加了很多新功能，需要手动指定 yum 源才能安装最新版 redis

首先，卸载旧版本 redis

```bash
$ sudo yum -y remove redis
```

添加 yum 源

```bash
$ sudo yum -y install http://rpms.remirepo.net/enterprise/remi-release-7.rpm  --skip-broken
```

安装 redis

```bash
$ sudo yum  install redis -y
```

启动 redis

```bash
$ sudo systemctl start redis
```
  
设置开机启动  
```
systemctl enable redis
```

设置允许非本机访问：
```
vim /etc/redis/redis.conf 

bind 127.0.0.1 -::1  改为  bind 0.0.0.0
```

设置一个redis访问密码

```
vim /etc/redis/redis.conf
# requirepass 你要设置的密码

```