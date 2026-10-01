---
title: 如何在这个博客写新文章
published: 2026-10-01
description: 这篇是给自己看的备忘：新建文章、本地预览、发布上线的完整流程。
tags: [博客, 教程]
category: 教程
draft: false
---

这是一篇备忘录，记录如何在这套博客里写作和发布。

## 新建一篇文章

文章都是 `src/content/posts/` 下的 Markdown 文件。最快的建法是用脚手架命令：

```bash
pnpm new-post my-first-post
```

会在 `src/content/posts/` 下生成 `my-first-post.md`，然后编辑它的 frontmatter：

```markdown
---
title: 文章标题
published: 2026-10-01
description: 一句话摘要，会显示在文章卡片上。
tags: [标签1, 标签2]
category: 分类
draft: false
---
```

- `draft: true` 的文章只在本地预览可见，构建时不会发布
- 标签和分类会自动聚合成归档页

## 本地预览

```bash
pnpm dev        # 开发模式，http://localhost:4321 实时热更新
pnpm build      # 构建产物到 dist/，并做全文搜索索引
pnpm preview    # 本地预览构建结果
```

## 发布上线

直接 `git push` 到 main 分支，GitHub Actions 会自动构建并发布到 GitHub Pages，一两分钟后线上生效。

## 一些好用的语法

这个主题内置了不少 Markdown 扩展，比如代码块带行号和折叠、GitHub 仓库卡片：

::github{repo="saicaca/fuwari"}

以及提示框：

> [!TIP]
> 这是一个提示框，支持 note / tip / important / caution / warning。
