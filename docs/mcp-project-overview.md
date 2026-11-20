# 项目概览

## 定位

CarolimoneHome 是「柠萌 / CaroLimone」的个人主页和内容展示站，主要承载个人资料、社交入口、友链、工具链接，以及 Minecraft Bukkit 插件开发学习日记。`README.md` 只有项目名和笼统的 `Web Program`，以下归纳以页面和部署配置为依据。

## 页面和内容

- `index.html`：个人主页，包含个人介绍、联系方式、兴趣与技能、友链及 Dev 日记入口、工具链接；内嵌 JavaScript 实现中英文切换和技能条动画。
- `pages/links.html`：友链页面，浏览器端按内嵌数据生成卡片，提供 QQ 联系入口，当前没有站内自助添加功能。
- `pages/dev-contents.html`：Dev 日记目录，链接 `tutorials/bukkit-diary/` 下的 Bukkit、Spigot、Paper、事件监听、日志和命令教程。
- `docs/javadocs/lemoncore/`：随站点提供的 Java API 文档；`resources/` 和 `assets/images/tutorials/` 存放图片等静态素材。

## 实现与部署

网站以独立 HTML、内嵌 JavaScript、Tailwind CSS CDN、Font Awesome CDN 和 Google Fonts 为主，没有在仓库根目录看到常见的前端构建配置。`wrangler.jsonc` 将 Cloudflare 项目命名为 `homepage`，以仓库根目录 `.` 作为静态资源目录；配置了 observability 和 `nodejs_compat`。页面所示内容不依赖已发现的后端 API 或数据库。外部 CDN 资源不可用时，样式、字体或图标可能不完整。

此概览基于仓库的静态检查，并非线上部署或全部页面的运行验证。
