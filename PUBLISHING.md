# dsh-afdian 发布到 GitHub 指南

## 📦 插件信息

| 项目 | 值 |
|------|-----|
| 名称 | dsh-afdian |
| 版本 | 0.1.0 |
| 描述 | 爱发电 (Afdian) 数据获取插件 - 带 GUI 设置界面 |
| 许可证 | MIT |

## 🚀 发布步骤

### 1. 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 仓库名: `dsh-afdian`
3. 描述: `爱发电 (Afdian) 数据获取插件 for DeepSeek Harness`
4. 选择 **Public**
5. **不要** 初始化 README（我们已有）
6. 点击 "Create repository"

### 2. 本地初始化 Git

```bash
cd C:\Users\Administrator\.dsh\profiles\web-desktop\node_modules\dsh-afdian
git init
git add .
git commit -m "chore: initial commit"
```

### 3. 关联远程仓库

```bash
git remote add origin https://github.com/YOUR_USERNAME/dsh-afdian.git
git branch -M main
git push -u origin main
```

### 4. 更新 package.json

将 `package.json` 中的 `YOUR_USERNAME` 替换为你的 GitHub 用户名：
```json
"repository": {
  "type": "git",
  "url": "https://github.com/YOUR_USERNAME/dsh-afdian.git"
},
"homepage": "https://github.com/YOUR_USERNAME/dsh-afdian#readme"
```

### 5. 发布到 npm（可选）

```bash
npm login
npm publish
```

## 📋 GitHub 话题标签

建议添加以下话题（topics）：

- `deepseek-harness`
- `dsh-plugin`
- `afdian`
- `爱发电`
- `plugin`

设置方法：进入仓库 → Settings → Topics

## 📝 README 内容

README 已包含：
- ✅ 功能说明
- ✅ 安装方式（3 种）
- ✅ 配置指南
- ✅ API 文档
- ✅ 安全说明
- ✅ 依赖要求

## 🔍 其他用户如何使用

### 方法一：npm 安装
```bash
npm install -g dsh-afdian
```

### 方法二：直接克隆
```bash
git clone https://github.com/USER/dsh-afdian.git ~/.dsh/profiles/web-desktop/node_modules/dsh-afdian
```

### 方法三：DSH 插件市场（未来支持）

## ⚠️ 注意事项

1. **不要提交配置文件**：`.dsh/afdian-config.json` 已加入 `.gitignore`
2. **不要提交个人 token**：确保 README 和代码中无真实 token
3. **更新示例**：将 "YOUR_USERNAME" 替换为实际用户名

## 📊 插件文件清单

```
dsh-afdian/
├── src/
│   └── index.js          # 主机端入口
├── lib/
│   ├── api.js            # API 签名和请求
│   ├── client.js         # 客户端 UI
│   └── config.js         # 配置管理
├── settings.html         # 独立设置页面
├── cordis.patch.yml      # DSH 注册配置
├── package.json          # 包信息
├── README.md             # 文档
├── CHANGELOG.md          # 更新日志
├── LICENSE               # MIT 许可证
└── .gitignore            # Git 忽略规则
```
