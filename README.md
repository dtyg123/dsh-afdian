# dsh-afdian

爱发电（Afdian）数据获取插件 - 带 GUI 设置界面

## 功能

- 🍉 GUI 设置界面（DSH 设置 → 插件 → dsh-afdian）
- 🛒 查询订单列表（金额 / 赞助者 / 状态 / 时间）
- 🤝 查询赞助者列表（方案 / 累计金额 / 本月月数）
- 🔍 API 连接测试（签名验证）

## 安装

### 方式一：从 npm 安装（推荐）

```bash
# 在 DSH 配置目录安装
npm install -g dsh-afdian
```

### 方式二：从 GitHub 安装

```bash
# 克隆到 DSH 插件目录
git clone https://github.com/islandnoti/dsh-afdian.git ~/.dsh/profiles/web-desktop/node_modules/dsh-afdian
```

### 方式三：手动安装

1. 下载插件 ZIP 文件
2. 解压到 `~/.dsh/profiles/web-desktop/node_modules/dsh-afdian`
3. 在 `~/.dsh/profiles/web-desktop/cordis.patch.yml` 中添加：
```yaml
- insert:
    - id: dsh-afdian
      name: 'dsh-afdian'
```
4. 重启 DSH

## 配置

### 获取凭证

1. 打开 https://ifdian.net/dashboard/dev
2. 获取 API Token 和 User ID

### 图形化界面（推荐）

1. 打开 DSH 设置，切换到「模型」标签页
2. 在页面底部的「🍉 爱发电 API 配置」卡片中填写：
   - **API Token**: 从爱发电开发者后台获取
   - **User ID**: 您的爱发电用户 ID（32 位十六进制）
3. 点击「测试连接」验证签名是否有效
4. 点击「查询订单」或「查询赞助」查看数据

### 命令行配置

```bash
# 通过 DSH HTTP API 配置
curl -X PATCH http://127.0.0.1:64117/plugins/dsh-afdian/config   -H "Content-Type: application/json"   -d '{"token": "YOUR_TOKEN", "userId": "YOUR_USER_ID"}'
```

## API 端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/plugins/dsh-afdian/config` | GET/PATCH | 读取/保存配置 |
| `/plugins/dsh-afdian/test` | POST | 测试 API 连接 |
| `/plugins/dsh-afdian/query?type=order` | GET | 查询订单列表 |
| `/plugins/dsh-afdian/query?type=sponsor` | GET | 查询赞助者列表 |
| `/afdian-settings` | GET | 独立设置页面 |

## 查询参数

### 查询订单
```
GET /plugins/dsh-afdian/query?type=order&page=1&perPage=10
```

### 查询赞助
```
GET /plugins/dsh-afdian/query?type=sponsor&page=1&perPage=10
```

## 安全说明

- Token 存储在 `~/.dsh/afdian-config.json`
- 建议不要在公共仓库中提交配置文件
- 配置文件已加入 `.gitignore`

## 依赖

- Node.js >= 22.19
- DeepSeek Harness (DSH)

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

## 链接

- [爱发电开发者文档](https://ifdian.net/dashboard/dev)
- [DSH 插件开发文档](https://github.com/deepseek-ai/deepseek-harness)
