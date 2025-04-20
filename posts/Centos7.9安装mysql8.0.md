--- 
date: '2023-05-11'
---

![](https://codehelp.vip/upload/微信截图_20240807123607.png)
# 安装前检查

**1. 检查历史版本**

```bash
rpm -qa | grep -i mysql
rpm -qa | grep -i mariadb
```


**2. 卸载历史版本（如已安装过）**

```bash
yum remove -y mysql*
yum remove -y mariadb*
```


**3. 清理残留数据目录及文件**

- 删除安装目录（示例）

```bash
# 获取安装目录
whereis mysql

# 删除安装目录
rm -rf /usr/lib64/mysql /usr/share/mysql
```

- 删除数据目录（示例）

```bash
rm -rf /var/lib/mysql
```

- 删除配置文件（示例）

```bash
rm -rf /etc/my.cnf
```

- 删除日志文件（示例）

```bash
rm -rf /var/log/mysql
rm -rf /var/log/mysqld.log
```

- 删除临时文件（示例）

```bash
rm -rf /tmp/mysql*
```

- 删除服务和启动脚本（示例）

```bash
rm -rf /etc/init.d/mysql
rm -rf /usr/lib/systemd/system/mysql.service
```

【注意】以上清理目录或文件均参考默认安装，具体清理时请以实际安装为准。

# 开始安装

**1. 下载mysql官方yum源**

```bash
wget  https://dev.mysql.com/get/mysql80-community-release-el7-3.noarch.rpm
```


**2. 安装官方yum源**

```bash
rpm -ivh mysql80-community-release-el7-3.noarch.rpm
```

**3. 更新yum源缓存**

```bash
# 清理yum缓存目录
yum clean all

# 重新上传yum缓存
yum makecache
```

**4. 导入GPG密钥**

```bash
rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2022
```

【说明】GPG密钥是处于安全考虑，用来验证下载的包是否是原始的、未被篡改的，如果不需要校验密钥，可在安装时加入`--nogpgcheck`参数跳过校验。

**5. 安装MySQL**

```bash
yum install -y mysql-community-server mysql-community --nogpgcheck

# 验证是否安装成功
mysql -V
```

**6. 启动 mysql 服务**

```bash
systemctl start mysqld
```

**7. 设置开机启动（可选）**

```bash
systemctl enable mysqld
```

**8. 查看root初始密码**

```bash
grep 'temporary password' /var/log/mysqld.log
```

**9. 登录mysql**

```bash
# 密码为上一步获取的初始密码
mysql -u root -p
```

**10. 修改密码**

```
ALTER USER 'root'@'localhost' IDENTIFIED BY '8@123qwe';

```


**11. 设置远程访问（可选）**

```sql
-- 可能异常，使用下面SQL
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '8@123qwe' WITH GRANT OPTION;

CREATE USER 'root'@'%' IDENTIFIED BY '8@123qwe';
GRANT ALL ON  *.*  TO 'root'@'%';
FLUSH PRIVILEGES;


```

至此，服务安装完毕。

其他命令
```

SELECT User, Host FROM mysql.user WHERE User = 'root';

ALTER USER 'root'@'%' IDENTIFIED BY '8@123qwe';

GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```