# API 文档

## 基础信息

- **Base URL**: `http://localhost:3000/api`
- **认证**: JWT Token（通过 `Authorization: Bearer <token>` 传递）
- **内容类型**: `application/json`

## 响应格式

所有 API 响应格式统一为：

```json
{
  "code": 200,
  "message": "成功信息",
  "data": {},
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## 认证相关 API

### 1. 用户登录

```http
POST /auth/login
```

**请求体**:
```json
{
  "phone": "13800138000",
  "password": "123456"
}
```

**成功响应 (200)**:
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "phone": "13800138000",
      "name": "管理员",
      "role": "admin"
    }
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### 2. 用户注册

```http
POST /auth/register
```

**请求体**:
```json
{
  "phone": "13800138000",
  "name": "张三",
  "password": "123456"
}
```

### 3. 获取当前用户信息

```http
GET /auth/me
Authorization: Bearer <token>
```

## 合同相关 API

### 1. 获取所有合同

```http
GET /contracts
Authorization: Bearer <token>
```

**查询参数**:
- `status`: 合同状态 (可选)
- `customer`: 客户名称 (可选)
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 10)

### 2. 创建合同

```http
POST /contracts
Authorization: Bearer <token>
```

**请求体**:
```json
{
  "name": "软件开发服务合同",
  "customer": "ABC公司",
  "amount": 100000,
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "contract_type": "service"
}
```

### 3. 获取合同详情

```http
GET /contracts/{id}
Authorization: Bearer <token>
```

### 4. 更新合同

```http
PUT /contracts/{id}
Authorization: Bearer <token>
```

## 项目相关 API

### 1. 创建项目

```http
POST /projects
Authorization: Bearer <token>
```

**请求体**:
```json
{
  "contract_id": "uuid",
  "project_name": "项目名称",
  "description": "项目描述",
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "budget": 50000
}
```

### 2. 获取所有项目

```http
GET /projects
Authorization: Bearer <token>
```

### 3. 获取项目详情

```http
GET /projects/{id}
Authorization: Bearer <token>
```

### 4. 更新项目

```http
PUT /projects/{id}
Authorization: Bearer <token>
```

## 请款相关 API

### 1. 创建请款单

```http
POST /approvals
Authorization: Bearer <token>
```

**请求体**:
```json
{
  "project_id": "uuid",
  "contract_id": "uuid",
  "amount": 10000,
  "reason": "第一期工程款",
  "approvers": [
    {"id": "user_id_1", "name": "部门经理"},
    {"id": "user_id_2", "name": "财务总监"}
  ]
}
```

### 2. 审批

```http
POST /approvals/{id}/approve
Authorization: Bearer <token>
```

**请求体**:
```json
{
  "step_id": "uuid",
  "status": "approved",
  "comments": "同意"
}
```

## 财务相关 API

### 1. 获取财务统计

```http
GET /financial/summary
Authorization: Bearer <token>
```

**成功响应**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total_income": 500000,
    "total_expense": 300000,
    "profit": 200000
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## 数据看板 API

### 1. 获取仪表板数据

```http
GET /dashboard/summary
Authorization: Bearer <token>
```

**成功响应**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total_contracts": 10,
    "active_contracts": 5,
    "total_projects": 8,
    "in_progress_projects": 3,
    "completed_projects": 5,
    "total_income": 500000,
    "total_expense": 300000,
    "total_profit": 200000,
    "receivable": 100000,
    "payable": 50000
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## 错误响应

| 错误码 | 说明 |
|--------|------|
| 400 | 请求参数错误 |
| 401 | 未授权（token 无效或过期） |
| 403 | 禁止访问（权限不足） |
| 404 | 资源不存在 |
| 500 | 服务器错误 |
