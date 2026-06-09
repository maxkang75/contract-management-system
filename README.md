# 合同管理系统

一个完整的企业级合同管理和生产执行系统，包含 Web 管理后台和微信小程序移动端。

## 核心功能

1. **合同管理** — 合同登记、收款节点、执行状态、到期提醒
2. **生产管理** — 项目立项→派工→进度跟踪→生产产值统计→成果提交
3. **资料管理** — 成果文件上传、报告提交、归档分类
4. **请款管理** — 依据合同+生产进度产值或请款节点发起请款，多级审批流
5. **财务管理** — 收支台账、发票管理、成本核算、利润分析
6. **数据看板** — 老板视角：完工项目、在建项目、应收应付、利润汇总

## 技术栈

- **后端**: Node.js + Express + TypeScript + PostgreSQL
- **小程序**: 微信小程序原生
- **容器化**: Docker + Docker Compose
- **认证**: JWT + 手机登录
- **缓存**: Redis
- **消息队列**: RabbitMQ（可选）

## 项目结构

```
contract-management-system/
├── backend/                 # Node.js 后端服务
│   ├── src/
│   │   ├── config/         # 配置文件
│   │   ├── controllers/    # 业务控制器
│   │   ├── models/         # 数据模型
│   │   ├── routes/         # 路由定义
│   │   ├── services/       # 业务逻辑
│   │   ├── middleware/     # 中间件
│   │   ├── types/          # TypeScript 类型定义
│   │   ├── utils/          # 工具函数
│   │   └── app.ts          # 应用入口
│   ├── migrations/         # 数据库迁移
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── mini-program/           # 微信小程序
│   ├── pages/              # 页面
│   ├── components/         # 组件
│   ├── utils/              # 工具
│   ├── app.json            # 小程序配置
│   └── project.config.json
├── docker-compose.yml      # 容器编排
├── docs/                   # 文档
│   ├── API.md              # API 文档
│   ├── DATABASE.md         # 数据库设计
│   └── DEPLOYMENT.md       # 部署指南
└── .gitignore
```

## 快速开始

### 前置要求

- Docker 和 Docker Compose
- Node.js 18+
- PostgreSQL 14+
- 微信开发者工具

### 本地开发

```bash
# 克隆项目
git clone https://github.com/maxkang75/contract-management-system.git
cd contract-management-system

# 启动所有服务（Docker）
docker-compose up -d

# 初始化数据库
cd backend
npm install
npm run migrate
npm run dev

# 小程序开发
# 使用微信开发者工具打开 mini-program 目录
```

### 生产部署

详见 [部署指南](./docs/DEPLOYMENT.md)

## API 文档

详见 [API 文档](./docs/API.md)

## 数据库设计

详见 [数据库文档](./docs/DATABASE.md)

## 许可证

MIT
