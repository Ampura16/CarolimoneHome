# Mineplex Fan-made Clone · 粉丝复刻站

对 [mineplex.com](https://mineplex.com/) 官网外观的静态复刻（仅学习用途），
包含分层视差头图、新闻、17 款游戏展示与双端游玩指南，支持 **中英文 i18n**。

## 目录结构

```
mineplex_clone/
├── index.html              # 首页：Hero / 最新新闻 / 游戏预览 / 玩法指南
├── games.html              # 全部 17 款游戏 + 详情弹窗
├── news.html               # 新闻列表页
├── assets/
│   ├── css/style.css       # 全站样式（配色提取自官网样式表）
│   ├── js/i18n.js          # 轻量 i18n 引擎 + 内嵌 en / zh-CN 词典
│   ├── js/main.js          # 交互：视差 / 选项卡 / 复制 IP / 弹窗 / 回到顶部
│   └── img/
│       ├── hero/           # 头图视差层（来自官网，已压缩）
│       ├── games/          # 17 款游戏图标
│       ├── news/           # 新闻配图
│       └── ui/             # Logo、favicon、玩法插图等
├── _ref/                   # 抓取时的原始参考素材（非站点文件）
└── README.md
```

## 功能一览

- **跳转按钮**：顶部导航（页内锚点 + 跨页跳转）、登录/注册/商店/支持等外链、
  「Play Now!」「查看全部」「阅读全文」「游玩此游戏」等 CTA、回到顶部悬浮按钮。
- **复制服务器 IP**：一键复制 `play.mineplex.com` 并弹出 Toast 提示。
- **i18n**：点击导航栏 `中文 / English` 按钮即时切换全站文案
  （含游戏弹窗内容），选择记忆在 `localStorage`，默认跟随浏览器语言。
- **Hero 视差**：还原官网 6 层头图 + MINEPLEX 金色立体标志，
  支持鼠标视差与自动漂移。

## 本地运行

```bash
cd mineplex_clone
python3 -m http.server 8000
# 打开 http://localhost:8000
```

## 声明

非官方粉丝作品，与 Mineplex / Mojang 无任何隶属关系；图片素材版权归原站点所有。
