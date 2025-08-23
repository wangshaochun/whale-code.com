--- 
date: '2025-04-20'
---


## 表作用说明

| 表名 | 说明 | 主要内容 | 外键关联 |
| :--- | :--- | :--- | :--- |
| **ACT_RU_VARIABLE**（运行时变量表） | 存储流程实例运行时的变量数据 | 流程变量、任务变量等运行时数据 | 执行实例(EXECUTION_ID_)任务实例(TASK_ID_)流程实例(PROC_INST_ID_) |
| **ACT_RU_TASK**（运行时任务表） | 存储当前正在运行的任务信息 | 任务名称、负责人、创建时间、到期时间等 | 执行实例(EXECUTION_ID_)流程实例(PROC_INST_ID_) |
| **ACT_RU_IDENTITYLINK**（运行时身份关联表） | 存储任务与用户/组的关联关系 | 任务候选人、办理人、组分配等信息 | 任务实例(TASK_ID_)流程实例(PROC_INST_ID_) |
| **ACT_RU_EXECUTION**（运行时执行实例表） | 存储流程执行路径和当前执行状态 | 执行流信息、当前活动节点等 | 流程实例(PROC_INST_ID_)自关联(PARENT_ID_) |
| **ACT_HI_PROCINST**（历史流程实例表） | 存储已结束的流程实例历史信息 | 流程开始/结束时间、持续时间、结束原因等 | 与其他历史表通过PROC_INST_ID_关联 |
| **ACT_HI_TASKINST**（历史任务实例表） | 存储已完成任务的历史信息 | 任务执行详情、开始/结束时间、办理人等 | 流程实例(PROC_INST_ID_) |
| **ACT_HI_ACTINST**（历史活动实例表） | 记录流程实例中每个节点的执行历史 | 节点开始/结束时间、节点类型、办理人等 | 流程实例(PROC_INST_ID_) |
| **ACT_HI_VARINST**（历史变量表） | 存储流程实例和任务的历史变量信息 | 变量名、变量值、创建/更新时间等 | 流程实例(PROC_INST_ID_) |
| **ACT_HI_IDENTITYLINK**（历史身份关联表） | 记录历史任务与用户/组的关联关系 | 办理人、候选人、组分配等 | 流程实例(PROC_INST_ID_) |
| **ACT_HI_COMMENT**（历史评论表） | 存储流程实例和任务的评论信息 | 评论内容、用户、时间等 | 流程实例(PROC_INST_ID_) |
| **ACT_HI_ATTACHMENT**（历史附件表） | 存储流程实例和任务的附件信息 | 附件名称、类型、路径等 | 流程实例(PROC_INST_ID_) |
| **ACT_HI_DETAIL**（历史详情表） | 记录流程变量、任务变量等详细变更历史 | 变量变更明细、表单字段变更等 | 流程实例(PROC_INST_ID_) |


## 删除SQL

> 正确的删除顺序（重要！）：
  先删除运行时表（RU表）
  再删除历史表（HI表）


```sql
-- 定义流程实例ID变量
DECLARE @PROC_INST_ID VARCHAR(64);
SET @PROC_INST_ID = 'your-process-instance-id';

BEGIN TRANSACTION;

-- 删除运行时变量（最底层依赖）
DELETE FROM ACT_RU_VARIABLE WHERE PROC_INST_ID_ = @PROC_INST_ID;
-- 删除运行时身份关联
DELETE FROM ACT_RU_IDENTITYLINK WHERE PROC_INST_ID_ = @PROC_INST_ID;
-- 删除运行时任务
DELETE FROM ACT_RU_TASK WHERE PROC_INST_ID_ = @PROC_INST_ID;
-- 删除运行时执行实例
DELETE FROM ACT_RU_EXECUTION WHERE PROC_INST_ID_ = @PROC_INST_ID;
-- 删除历史任务实例
DELETE FROM ACT_HI_TASKINST WHERE PROC_INST_ID_ = @PROC_INST_ID;
-- 删除历史流程实例
DELETE FROM ACT_HI_PROCINST WHERE ID_ = @PROC_INST_ID;
-- 历史活动实例表
DELETE FROM ACT_HI_ACTINST WHERE PROC_INST_ID_ = @PROC_INST_ID;
-- 历史变量表
DELETE FROM ACT_HI_VARINST WHERE PROC_INST_ID_ = @PROC_INST_ID;
-- 历史身份关联表
DELETE FROM ACT_HI_IDENTITYLINK WHERE PROC_INST_ID_ = @PROC_INST_ID;
-- 历史评论表
DELETE FROM ACT_HI_COMMENT WHERE PROC_INST_ID_ = @PROC_INST_ID;
-- 历史附件表
DELETE FROM ACT_HI_ATTACHMENT WHERE PROC_INST_ID_ = @PROC_INST_ID;
-- 历史详情表
DELETE FROM ACT_HI_DETAIL WHERE PROC_INST_ID_ = @PROC_INST_ID;

COMMIT;
```
