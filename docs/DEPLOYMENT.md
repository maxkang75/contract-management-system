# 部署指南

## 开发环境部署

### 前置条件

- Docker 和 Docker Compose 已安装
- Node.js 18+ 已安装
- Git 已安装

### 步骤

1. **克��项目**

```bash
git clone https://github.com/maxkang75/contract-management-system.git
cd contract-management-system
```

2. **配置环境变量**

```bash
cp .env.example .env
```

编辑 `.env` 文件，设置必要的环境变量。

3. **启动所有服务**

```bash
docker-compose up -d
```

4. **初始化数据库**

```bash
cd backend
npm install
npm run migrate
```

5. **启动后端服务**

```bash
npm run dev
```

6. **配置小程序**

- 打开微信开发者工具
- 导入 `mini-program` 目录
- 配置 AppID 和 AppSecret
- 配置 API 地址为本地开发地址

## 生产环境部署

### 使用 Docker Compose（推荐）

1. **准备服务器**

- 选择合适的云服务器（建议 2C4G 以上）
- 安装 Docker 和 Docker Compose
- 配置服务器安全组，开放 80、443 端口

2. **上传项目**

```bash
git clone https://github.com/maxkang75/contract-management-system.git
cd contract-management-system
```

3. **配置生产环境变量**

```bash
cp .env.example .env.production
```

编辑 `.env.production`：

```env
NODE_ENV=production
DB_PASSWORD=strong_password_here
REDIS_PASSWORD=strong_password_here
JWT_SECRET=very_long_secret_key_change_in_production
WECHAT_APPID=your_appid
WECHAT_APPSECRET=your_appsecret
```

4. **配置 SSL 证书**

将 SSL 证书放置在 `./ssl/` 目录：
```
./ssl/
├── cert.pem
└── key.pem
```

5. **配置 Nginx**

编辑 `nginx.conf`，配置域名和 SSL：

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    location / {
        proxy_pass http://backend:3000;
    }
}
```

6. **启动服务**

```bash
docker-compose -f docker-compose.yml up -d
```

7. **验证部署**

```bash
# 检查容器状态
docker-compose ps

# 查看后端日志
docker-compose logs backend

# 测试 API
curl https://your-domain.com/health
```

## 维护和管理

### 数据库备份

```bash
# 手动备份
docker-compose exec postgres pg_dump -U cms_user contract_management > backup_$(date +%Y%m%d).sql

# 恢复备份
docker-compose exec -T postgres psql -U cms_user contract_management < backup_20240101.sql
```

### 日志查看

```bash
# 查看所有服务日志
docker-compose logs

# 查看特定服务日志
docker-compose logs backend

# 持续输出日志
docker-compose logs -f backend
```

### 更新部署

```bash
# 拉取最新代码
git pull origin main

# 重新构建镜像
docker-compose build --no-cache

# 重启服务
docker-compose up -d
```

### 监控

1. **检查容器健康**

```bash
docker-compose ps
```

2. **查看资源使用**

```bash
docker stats
```

3. **配置告警**（可选）

使用第三方监控服务如 DataDog、Prometheus 等。

## 性能优化

### 后端优化

1. 启用 gzip 压缩
2. 配置 Redis 缓存
3. 使用数据库连接池
4. 启用 CDN（如适用）

### 数据库优化

1. 定期执行 `VACUUM` 和 `ANALYZE`
2. 添加必要的索引
3. 分区大表
4. 定期清理过期数据

### 前端优化

1. 启用小程序包优化
2. 使用图片压缩
3. 启用缓存策略

## 故障排查

### 无法连接到数据库

```bash
# 检查数据库容器
docker-compose logs postgres

# 重启数据库
docker-compose restart postgres
```

### 后端无法启动

```bash
# 检查后端日志
docker-compose logs backend

# 检查依赖
npm list
```

### 小程序无法连接到 API

1. 检查 API 地址配置
2. 检查网络连接
3. 检查服务器防火墙
4. 检查 CORS 配置

## 安全建议

1. **定期更新依赖**

```bash
npm audit
npm audit fix
```

2. **使用强密码**

3. **启用 HTTPS**

4. **定期备份**

5. **限制 API 访问频率**

6. **监控异常活动**

## 成本管理

- 选择合适的云服务器配置
- 使用自动扩展
- 定期审查和优化资源
