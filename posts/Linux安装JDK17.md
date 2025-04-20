--- 
date: '2023-09-20'
---

 可参考下载地址： https://www.oracle.com/java/technologies/downloads/?er=221886#java17 

### 执行以下命令安装
```

wget https://download.oracle.com/java/17/latest/jdk-17_linux-x64_bin.tar.gz
# 解压
tar -zxf jdk-17_linux-x64_bin.tar.gz -C /usr/local
#添加环境变量
echo "export JAVA_HOME=/usr/local/jdk-17.0.12" >>/etc/profile
echo 'export CLASSPATH=.:${JAVA_HOME}/jre/lib/rt.jar:${JAVA_HOME}/lib/dt.jar:${JAVA_HOME}/lib/tools.jar' >>/etc/profile
echo 'export PATH=$PATH:${JAVA_HOME}/bin' >>/etc/profile

#刷新配置生效
source /etc/profile

```

验收java环境变量是否生效

` java -version `
