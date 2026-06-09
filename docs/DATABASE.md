# 数据库设计文档

## 概述

本系统使用 PostgreSQL 作为主要数据库，采用关系型数据库模型设计。

## 核心表结构

### 1. users (用户表)

管理系统用户信息。

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    phone VARCHAR(20) UNIQUE NOT NULL,      -- 手机号（登录凭证）
    name VARCHAR(100),                      -- 姓名
    email VARCHAR(100),                     -- 邮箱
    department VARCHAR(100),                -- 部门
    role VARCHAR(50),                       -- 角色: admin, manager, staff, finance
    status VARCHAR(20),                     -- 状态: active, inactive
    password_hash VARCHAR(255),             -- 密码哈希
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### 2. contracts (合同表)

管理合同基本信息。

```sql
CREATE TABLE contracts (
    id UUID PRIMARY KEY,
    contract_number VARCHAR(100) UNIQUE,    -- 合同编号
    name VARCHAR(200),                      -- 合同名称
    customer VARCHAR(200),                  -- 客户名���
    amount DECIMAL(15, 2),                  -- 合同金额
    currency VARCHAR(10),                   -- 货币种类
    start_date TIMESTAMP,                   -- 开始日期
    end_date TIMESTAMP,                     -- 结束日期
    status VARCHAR(50),                     -- 状态: draft, active, completed, terminated
    contract_type VARCHAR(50),              -- 合同类型: service, supply, construction
    created_by UUID,                        -- 创建人
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### 3. payment_nodes (收款节点表)

管理合同的收款节点。

```sql
CREATE TABLE payment_nodes (
    id UUID PRIMARY KEY,
    contract_id UUID REFERENCES contracts,  -- 所属合同
    node_name VARCHAR(200),                 -- 节点名称
    percentage DECIMAL(5, 2),               -- 占比%
    amount DECIMAL(15, 2),                  -- 金额
    due_date TIMESTAMP,                     -- 应收日期
    received_amount DECIMAL(15, 2),         -- 已收金额
    received_date TIMESTAMP,                -- 实际收款日期
    status VARCHAR(50),                     -- 状态: pending, received, overdue
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### 4. projects (项目表)

管理生产项目。

```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY,
    contract_id UUID REFERENCES contracts,  -- 所属合同
    project_name VARCHAR(200),              -- 项目名称
    description TEXT,                       -- 项目描述
    status VARCHAR(50),                     -- 状态: planning, in_progress, completed, suspended
    start_date TIMESTAMP,                   -- 开始日期
    end_date TIMESTAMP,                     -- 结束日期
    budget DECIMAL(15, 2),                  -- 预算
    actual_cost DECIMAL(15, 2),             -- 实际成本
    progress INTEGER,                       -- 进度: 0-100
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### 5. task_assignments (任务派工表)

管理项目任务分配。

```sql
CREATE TABLE task_assignments (
    id UUID PRIMARY KEY,
    project_id UUID REFERENCES projects,    -- 所属项目
    task_name VARCHAR(200),                 -- 任务名称
    assigned_to UUID REFERENCES users,      -- 分配给
    assigned_date TIMESTAMP,                -- 分配日期
    due_date TIMESTAMP,                     -- 截止日期
    status VARCHAR(50),                     -- 状态: assigned, in_progress, completed
    progress INTEGER,                       -- 进度: 0-100
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### 6. payment_requests (请款单表)

管理请款申请。

```sql
CREATE TABLE payment_requests (
    id UUID PRIMARY KEY,
    project_id UUID REFERENCES projects,    -- 所属项目
    contract_id UUID REFERENCES contracts,  -- 所属合同
    request_number VARCHAR(100) UNIQUE,     -- 请款单号
    amount DECIMAL(15, 2),                  -- 请款金额
    reason TEXT,                            -- 请款原因
    status VARCHAR(50),                     -- 状态: draft, submitted, approved, rejected, paid
    created_by UUID REFERENCES users,       -- 创建人
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### 7. approval_steps (审批步骤表)

管理多级审批流程。

```sql
CREATE TABLE approval_steps (
    id UUID PRIMARY KEY,
    payment_request_id UUID REFERENCES payment_requests,
    approval_order INTEGER,                 -- 审批顺序
    approver_id UUID REFERENCES users,      -- 审批人ID
    approver_name VARCHAR(100),             -- 审批人名称
    status VARCHAR(50),                     -- 状态: pending, approved, rejected
    comments TEXT,                          -- 审批意见
    action_date TIMESTAMP,                  -- 操作时间
    created_at TIMESTAMP
);
```

### 8. financial_records (财务记录表)

管理收支台账。

```sql
CREATE TABLE financial_records (
    id UUID PRIMARY KEY,
    type VARCHAR(50),                       -- 类型: income, expense
    amount DECIMAL(15, 2),                  -- 金额
    description TEXT,                       -- 描述
    related_contract_id UUID REFERENCES contracts,
    record_date TIMESTAMP,                  -- 记录日期
    created_at TIMESTAMP
);
```

### 9. attachments (附件表)

管理文件附件。

```sql
CREATE TABLE attachments (
    id UUID PRIMARY KEY,
    project_id UUID REFERENCES projects,    -- 所属项目
    payment_request_id UUID REFERENCES payment_requests,
    file_path VARCHAR(500),                 -- 文件路径
    file_name VARCHAR(200),                 -- 文件名
    file_size INTEGER,                      -- 文件大小
    file_type VARCHAR(50),                  -- 文件类型
    uploaded_by UUID REFERENCES users,      -- 上传人
    created_at TIMESTAMP
);
```

## 关键字段说明

### 状态字段

- **contracts.status**: draft(草稿) → active(生效) → completed(完成) → terminated(终止)
- **projects.status**: planning(规划) → in_progress(执行) → completed(完成) → suspended(暂停)
- **payment_requests.status**: draft(草稿) → submitted(已提交) → approved(已批准) → rejected(已驳回) → paid(已支付)
- **approval_steps.status**: pending(待批) → approved(已批准) → rejected(已驳回)

## 常用查询

### 查询应收账款

```sql
SELECT 
    c.id,
    c.contract_number,
    c.name,
    SUM(pn.amount) as total_amount,
    SUM(COALESCE(pn.received_amount, 0)) as received_amount,
    SUM(pn.amount) - SUM(COALESCE(pn.received_amount, 0)) as receivable
FROM contracts c
LEFT JOIN payment_nodes pn ON c.id = pn.contract_id
WHERE c.status = 'active'
GROUP BY c.id, c.contract_number, c.name;
```

### 查询项目成本

```sql
SELECT 
    p.id,
    p.project_name,
    p.budget,
    COALESCE(SUM(fr.amount), 0) as actual_cost,
    p.budget - COALESCE(SUM(fr.amount), 0) as remaining_budget
FROM projects p
LEFT JOIN financial_records fr ON p.id = fr.related_contract_id
WHERE fr.type = 'expense'
GROUP BY p.id, p.project_name, p.budget;
```

## 性能优化

1. 为常用查询字段添加索引
2. 定期清理过期数据
3. 使用物化视图加速复杂查询
4. 合理分区大表

## 备份策略

1. 日备份：每天夜间进行完全备份
2. 周备份：每周进行差分备份
3. 月备份：每月进行完全备份存档
