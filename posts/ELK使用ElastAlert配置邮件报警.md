--- 
date: '2023-04-20'
---

 **安装 ElastAlert** ：使用 pip 安装 ElastAlert：
```
  pip install elastalert
```

**配置 ElastAlert** ：创建一个配置文件 `config.yaml`，配置 Elasticsearch 和 SMTP：


```
 
es_host: localhost
es_port: 9200
rules_folder: /root/elastAlert/rules
run_every:
  minutes: 1
buffer_time:
  minutes: 15
alert_time_limit:
  days: 2
smtp_host: smtp.qq.com
smtp_port: 465
from_addr: test@qq.com
smtp_auth_file: /root/elastAlert/smtp_auth_file
writeback_index: elastalert_status
start_date: 2024-07-12T00:00:00Z

```
`smtp_auth_file` 文件内容格式如下：
```
user: "your_email@example.com"
password: "your_email_password"
```


**创建报警规则** ：在 `rules_folder` 中创建一个规则文件 `error_log.yaml`：

```
name: China Error Logs
type: any
index: logstash-*
filter:
- query:
    query_string:
      query: "message:*中国*"
alert:
- "email"
email:
- "admin@example.com"

```

**运行 ElastAlert** 启动 ElastAlert：
```
elastalert --config /path/to/config.yaml
```


注意如果提示缺失ES状态索引，如elastalert_status，可以手动创建  

````

PUT /elastalert_status
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  },
  "mappings": {
    "properties": {
      "@timestamp": {
        "type": "date"
      },
      "alert_time": {
        "type": "date"
      }
    }
  }
}


```