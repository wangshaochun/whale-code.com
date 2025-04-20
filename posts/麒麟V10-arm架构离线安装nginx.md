--- 
date: '2023-06-01'
---

1、用到的安装包下载地址：
```
https://nginx.org/download/nginx-1.20.2.tar.gz
https://buildpack.oss-cn-shanghai.aliyuncs.com/static/r6d/nginx/nginx-compile-lib/pcre-8.44.tar.gz
https://buildpack.oss-cn-shanghai.aliyuncs.com/static/r6d/nginx/nginx-compile-lib/zlib-1.2.11.tar.gz
https://buildpack.oss-cn-shanghai.aliyuncs.com/static/r6d/nginx/nginx-compile-lib/openssl-1.1.1d.tar.gz

```
2、安装 pcre-8.44，root用户依次执行如下命令
```
cd /opt/
tar -xvf pcre-8.44.tar.gz
cd pcre-8.44
./configure
make
make install
```

3、安装 openssl-1.1.1l，root依次执行如下命令
```
cd /opt/
tar -xvf openssl-1.1.1d.tar.gz
cd  openssl-1.1.1d
./config
make
make install
```

4、安装 zlib-1.2.11，root依次执行如下命令

```
cd /opt/
tar -xvf zlib-1.2.11.tar.gz
cd zlib-1.2.11
./configure
make
make install
```

3、安装nginx，可普通用户
```
cd /opt/
tar -xvf nginx-1.20.2.tar.gz
cd nginx-1.20.2

# 安装nginx（如果这里执行不了，使用root用户执行下面的make && make install）

./configure --prefix=/usr/local/nginx --with-http_ssl_module --with-openssl=/opt/openssl-1.1.1l --with-pcre=/opt/pcre-8.44 --with-zlib=/opt/zlib-1.2.11

make && make install
```
```
./configure --prefix=/usr/local/nginx \
            --with-pcre=../pcre-8.44 \
            --with-zlib=../zlib-1.2.11 \
            --with-openssl=../openssl-1.1.1l \
            --with-http_ssl_module
```

4、执行nginx，普通用户

```
启动运行nginx
/usr/locla/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf

# 或进入 /usr/local/nginx/sbin
# 执行脚本：./nginx

```