---
title: 麒麟 V10 ARM 离线部署 Nginx、MySQL 8 与 Redis：完整步骤与坑位清单
description: 在麒麟 V10 aarch64 内网环境离线安装 Nginx、MySQL 8.0 和 Redis 的完整步骤，包含依赖包、编译参数、systemd、初始化、安全配置与常见报错处理。
date: '2023-06-01'
updated: '2026-11-11'
tags: [信创, 麒麟V10, ARM64, Nginx, MySQL, Redis, 离线部署]
author: 鲸码研发团队
draft: false
---

## 先说结论

麒麟 V10 + ARM64 的离线部署，难点不在“命令会不会”，而在三件事：

1. **包必须是 aarch64 架构**，x86_64 的 rpm 直接装不上。
2. **Nginx 编译时的 OpenSSL / PCRE / Zlib 源码版本要对齐**，否则会出现“编译通过但 HTTPS 不可用”或版本串包。
3. **MySQL 的 `datadir`、`lower_case_table_names` 必须在初始化前确定**，初始化后再改会起不来。

下面是一套在麒麟 V10 aarch64 内网环境实际用过的部署顺序。版本不同时，命令和包名需要相应调整。

## 适用环境

| 项目 | 建议版本 |
|---|---|
| 操作系统 | 麒麟 V10 SP1/SP2 aarch64 |
| Nginx | 1.20.x 或 1.24.x（源码编译） |
| MySQL | 8.0.28+（aarch64 rpm bundle） |
| Redis | 5.0.5+（aarch64 rpm） |
| 权限 | root 或具备 sudo 的部署账号 |

先确认架构：

```bash
uname -m
# 期望输出：aarch64
cat /etc/os-release
getenforce
systemctl status firewalld
```

如果是 `x86_64`，后面的 ARM 包全部不适用。

## 一、离线包准备

把下面这些包提前下载好，传到内网服务器 `/opt/offline`：

```text
nginx-1.20.2.tar.gz
pcre-8.44.tar.gz
zlib-1.2.11.tar.gz
openssl-1.1.1l.tar.gz
redis-5.0.5-1.el7.aarch64.rpm
mysql-8.0.28-1.el8.aarch64.rpm-bundle.tar
```

建议同时准备：

- `gcc`、`gcc-c++`、`make`、`tar`、`unzip`
- MySQL 依赖：`libaio`、`numactl-libs`、`ncurses-compat-libs`
- Redis 依赖：`jemalloc`（部分 rpm 已内置）

内网没有 yum 源时，用系统 ISO 做本地源：

```bash
mkdir -p /mnt/kylin-iso
mount -o loop /opt/offline/Kylin-Server-V10.iso /mnt/kylin-iso

cat > /etc/yum.repos.d/kylin-local.repo <<'EOF'
[kylin-local]
name=Kylin Local ISO
baseurl=file:///mnt/kylin-iso
enabled=1
gpgcheck=0
EOF

yum clean all
yum makecache
```

## 二、Nginx 源码编译

### 1. 解压依赖

```bash
cd /opt/offline
tar -xzf pcre-8.44.tar.gz
tar -xzf zlib-1.2.11.tar.gz
tar -xzf openssl-1.1.1l.tar.gz
tar -xzf nginx-1.20.2.tar.gz
```

### 2. 编译安装

```bash
cd /opt/offline/nginx-1.20.2

./configure \
  --prefix=/usr/local/nginx \
  --with-http_ssl_module \
  --with-http_gzip_static_module \
  --with-http_realip_module \
  --with-pcre=/opt/offline/pcre-8.44 \
  --with-zlib=/opt/offline/zlib-1.2.11 \
  --with-openssl=/opt/offline/openssl-1.1.1l

make -j"$(nproc)"
make install
```

> 注意：`--with-openssl` 指向的是 **OpenSSL 源码目录**，不是安装目录。PCRE、Zlib 同理。

### 3. 配置 systemd

```bash
cat > /etc/systemd/system/nginx.service <<'EOF'
[Unit]
Description=nginx
After=network.target

[Service]
Type=forking
PIDFile=/usr/local/nginx/logs/nginx.pid
ExecStartPre=/usr/local/nginx/sbin/nginx -t
ExecStart=/usr/local/nginx/sbin/nginx
ExecReload=/usr/local/nginx/sbin/nginx -s reload
ExecStop=/usr/local/nginx/sbin/nginx -s quit
PrivateTmp=true

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now nginx
systemctl status nginx
```

### 4. 验证

```bash
/usr/local/nginx/sbin/nginx -V
curl -I http://127.0.0.1
```

`nginx -V` 输出里应能看到 `--with-http_ssl_module` 和对应的 OpenSSL 版本。

## 三、Redis 安装

### 1. 安装 rpm

```bash
cd /opt/offline
rpm -ivh redis-5.0.5-1.el7.aarch64.rpm
```

如果提示已安装旧包：

```bash
rpm -qa | grep -i redis
rpm -e --nodeps <旧包名>
```

### 2. 修改配置

配置文件通常在 `/etc/redis.conf`：

```bash
cp /etc/redis.conf /etc/redis.conf.bak
vi /etc/redis.conf
```

建议至少改这几项：

```conf
bind 127.0.0.1 10.0.0.10
protected-mode yes
port 6379
daemonize yes
requirepass <替换为强密码>
appendonly yes
```

- 不要直接 `bind 0.0.0.0` 暴露到公网。
- 内网多机访问时，绑定内网网卡 IP，不要图省事全开。
- 密码用 16 位以上随机串，不要使用默认密码或弱口令。

### 3. 启动与验证

```bash
systemctl enable --now redis
systemctl status redis
redis-cli -h 127.0.0.1 -p 6379 -a '<强密码>' ping
# 期望：PONG
```

## 四、MySQL 8 安装

### 1. 清理 MariaDB

麒麟系统可能自带 MariaDB，先确认再卸载：

```bash
rpm -qa | grep -i mariadb
rpm -qa | grep -i mysql

rpm -e --nodeps mariadb-libs
rpm -e --nodeps mariadb-server
```

### 2. 解压并安装

```bash
cd /opt/offline
tar -xf mysql-8.0.28-1.el8.aarch64.rpm-bundle.tar
```

按依赖顺序安装：

```bash
rpm -ivh mysql-community-common-8.0.28-1.el8.aarch64.rpm
rpm -ivh mysql-community-client-plugins-8.0.28-1.el8.aarch64.rpm
rpm -ivh mysql-community-libs-8.0.28-1.el8.aarch64.rpm
rpm -ivh mysql-community-client-8.0.28-1.el8.aarch64.rpm
rpm -ivh mysql-community-icu-data-files-8.0.28-1.el8.aarch64.rpm
rpm -ivh mysql-community-server-8.0.28-1.el8.aarch64.rpm
```

如果提示缺依赖：

```bash
yum install -y libaio numactl-libs ncurses-compat-libs
```

### 3. 配置 my.cnf

```bash
mkdir -p /data/mysql-data
chown -R mysql:mysql /data/mysql-data

cat > /etc/my.cnf <<'EOF'
[mysqld]
user=mysql
port=3306
datadir=/data/mysql-data
socket=/var/lib/mysql/mysql.sock

innodb_buffer_pool_size=4G
innodb_log_file_size=1G
innodb_log_buffer_size=128M
character-set-server=utf8mb4
collation-server=utf8mb4_0900_ai_ci
lower_case_table_names=1
default-time-zone='+08:00'
max_connections=500

[client]
default-character-set=utf8mb4
EOF
```

`lower_case_table_names` 一定要在初始化前确定。初始化后再改，MySQL 可能直接拒绝启动。

### 4. 初始化

```bash
mysqld --initialize --console
```

记录输出的临时密码。然后：

```bash
chown -R mysql:mysql /data/mysql-data /var/lib/mysql
systemctl enable --now mysqld
systemctl status mysqld
grep 'temporary password' /var/log/mysqld.log
```

### 5. 修改密码与创建业务账号

```bash
mysql -u root -p
```

```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY '<替换为强密码>';

CREATE USER 'app_user'@'10.0.0.%' IDENTIFIED BY '<替换为强密码>';
CREATE DATABASE app_db CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
GRANT SELECT, INSERT, UPDATE, DELETE ON app_db.* TO 'app_user'@'10.0.0.%';
FLUSH PRIVILEGES;
```

生产环境不建议直接创建 `root@'%'`。应用用独立账号，按库授权。

### 6. 验证

```bash
mysql -u app_user -p -h 10.0.0.10 -e "SELECT VERSION(); SHOW DATABASES;"
ss -lntp | grep 3306
```

## 五、上线前检查清单

- [ ] `uname -m` 是 `aarch64`
- [ ] Nginx `-V` 里 SSL 模块和 OpenSSL 版本正确
- [ ] `nginx -t` 通过，systemd 能开机自启
- [ ] Redis 绑定内网 IP，已设置 `requirepass`
- [ ] MySQL `datadir` 权限正确，`lower_case_table_names` 在初始化前设置
- [ ] 应用使用独立数据库账号，没有开放 `root@%`
- [ ] firewalld / SELinux 策略已确认，只放行必要端口
- [ ] 时间同步（chrony）正常，避免证书和日志时间错乱
- [ ] 备份目录、日志轮转、磁盘告警已配置

## 六、常见坑

**1. OpenSSL 版本对不上**  
下载的是 `openssl-1.1.1d`，编译参数写的是 `openssl-1.1.1l`，会直接找不到目录。统一版本，别混用。

**2. 路径拼写错误**  
`/usr/locla/nginx/sbin/nginx` 这种错在复制命令时很常见。用 `Tab` 补全，别手敲。

**3. MySQL 初始化后改 datadir**  
初始化会把系统库写到旧目录，改完配置再启动会报错。先规划好目录，再初始化。

**4. Redis 直接 `bind 0.0.0.0`**  
内网也不是绝对安全。绑定具体网卡，配强密码，安全组只放行应用服务器。

**5. 忽略 `lower_case_table_names`**  
Linux 默认大小写敏感，业务从 Windows/MySQL 迁移过来时，表名大小写会炸。初始化前决定。

**6. 只装服务，不做开机自启**  
`systemctl enable` 不能忘。内网服务器重启后服务没起来，排查成本很高。

## FAQ

**Q：Nginx 一定要源码编译吗？**  
A：不一定。如果内网源里有可用的 aarch64 rpm，优先用 rpm。需要特定模块或较新版本时再源码编译。

**Q：MySQL 用 el8 的 rpm 能在麒麟 V10 上装吗？**  
A：多数情况下可以，但要用 aarch64 包，并补齐 `libaio` 等依赖。上线前在测试机完整验证。

**Q：Redis 5.0.5 是不是太旧？**  
A：是偏旧。新项目建议 6.x/7.x，但必须先确认内网源和 aarch64 包是否齐全。旧版本要评估安全补丁。

**Q：能不能把这三套服务放一台机器？**  
A：测试可以，生产不建议。MySQL 和 Redis 对内存、磁盘 IO 的要求不同，混部容易互相影响。

## 相关阅读

- [Elasticsearch 集群运维与容量规划](/blog/elasticsearch-cluster-ops)
- [私有化 RAG 知识库落地指南](/blog/private-rag-knowledge-base)

我们做过麒麟/ARM 内网环境的中间件部署与迁移，涉及 Nginx、MySQL、Redis、Elasticsearch 等。有类似场景可以看[项目案例](/cases)或[联系我们](/#contact)。
