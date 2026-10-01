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
```

## 如何写文章

1. 新建文章：`pnpm new-post my-post`，或在 `src/content/posts/` 下直接建 `.md` 文件
2. 编辑 frontmatter（标题、日期、摘要、标签、分类），`draft: true` 表示草稿不发布
3. 本地 `pnpm dev` 预览满意后，`git push` 到 main 分支
4. GitHub Actions 自动构建并发布，一两分钟后线上生效

## 站点配置

- 站点标题 / 作者 / 导航 / 侧栏资料：`src/config.ts`
- 站点 URL 与构建选项：`astro.config.mjs`
- 关于页内容：`src/content/spec/about.md`
- 头像与横幅图：`src/assets/images/`（替换 `demo-avatar.png`，或改 `src/config.ts` 里的路径）

## 部署

推送到 main 分支后，`.github/workflows/deploy.yml` 会用官方 `withastro/action` 构建并发布到 GitHub Pages。仓库 Settings → Pages 的来源需设为 **GitHub Actions**。
