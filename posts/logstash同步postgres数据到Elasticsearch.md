--- 
date: '2023-06-11'
---

> 需要logstash与ES版本一致，以下以7.8.1版本为例
> 需要用到PG驱动，自行搜索下载即可

```

input {
  jdbc {
    jdbc_driver_library => "/data/logstash-7.8.1/postgresql-42.2.9.jar"
    jdbc_driver_class => "org.postgresql.Driver" 
    jdbc_connection_string => "jdbc:postgresql://10.10.1.123:5432/data_process"
    jdbc_user => "postgres"
    jdbc_password => "test"
    # schedule => "* * * * *"  # 每分钟运行一次,注释后只执行一次
    # statement_filepath => "/data/logstash-7.8.1/query.sql"  # 复杂SQL可以使用单独语句，如避免字段是关键字问题
    statement => " SELECT id,sys_create_time,name,title FROM t1.testtable "
  }
}

filter {
  date {
    match => ["sys_create_time", "ISO8601"] # 转换ES识别的时间格式
    target => "sys_create_time" 
  } 
}

output {
  elasticsearch {
    hosts => ["http://10.10.1.123:9200"]
    index => "test"
    user => "elastic"
    password => "elastic@123" 
    document_id => "%{id}"
    #routing => "%{parent_id}" #关联文档用到
    action => "index"
  }
}
```
启动服务
```

./bin/logstash -f ./config/logstash-pg-es.conf
```
