FROM node:18-alpine

WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# 复制源代码
COPY . .

# 构建 TypeScript
RUN npm install -D typescript ts-node @types/node && npm run build

# 清理开发依赖
RUN npm prune --production

EXPOSE 3000

CMD ["npm", "start"]
