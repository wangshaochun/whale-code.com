--- 
date: '2023-11-12'
---


>下载工具 kubectl 

1.  查询需要调试的pod
``` 
kubectl get pods|grep  cloud-admin
```
2. 执行端口映射命令
```
kubectl --kubeconfig  ~/.kube/dev  port-forward  cloud-admin-deployment-c986b947c-9wwft  5005:5005
```
其中：`--kubeconfig ` 命令是指定配置文件使用 ` ~/.kube/dev` ,当有多个环境时用到

**断点调试**
务必使用线程调式，否则造成服务调用中断，健康检查失败，服务会被kill，使用调试如图，**断点上右键**：
![](https://codehelp.vip/upload/debug.jpeg)