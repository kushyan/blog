---
title: 博客跑通全流程
slug: blog
date: 2026-10-04
author: Kushyan
description: 博客跑通全流程,用deepseek写了好久,第一次搞,没什么经验
categories:
  - 技术笔记
tags:
  - 经验
ShowToc: true
ShowReadingTime: true
comments: true
draft: false
---
# 一、整站是怎么运转的

把博客想象成一条**自动化出版流水线**。一共 9 个零件，各司其职：

## 两条数据流

**① 写作 → 上线（主流程）**

**② 后台登录（只走一次设置，之后每次登录都用）**

> 为什么要 Worker 这个"中介"？因为 GitHub 规定登录授权必须在服务器上完成，不能在纯网页里做——否则任何人都能偷走你的令牌。

# 二、这次做过的步骤，各自的作用

1装好 Hugo（本地）让电脑能生成网页、能本地预览2放好 PaperMod 主题决定外观3写 `hugo.toml`站点总配置：标题、菜单、开关4写好第一批文章 + 页面填充内容（首页/关于/归档/搜索）5重做视觉（自定义 CSS）换成现代极简高级灰 UI6加 GitHub Actions 工作流让部署自动化，以后不用手动发布7加 Decap CMS 后台实现"不用命令行写文章"8写 Cloudflare Worker 脚本解决后台登录问题9建 GitHub 仓库并推送把代码放上云端10Pages 的 Source 改为 GitHub Actions让网站用**构建产物**，而不是直接把仓库当网站11部署 Cloudflare Worker让"中介"上线12建 GitHub OAuth App拿到 Client ID / Secret 这对钥匙13把两个密钥填进 Worker让中介能证明身份（这一步之前缺失，导致 `client_id=undefined`）14把 Worker 地址填进 `config.yml`告诉后台"登录该找谁"15修掉地址末尾多余的 `/`解决登录 404

# 三、注意事项（重要）

## 🔴 还有一件事没做完：评论

你后台的评论功能**目前还是关闭状态**（配置里还是占位符）。想开评论，3 步：

1. 仓库 

   **Settings → Features → 勾选 Discussions**
2. 装 App：

   <https://github.com/apps/giscus>

    （只授权 

   `kushyan/blog`

   ）
3. 到 

   <https://giscus.app/zh-CN>

    填 

   `kushyan/blog`

   ，复制给出的 

   `repoId`

    和 

   `categoryId`
4. 填进 

   `hugo.toml`

    里 

   `[params.giscus]`

    的对应两行，提交推送

## 🟡 日常使用要留意的

**「英文别名」别乱改**它决定文章链接，改了旧链接就 404 了

**后台保存 = 立即发布**想先放着不公开，就勾上「保存为草稿」

**推送后等约 1 分钟**Actions 构建需要时间，别以为没生效

**别接受 GitHub 推荐的 Jekyll 工作流**之前误加过一个（我已清理）。Hugo 和 Jekyll 会打架

**图片路径绑定在 `/blog/`**上传的图引用 `/blog/images/...`

## 🟢 可以放心的

* **免费**

  ：GitHub Pages、Actions、Cloudflare Worker 免费额度对个人博客绰绰有余（Worker 每天 10 万次请求，你一天用几十次而已）
* **备份**

  ：仓库本身就是完整备份，任何一次改动都能回滚
* **安全**

  ：登录页虽然公开，但

  **只有你授权的 GitHub 账号能真正登录**
* **本地预览**

  ：想看效果就双击 

  `preview.bat`

  （或 

  `preview.ps1`

  ），改文章浏览器会自动刷新

## 🔵 以后想扩展时

零件一句话说它是干嘛的**Hugo**翻译机：把 Markdown 文章 + 模板 → 网页 HTML**PaperMod**装修风格：决定长什么样（皮肤）**GitHub 仓库**云盘 + 时光机：存所有源文件，每步改动都有快照可回滚**GitHub Actions**自动工人：你一上传，它就跑 Hugo 构建并发布**GitHub Pages**免费服务器：把做好的网页挂在网上给读者看**Decap CMS**浏览器里的写作后台：可视化写文章，不用命令行**Cloudflare Worker**门卫/中介：帮你安全地向 GitHub 证明"你是你"**GitHub OAuth App**授权凭证：赋予中介代表你登录的资格**Giscus**留言板：用 GitHub Discussions 存评论代码块代码块步骤做的事目的1装好 Hugo（本地）让电脑能生成网页、能本地预览2放好 PaperMod 主题决定外观3写 `hugo.toml`站点总配置：标题、菜单、开关4写好第一批文章 + 页面填充内容（首页/关于/归档/搜索）5重做视觉（自定义 CSS）换成现代极简高级灰 UI6加 GitHub Actions 工作流让部署自动化，以后不用手动发布7加 Decap CMS 后台实现"不用命令行写文章"8写 Cloudflare Worker 脚本解决后台登录问题9建 GitHub 仓库并推送把代码放上云端10Pages 的 Source 改为 GitHub Actions让网站用**构建产物**，而不是直接把仓库当网站11部署 Cloudflare Worker让"中介"上线12建 GitHub OAuth App拿到 Client ID / Secret 这对钥匙13把两个密钥填进 Worker让中介能证明身份（这一步之前缺失，导致 `client_id=undefined`）14把 Worker 地址填进 `config.yml`告诉后台"登录该找谁"15修掉地址末尾多余的 `/`解决登录 404事项说明**「英文别名」别乱改**它决定文章链接，改了旧链接就 404 了**后台保存 = 立即发布**想先放着不公开，就勾上「保存为草稿」**推送后等约 1 分钟**Actions 构建需要时间，别以为没生效**别接受 GitHub 推荐的 Jekyll 工作流**之前误加过一个（我已清理）。Hugo 和 Jekyll 会打架**图片路径绑定在 `/blog/`**上传的图引用 `/blog/images/...`想做什么改哪里换配色 / 字体 / 圆角`assets/css/extended/custom.css`改导航菜单、站点标题`hugo.toml`加后台字段（比如"封面图"）`static/admin/config.yml`绑自己的域名加 `static/CNAME` + 改 `baseURL`，同时把 `public_folder` 从 `/blog/images` 改成 `/images`换主题主题放进 `themes/`，改 `hugo.toml` 的 `theme`
