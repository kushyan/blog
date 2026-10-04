---
title: "第一篇文章：这个博客是怎么搭起来的"
slug: "hello-world"
date: 2026-10-04T10:00:00+08:00
lastmod: 2026-10-04T10:00:00+08:00
draft: false
author: "Kushyan"
description: "用 Hugo + PaperMod 主题 + GitHub Actions 搭建一个零成本、可长期维护的个人博客，含 Giscus 评论。"
tags: ["Hugo", "GitHub Pages", "建站"]
categories: ["技术笔记"]
series: ["博客搭建"]
ShowToc: true
TocOpen: true
ShowReadingTime: true
ShowBreadCrumbs: true
comments: true
---

这是个可以长期写下去的博客：**写作只用 Markdown，部署全自动，服务器成本为零**。

## 这套组合为什么合适

| 需求 | 方案 | 说明 |
| --- | --- | --- |
| 生成静态站 | Hugo | 毫秒级构建，几千篇文章也没压力 |
| 外观与交互 | PaperMod | 明暗切换、搜索、目录、代码复制，开箱即用 |
| 托管 | GitHub Pages | 免费、自带 HTTPS、可绑自定义域名 |
| 自动部署 | GitHub Actions | 推送即上线，本地不用装任何东西 |
| 评论 | Giscus | 基于 GitHub Discussions，免费无广告无后端 |

## 日常写作流程

新建一篇文章，只需要一条命令：

```bash
hugo new content posts/my-new-post.md
```

然后编辑这个 Markdown 文件，把 `draft` 改成 `false`，提交即可：

```bash
git add .
git commit -m "post: 我的新文章"
git push
```

推送之后 GitHub Actions 会自动构建并发布，大约一分钟后线上就能看到。

## Front matter 常用字段

```toml
+++
title = "文章标题"
date = 2026-10-04
draft = false
tags = ["标签一", "标签二"]
categories = ["分类"]
series = ["系列名"]      # 同系列文章会自动串起来
ShowToc = true           # 是否显示右侧目录
comments = true          # 是否开启这篇的评论
+++
```

## 关于交互细节

- **搜索**：点击导航栏「搜索」，输入关键词即可全文检索（基于客户端索引，无需后端）。
- **明暗主题**：右上角太阳/月亮图标切换，偏好会记在浏览器里。
- **目录**：长文章自动生成悬浮目录，滚动时高亮当前小节。
- **代码块**：右上角一键复制。
- **评论**：文章底部评论区，用 GitHub 账号登录后即可留言。

## 下一步

去「关于」页面补上你的自我介绍，然后把 `hugo.toml` 里的 `params.giscus` 换成你自己的仓库信息，评论就能用了。
