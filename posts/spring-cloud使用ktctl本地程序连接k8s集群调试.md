---
title: spring-cloud使用ktctl本地程序连接k8s集群调试
date: '2023-03-03'
---

1. 安装 ktctl
参考 https://developer.aliyun.com/article/751321

2. 添加k8s授权文件
认证文件地址默认再当前用户下的 .kube/config

3. 执行连接命令
`sudo ktctl connect`
4. 修改IDEA启动调试

```
spring.cloud.kubernetes.config.namespace  default
spring.cloud.kubernetes.client.namespace default
spring.main.allow-bean-definition-overriding true
run.model local
# nacos环境增加下面配置
spring.cloud.nacos.discovery.register-enabled  false
# 如果有其他个性化配置也需要添加，如ENC解密
jasypt.encryptor.password  123456
```
添加到如下位置:
![](/upload/20250113141249.png)