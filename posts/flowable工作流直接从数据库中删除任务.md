---
title: Flowable 流程实例删不掉？运行时表与历史表的删除顺序、风险与替代方案
description: Flowable 流程实例删除失败时，直接删数据库的正确顺序、前置检查、备份与验证方法，并说明为什么优先使用 RuntimeService/HistoryService API。
date: '2025-04-20'
updated: '2026-11-11'
tags: [Flowable, 工作流, BPM, MySQL, 排障]
author: 鲸码研发团队
draft: false
---

## 先说结论

**能走 API 就不要直接删表。** 直接删库只适合“流程引擎已经无法正常启动、测试环境救急、并且有完整备份”的场景。

优先顺序：

1. `runtimeService.deleteProcessInstance(processInstanceId, reason)` 删除运行中的流程实例
2. `historyService.deleteHistoricProcessInstance(processInstanceId)` 删除历史数据
3. 以上都失败，再考虑按 `ACT_RU_* → ACT_HI_*` 的顺序手工清理

直接删库最大的风险不是 SQL 写错，而是**漏表、顺序错、外键/事务未处理**，最后留下“流程实例删了，但任务、变量、附件还在”的脏数据。

## 适用环境

- Flowable 6.x / 7.x（表名基本一致）
- MySQL 8.0
- 已确认流程实例不再需要，且有数据库备份
- 生产环境请先在测试库演练

## 先定位到底有哪些表引用了这个实例

不要凭记忆列清单。先查当前库里所有带 `PROC_INST_ID_` 的 `ACT_*` 表：

```sql
SELECT TABLE_NAME, COLUMN_NAME
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME LIKE 'ACT\_%'
  AND COLUMN_NAME IN ('PROC_INST_ID_', 'PROC_INST_ID')
ORDER BY TABLE_NAME;
```

再查这个实例在各表中的数据量：

```sql
SET @PROC_INST_ID = 'your-process-instance-id';

SELECT 'ACT_RU_TASK' AS table_name, COUNT(*) AS cnt
FROM ACT_RU_TASK WHERE PROC_INST_ID_ = @PROC_INST_ID
UNION ALL
SELECT 'ACT_RU_VARIABLE', COUNT(*) FROM ACT_RU_VARIABLE WHERE PROC_INST_ID_ = @PROC_INST_ID
UNION ALL
SELECT 'ACT_RU_EXECUTION', COUNT(*) FROM ACT_RU_EXECUTION WHERE PROC_INST_ID_ = @PROC_INST_ID
UNION ALL
SELECT 'ACT_HI_PROCINST', COUNT(*) FROM ACT_HI_PROCINST WHERE PROC_INST_ID_ = @PROC_INST_ID
UNION ALL
SELECT 'ACT_HI_TASKINST', COUNT(*) FROM ACT_HI_TASKINST WHERE PROC_INST_ID_ = @PROC_INST_ID
UNION ALL
SELECT 'ACT_HI_ACTINST', COUNT(*) FROM ACT_HI_ACTINST WHERE PROC_INST_ID_ = @PROC_INST_ID;
```

如果查出来还有其他表有数据，把它们一起纳入清理范围。

## 核心表作用

| 表名 | 作用 | 关键关联 |
|---|---|---|
| `ACT_RU_EXECUTION` | 运行时执行实例 | `PROC_INST_ID_`、`PARENT_ID_` |
| `ACT_RU_TASK` | 当前待办任务 | `PROC_INST_ID_`、`EXECUTION_ID_` |
| `ACT_RU_VARIABLE` | 运行时变量 | `PROC_INST_ID_`、`TASK_ID_` |
| `ACT_RU_IDENTITYLINK` | 任务候选人/用户组 | `PROC_INST_ID_`、`TASK_ID_` |
| `ACT_HI_PROCINST` | 历史流程实例 | `PROC_INST_ID_` |
| `ACT_HI_TASKINST` | 历史任务 | `PROC_INST_ID_` |
| `ACT_HI_ACTINST` | 历史活动节点 | `PROC_INST_ID_` |
| `ACT_HI_VARINST` | 历史变量 | `PROC_INST_ID_` |
| `ACT_HI_IDENTITYLINK` | 历史身份关联 | `PROC_INST_ID_` |
| `ACT_HI_COMMENT` | 审批意见/评论 | `PROC_INST_ID_` |
| `ACT_HI_ATTACHMENT` | 附件 | `PROC_INST_ID_` |
| `ACT_HI_DETAIL` | 历史明细 | `PROC_INST_ID_` |

## 删除顺序

原则：**先运行时，后历史；先子表，后主表。** 整个过程放在一个事务里，出错就回滚。

```sql
START TRANSACTION;

SET @PROC_INST_ID = 'your-process-instance-id';

-- 1. 运行时数据
DELETE FROM ACT_RU_VARIABLE
WHERE PROC_INST_ID_ = @PROC_INST_ID;

DELETE FROM ACT_RU_IDENTITYLINK
WHERE PROC_INST_ID_ = @PROC_INST_ID;

DELETE FROM ACT_RU_TASK
WHERE PROC_INST_ID_ = @PROC_INST_ID;

DELETE FROM ACT_RU_EXECUTION
WHERE PROC_INST_ID_ = @PROC_INST_ID;

-- 2. 历史数据
DELETE FROM ACT_HI_TASKINST
WHERE PROC_INST_ID_ = @PROC_INST_ID;

DELETE FROM ACT_HI_ACTINST
WHERE PROC_INST_ID_ = @PROC_INST_ID;

DELETE FROM ACT_HI_VARINST
WHERE PROC_INST_ID_ = @PROC_INST_ID;

DELETE FROM ACT_HI_IDENTITYLINK
WHERE PROC_INST_ID_ = @PROC_INST_ID;

DELETE FROM ACT_HI_COMMENT
WHERE PROC_INST_ID_ = @PROC_INST_ID;

DELETE FROM ACT_HI_ATTACHMENT
WHERE PROC_INST_ID_ = @PROC_INST_ID;

DELETE FROM ACT_HI_DETAIL
WHERE PROC_INST_ID_ = @PROC_INST_ID;

DELETE FROM ACT_HI_PROCINST
WHERE PROC_INST_ID_ = @PROC_INST_ID;

COMMIT;
```

如果存在外键约束，先确认约束方向，不要用 `SET FOREIGN_KEY_CHECKS=0` 硬关；关掉之后留下的脏数据更难查。

## 删除前先备份

至少把要删的行备份一份，出问题可以对照恢复：

```sql
CREATE TABLE bak_act_ru_task_20261111 AS
SELECT * FROM ACT_RU_TASK WHERE PROC_INST_ID_ = 'your-process-instance-id';

CREATE TABLE bak_act_hi_procinst_20261111 AS
SELECT * FROM ACT_HI_PROCINST WHERE PROC_INST_ID_ = 'your-process-instance-id';
```

生产库建议直接用 `mysqldump` 做整库或相关表备份，不要只依赖临时表。

## 删除后验证

```sql
SET @PROC_INST_ID = 'your-process-instance-id';

SELECT 'ACT_RU_TASK' AS table_name, COUNT(*) AS cnt
FROM ACT_RU_TASK WHERE PROC_INST_ID_ = @PROC_INST_ID
UNION ALL
SELECT 'ACT_RU_VARIABLE', COUNT(*) FROM ACT_RU_VARIABLE WHERE PROC_INST_ID_ = @PROC_INST_ID
UNION ALL
SELECT 'ACT_RU_EXECUTION', COUNT(*) FROM ACT_RU_EXECUTION WHERE PROC_INST_ID_ = @PROC_INST_ID
UNION ALL
SELECT 'ACT_HI_PROCINST', COUNT(*) FROM ACT_HI_PROCINST WHERE PROC_INST_ID_ = @PROC_INST_ID
UNION ALL
SELECT 'ACT_HI_TASKINST', COUNT(*) FROM ACT_HI_TASKINST WHERE PROC_INST_ID_ = @PROC_INST_ID;
```

全部为 0 才算清理完成。再打开 Flowable 的流程实例列表、待办列表，确认没有残留。

## 更推荐的 API 做法

```java
// 1. 删除运行中的流程实例
runtimeService.deleteProcessInstance(processInstanceId, "业务撤销，人工清理");

// 2. 删除历史实例
historyService.deleteHistoricProcessInstance(processInstanceId);
```

注意顺序：运行中的实例还在时，直接删历史通常会失败。先运行时，再历史。

如果是“流程定义”层面的清理，不要删实例表，应该用 `repositoryService.deleteDeployment(deploymentId, true)` 级联删除部署及其流程实例。

## 常见坑

- **只删了 `ACT_HI_PROCINST`**：任务、变量、意见还在，列表页仍能看到残留。
- **漏了 `ACT_HI_DETAIL` / `ACT_HI_ATTACHMENT`**：表单字段历史和附件会留下孤儿数据。
- **没加事务**：删到一半失败，运行时有、历史没，后续排查更麻烦。
- **生产环境直接执行**：没有备份、没有演练，出问题只能恢复整库。
- **用 `DELETE ... WHERE PROC_INST_ID_ = ?` 但字段类型/排序规则不一致**：可能扫全表或匹配不到，先 `EXPLAIN` 看一眼。

## FAQ

**Q：为什么 Flowable 不提供“物理删除”接口？**  
A：流程数据涉及运行时、历史、附件、变量多条链路，物理删除容易破坏一致性。API 的删除是带业务语义的，能保证引擎状态正确。

**Q：删完之后流程定义还在吗？**  
A：在。删实例不影响 `ACT_RE_*` 里的流程定义和部署。

**Q：历史级别是 `full` 时表更多，怎么办？**  
A：以第一步的 `information_schema` 查询结果为准，不要只按固定表清单删。

## 相关阅读

- [微服务网关白名单配置了仍然 401](/blog/微服务网关白名单配置依然401解决方案)
- [数据中台 CDP 标签体系设计](/blog/cdp-tag-system)

我们做过 80+ 审批流程的企业级落地，涉及 Flowable、权限、表单与系统集成。有类似需求可以看[项目案例](/cases)或[联系我们](/#contact)。
