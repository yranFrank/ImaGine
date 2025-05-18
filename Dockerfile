# 使用 Vercel 与 Sharp 兼容的 Linux 环境
FROM node:18-bullseye-slim

# 设置工作目录
WORKDIR /app

# 复制你的项目文件
COPY . .

# 安装系统库（确保 Sharp 正常）
RUN apt-get update && apt-get install -y libvips libvips-dev

# 安装依赖（确保 Sharp 兼容）
RUN npm install && npm install --platform=linux --arch=x64 sharp && npm rebuild sharp --force

# 确保 Sharp 已正确加载
RUN node -e "console.log('✅ Sharp Version:', require('sharp').version); console.log('✅ Sharp Installed Modules:', require('sharp').format);"

# 运行你的项目
CMD ["npm", "run", "dev"]
