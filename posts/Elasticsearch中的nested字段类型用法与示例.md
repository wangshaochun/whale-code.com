--- 
date: '2023-09-30'
---

nested:嵌套对象, 用于数组中的元素是对象的 `[{}, {}]` 的复杂数据结构的字段类型。

主要特点:

1. 保持对象完整性: 每个嵌套对象被索引为单独的隐藏文档。
2. 关系保留: 对象内部字段之间的关系得以保持。
3. 可独立查询: 使用nested查询来搜索嵌套对象。

通过一个示例理解nested类型:

```json
{
  "mappings": {
    "properties": {
      "user": {
        "type": "nested",
        "properties": {
          "name": { "type": "text" },
          "age": { "type": "integer" },
          "accounts": {
            "type": "nested",
            "properties": {
              "bank": { "type": "keyword" },
              "balance": { "type": "float" }
            }
          }
        }
      }
    }
  }
}

```

在这个例子中,我们定义了一个user字段,它是一个nested类型。user字段包含name、age和accounts属性。accounts本身也是一个nested类型,包含bank和balance属性。

新增记录:


```json
{
  "user": [
    {
      "name": "John Doe",
      "age": 30,
      "accounts": [
        { "bank": "Bank A", "balance": 1000.50 },
        { "bank": "Bank B", "balance": 2500.75 }
      ]
    },
    {
      "name": "Jane Smith",
      "age": 25,
      "accounts": [
        { "bank": "Bank C", "balance": 3500.00 }
      ]
    }
  ]
}

```

查找年龄大于25岁且在Bank A的账户余额超过1000的用户:


```json
{
  "query": {
    "nested": {
      "path": "user",
      "query": {
        "bool": {
          "must": [
            { "range": { "user.age": { "gt": 25 } } },
            {
              "nested": {
                "path": "user.accounts",
                "query": {
                  "bool": {
                    "must": [
                      { "term": { "user.accounts.bank": "Bank A" } },
                      { "range": { "user.accounts.balance": { "gt": 1000 } } }
                    ]
                  }
                }
              }
            }
          ]
        }
      }
    }
  }
}

```

这个查询使用了两层nested查询: 一层用于user字段,另一层用于accounts字段。这确保了我们可以正确地匹配同一个用户对象内的年龄条件和账户条件。

使用nested类型的注意事项:

1. 性能影响: nested查询比普通查询更复杂,可能会影响查询性能。
2. 存储开销: 每个嵌套对象都作为单独的文档存储,会增加存储空间的使用。
3. 更新成本: 更新嵌套对象需要重新索引整个文档。
4. 嵌套索引中的最大字段数默认为50个，索引具有100个嵌套字段的1个文档实际上索引101个文档，因为每个嵌套文档都被索引为一个单独的隐藏文档。在索引中定义太多字段的情况可能导致映射爆炸
