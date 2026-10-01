# f1shsmell 的博客

基于 [Astro](https://astro.build/) + [Fuwari](https://github.com/saicaca/fuwari) 主题的个人博客，部署在 GitHub Pages。

**线上地址**：https://f1shsmell.github.io

## 常用命令

```bash
pnpm install     # 安装依赖（需要 Node.js >= 20 和 pnpm >= 9）
pnpm dev         # 本地开发，http://localhost:4321 实时热更新
pnpm build       # 构建到 dist/（含 Pagefind 全文搜索索引）
pnpm preview     # 本地预览构建结果
pnpm new-post    # 新建一篇文章
pnpm ship        # 一键发布：提交 → 推送 → 等 Actions 部署完 → 校验线上
```

## 快速编辑

改这些文件就够了，不用碰主题源码：

| 想改什么 | 改哪里 |
| --- | --- |
| 站点标题 / 副标题 / 主题色 / 横幅 | `src/config.ts` 的 `siteConfig` |
| 头像、昵称、个性签名、社交链接 | `src/config.ts` 的 `profileConfig` |
| 导航栏链接 | `src/config.ts` 的 `navBarConfig` |
| 关于页正文 | `src/content/spec/about.md` |
| 文章 | `src/content/posts/*.md`（`pnpm new-post <名字>` 建新的） |
| 头像 / 横幅图片 | `src/assets/images/`，路径写在 `src/config.ts` |
| 布局与配色细节 | `src/layouts/`、`src/styles/` |

两条链路按需选：

- **改文字、改文章**：浏览器里直接改，无需本地环境。打开 <https://github.dev/f1shsmell/f1shsmell.github.io>（或在仓库里按 `.`），编辑文件后 `Ctrl+S` 提交到 main，Actions 自动构建发布，约 1–3 分钟生效。缺点是看不到实时效果。
- **改样式、换图、调布局**：本地热更新。`pnpm dev` 起服务（约 4 秒，改动秒级可见），满意后 `pnpm ship "说明"` 一条命令发布并等到上线。

`pnpm ship` 会先 `git pull --rebase` 再推送，所以哪怕你之前用网页端改过、本地落后了也不会冲突失败或覆盖线上。反过来，**在网页端提交前记得先 push 本地的活**，两边都走 main 就不会分叉。

## 如何写文章

1. 新建文章：`pnpm new-post my-post`，或在 `src/content/posts/` 下直接建 `.md` 文件
2. 编辑 frontmatter（标题、日期、摘要、标签、分类），`draft: true` 表示草稿不发布
3. 本地 `pnpm dev` 预览满意后，`pnpm ship "发一篇文章"` 推到 main
4. GitHub Actions 自动构建并发布，一两分钟后线上生效

## 站点配置

- 站点标题 / 作者 / 导航 / 侧栏资料：`src/config.ts`
- 站点 URL 与构建选项：`astro.config.mjs`
- 关于页内容：`src/content/spec/about.md`
- 头像与横幅图：`src/assets/images/`（替换 `demo-avatar.png`，或改 `src/config.ts` 里的路径）

## 部署

推送到 main 分支后，`.github/workflows/deploy.yml` 会用官方 `withastro/action` 构建并发布到 GitHub Pages。仓库 Settings → Pages 的来源需设为 **GitHub Actions**。

`pnpm ship` 依赖 `gh` CLI 已登录（`gh auth status` 检查），它会 `gh run watch` 到部署结束并打印构建任务链接。构建失败时线上保持上一个成功版本，不会白屏。
