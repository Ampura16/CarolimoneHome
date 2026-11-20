# 站点目录结构重整记录（2026-09-28）

## 目标布局

```
CarolimoneHome/
├── index.html                  # 站点入口
├── pages/                      # 子页面
│   ├── links.html
│   ├── dev-contents.html
│   └── javadoc-content.html
├── tutorials/
│   └── bukkit-diary/           # Bukkit 教程 4 章
├── assets/
│   └── images/
│       ├── avatars/            # 站点头像
│       ├── backgrounds/        # 背景图
│       └── tutorials/          # 教程截图（chapter-02/、chapter-03/）
├── docs/
│   ├── javadocs/
│   │   ├── foundation/         # Foundation javadoc
│   │   └── lemoncore/          # LemonCore javadoc
│   ├── mcp-bridge-usage.md
│   ├── mcp-project-overview.md
│   └── mcp-site-restructure.md
├── README.md
└── wrangler.jsonc
```

## 映射表（旧 → 新）

| 旧路径 | 新路径 |
| --- | --- |
| `dev_contents.html` | `pages/dev-contents.html` |
| `JavadocContent.html` | `pages/javadoc-content.html` |
| `links.html` | `pages/links.html` |
| `features/BukkitDiary/` | `tutorials/bukkit-diary/` |
| `features/BukkitDiary/0X_标题.html` | `tutorials/bukkit-diary/0X-标题.html` |
| `img/Chapter02/` | `assets/images/tutorials/chapter-02/` |
| `img/Chapter03/` | `assets/images/tutorials/chapter-03/` |
| `img/brmc_developer_team.png` | `assets/images/tutorials/brmc-developer-team.png` |
| `img/image.png` | `assets/images/tutorials/image.png` |
| `resources/headicon_pkg/` | `assets/images/avatars/` |
| `resources/background/` | `assets/images/backgrounds/` |
| `features/docs/foundation_javadoc/` | `docs/javadocs/foundation/` |
| `features/docs/lemoncore_javadoc/` | `docs/javadocs/lemoncore/` |

命名规范：目录与页面文件采用小写 kebab-case；章节保留序号前缀与中文标题，分隔符统一为 `-`；内容型图片文件名保留原义。

## 引用更新

- `index.html`、`pages/*.html`、`tutorials/bukkit-diary/*.html` 的 href/src 已按新相对路径更新（含 JS 内头像路径）。
- `docs/*.md` 与 `README.md` 中的路径引用已同步。
- `wrangler.jsonc` 的 `assets.directory` 为 `"."`，整根目录发布，无需变更。

## 校验与回退

- 全站相对链接检查通过（0 断链）；JS 动态资源（头像、背景）逐一验证存在。
- 迁移以 git rename 形式暂存（`git status` 显示 R 记录，历史可追溯）；确认无误后 `git commit` 即可固化。
- 整树备份（不含 .git/.idea）：`../CarolimoneHome_bak_20260927`。
