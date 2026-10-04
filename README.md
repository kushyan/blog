# Kushyan 的博客

用 **Hugo + PaperMod + GitHub Pages** 搭建的个人博客。写作只写 Markdown，推送即自动上线，零服务器成本。

- 线上地址：<https://kushyan.github.io/blog/>
- 仓库：<https://github.com/kushyan/blog>

---

## 一、已经做好的部分

| 模块 | 状态 | 说明 |
| --- | --- | --- |
| 站点框架 | ✅ | Hugo v0.167.0 Extended，PaperMod 主题（新版 `layouts/_partials` 结构） |
| 导航区块 | ✅ | 文章 / 分类 / 标签 / 归档 / 搜索 / 关于 |
| 明暗主题 | ✅ | 右上角切换，跟随系统，偏好写入浏览器 |
| 全站搜索 | ✅ | 基于 Fuse.js 的客户端索引 `index.json`，无后端 |
| 文章目录 | ✅ | 长文自动生成右侧目录，滚动高亮 |
| 代码块 | ✅ | Chroma 高亮 + 一键复制 |
| 标签 / 分类 / 系列 | ✅ | 含分页与 RSS |
| RSS 订阅 | ✅ | `/index.xml` |
| SEO | ✅ | canonical、OpenGraph、Twitter Card、Schema JSON-LD |
| 404 页 | ✅ | 主题自带 |
| 评论 | ⚠️ 待填 ID | Giscus 已接好，填入 `repoId` / `categoryId` 后生效 |
| 自动部署 | ✅ | GitHub Actions，推送 `main` 即发布 |
| 可视化后台 | ✅ | Decap CMS，浏览器里写文章/传图/存草稿，入口 `/admin/` |

> 当前评论区显示的是「尚未启用」提示。完成下面「五、让评论真正生效」后，评论区就会变成真正的 Giscus 评论框。

---

## 二、目录结构

```
blog/
├─ .github/workflows/hugo.yml   # 自动构建并发布到 GitHub Pages
├─ archetypes/default.md        # hugo new 生成文章的模板
├─ assets/css/extended/custom.css  # 自定义样式（自动加载，升级主题不丢）
├─ content/
│  ├─ about.md                  # 关于页
│  ├─ archives.md               # 归档页（layout: archives）
│  ├─ search.md                 # 搜索页（layout: search）
│  └─ posts/                    # 所有文章
├─ layouts/_partials/
│  ├─ comments.html             # Giscus 评论区（站点级覆盖主题的占位文件）
│  └─ head.html                 # 覆盖主题 head，使用 static/favicon.svg
├─ static/favicon.svg           # 站点图标
├─ static/admin/                # Decap CMS 可视化写作后台
│  ├─ index.html                #   后台入口页
│  └─ config.yml                #   后台字段与仓库配置
├─ deploy/oauth-worker.js       # 后台登录用的免费 OAuth 代理（部署到 Cloudflare）
├─ themes/PaperMod/             # 主题
├─ hugo.toml                    # 全部配置（含菜单、参数、评论）
├─ preview.ps1                  # 本地预览
└─ setup-hugo.ps1               # 一键安装本地 Hugo
```

---

## 三、可视化写作后台（推荐，不碰命令行）

博客内置了 **Decap CMS**（浏览器里的写作后台）。登录后就能像用 Word 一样写文章：标题、日期、分类、标签都是表单，正文是富文本编辑器（也能一键切 Markdown 源码），还能直接拖图上传、存草稿。保存后自动提交到 GitHub 并触发部署，全程不用打开命令行。

后台入口：<https://kushyan.github.io/blog/admin/>

### 3.1 一次性配置（约 5 分钟，只需第一次）

后台登录需要 GitHub 授权，而 GitHub 要求授权走服务端，所以要用一个免费的 **Cloudflare Worker** 做中转。共四步，全部网页点选即可：

**第 1 步：在 GitHub 建 OAuth App**

打开 <https://github.com/settings/developers> → *OAuth Apps* → *New OAuth App*：

| 项 | 填什么 |
| --- | --- |
| Application name | 我的博客后台 |
| Homepage URL | `https://kushyan.github.io/blog/` |
| Authorization callback URL | `https://你的worker.workers.dev/callback` |

创建后得到 **Client ID**，再点 *Generate a new client secret* 得到 **Client Secret**（只显示一次，先复制保存）。

**第 2 步：在 Cloudflare 建 Worker**

1. 打开 <https://dash.cloudflare.com> 注册/登录（免费）。
2. 左侧 *Workers & Pages* → *Create* → *Create Worker*。
3. 删掉默认代码，把仓库里的 [`deploy/oauth-worker.js`](deploy/oauth-worker.js) 全部内容粘贴进去，点 *Deploy*。
4. 记下你的 Worker 域名，形如 `https://xxxx.your-subdomain.workers.dev`。

**第 3 步：给 Worker 填两个密钥**

回到刚创建的 Worker → *Settings* → *Variables and Secrets* → *Add secret*，分别添加：

| 名称 | 值 |
| --- | --- |
| `GITHUB_CLIENT_ID` | 第 1 步的 Client ID |
| `GITHUB_CLIENT_SECRET` | 第 1 步的 Client Secret |

**第 4 步：把 Worker 地址填回博客**

编辑 [`static/admin/config.yml`](static/admin/config.yml)，把这一行：

```yaml
base_url: https://YOUR-WORKER.workers.dev
```

改成你的 Worker 域名（不带路径、不带末尾斜杠），提交推送即可。

> 走完这四步后台就能登录了，以后写作不再需要碰这些配置。

### 3.2 日常使用

1. 打开 <https://kushyan.github.io/blog/admin/>，点 *Login with GitHub* 授权。
2. 左侧 *文章* → *New 文章*，填表单、写正文。
3. 需要插图就直接拖进正文，会自动上传到仓库并生成引用。
4. 想直接发布 → 「保存为草稿」不勾选，点 *Save*；想先存着 → 勾选「保存为草稿」，线上不显示。
5. *Save* 后约 1 分钟，博客自动更新。

### 3.3 写作提示

- **英文别名（URL）必填**：如 `hello-world`，决定文章链接 `/blog/posts/hello-world/`；发布后别改，否则旧链接失效。
- **日期**只选到天即可。
- **分类**一般填一个（技术笔记 / 阅读摘录 / 生活随笔），标签可多填几个。
- 后台保存后，文章头部会从 `+++`（TOML）变成 `---`（YAML），Hugo 两种都认，无影响。
- 后台在 `/admin/`，已加 noindex，普通访客搜不到；登录页公开，但只有你授权的 GitHub 账号能进。

---

## 四、命令行写作（备选）

```powershell
cd C:\Users\29528\Desktop\codex\blog

# 1. 新建文章
.\tools\hugo.exe new content posts\my-post.md

# 2. 编辑 content\posts\my-post.md，把 draft 改为 false
#    建议给中文标题加一个英文 slug，URL 更干净： slug: "my-post"

# 3. 本地预览（改动即时刷新）
pwsh -File .\preview.ps1        # 打开 http://127.0.0.1:1313/

# 4. 发布
git add .
git commit -m "post: 我的新文章"
git push
```

推送后 1 分钟左右，GitHub Actions 会自动构建并发布。

### 文章头部字段

```toml
+++
title = "文章标题"
slug = "english-slug"        # 可选，URL 用
date = 2026-10-04T10:00:00+08:00
lastmod = 2026-10-04T10:00:00+08:00
draft = false                # true = 只在本地预览时显示
description = "摘要，用于 SEO 和社交分享卡片"
tags = ["Hugo", "建站"]
categories = ["技术笔记"]
series = ["博客搭建"]        # 同系列自动串联
ShowToc = true               # 显示目录
comments = true              # 这篇是否开评论
+++
```

---

## 五、让评论真正生效（Giscus，约 3 分钟）

Giscus 把评论存在仓库的 **Discussions** 里，免费、无广告、不需要任何后端或数据库。

1. **开启 Discussions**
   打开 <https://github.com/kushyan/blog/settings> → 找到 *Features* → 勾选 **Discussions**。

2. **安装 giscus App**
   打开 <https://github.com/apps/giscus> → Install → 只授权 `kushyan/blog` 这一个仓库。

3. **生成两个 ID**
   打开 <https://giscus.app/zh-CN>，在「仓库」里填 `kushyan/blog`，页面下方会给出 `data-repo-id` 与 `data-category-id`。

4. **填回配置**
   编辑 `hugo.toml`，替换这两行占位值：

   ```toml
   [params.giscus]
     repo = "kushyan/blog"
     repoId = "R_kgDOxxxxxxx"        # ← 换成你的
     category = "Announcements"
     categoryId = "DIC_kwDOxxxxxxx"  # ← 换成你的
   ```

5. 提交推送：

   ```powershell
   git add hugo.toml
   git commit -m "chore: 启用 Giscus 评论"
   git push
   ```

之后每篇文章底部都会出现评论区，读者用 GitHub 账号登录即可留言。

> 想按文章独立讨论？把 `mapping` 从 `pathname` 改成 `og:title` 或 `title` 即可，同一 `mapping` 不要中途更换，否则旧评论会对不上文章。
> 如果以后绑定了自定义域名，`mapping` 保持 `pathname` 最稳妥。

---

## 六、首次上线 GitHub Pages

仓库已经在本地初始化好了，只差推到 GitHub。

### 1. 在 GitHub 创建仓库

打开 <https://github.com/new>，仓库名填 **`blog`**，选择 **Public**（Pages 免费版需要公开仓库；私有仓库的 Pages 需要 Pro）。
**不要**勾选初始化 README / .gitignore，保持空仓库。

### 2. 推送代码

```powershell
cd C:\Users\29528\Desktop\codex\blog
git remote add origin https://github.com/kushyan/blog.git
git branch -M main
git push -u origin main
```

> 如果推送时提示需要登录，推荐用 GitHub CLI（`gh auth login`）或 Personal Access Token 作为密码。
> 想改用 SSH：`git remote set-url origin git@github.com:kushyan/blog.git`

### 3. 开启 Pages

推送后打开 <https://github.com/kushyan/blog/settings/pages>：

- **Source** 选择 **GitHub Actions**（不是 “Deploy from a branch”）
- 保存后回到 <https://github.com/kushyan/blog/actions> 观察 *Deploy Hugo site to GitHub Pages* 工作流
- 绿色勾出现后，访问 <https://kushyan.github.io/blog/>

首次部署通常 1–2 分钟。

### 4. 可选：绑定自己的域名

1. 在仓库 `static/` 下新建 `CNAME` 文件，内容写你的域名，例如 `blog.example.com`（不要带 `https://`）。
2. 到域名服务商处添加 CNAME 记录指向 `kushyan.github.io`。
3. 在 Pages 设置里勾选 **Enforce HTTPS**，同时把 `hugo.toml` 里的 `baseURL` 改成新域名。

---

## 七、常见改动

| 想改什么 | 改哪里 |
| --- | --- |
| 站点标题、副标题、描述 | `hugo.toml` 顶部与 `[params]` |
| 导航栏菜单 | `hugo.toml` 的 `[languages.zh.menu]` |
| 首页欢迎语 | `[languages.zh.params] homeInfoParams` 与 `[params] homeInfoParams` |
| 每页文章数 | `hugo.toml` 的 `paginate` |
| 配色与间距 | `assets/css/extended/custom.css` |
| 社交图标 | `[params.socialIcons]`（支持 github、x、mail、rss 等） |
| 开启英文界面 | 去掉 `[languages.en]` 段的注释 |
| 换主题 | 把主题目录放进 `themes/`，改 `hugo.toml` 的 `theme`（自定义样式和覆盖模板需相应调整） |
| 后台字段、仓库、图片路径 | `static/admin/config.yml` |
| 后台登录的 OAuth 中转 | `deploy/oauth-worker.js`（部署在 Cloudflare） |

---

## 八、注意事项

- **`themes/` 已随仓库一起提交**。想跟官方同步更新主题时，用 `git subtree` 或直接下载新版覆盖 `themes/PaperMod`；因为自定义内容都在 `assets/css/extended/` 和 `layouts/`，覆盖主题不会丢配置。
- 本机直接访问 GitHub 的 TLS 受限，所以 `themes/PaperMod` 和 `tools/hugo.exe` 是通过镜像源获取的。若需重新安装 Hugo，运行 `pwsh -File .\setup-hugo.ps1`。
- 本地 Hugo 版本建议与 `.github/workflows/hugo.yml` 里的 `HUGO_VERSION` 保持一致（当前 `0.167.0`），避免本地能过、线上报错。
- **可视化后台**依赖两处配置：`static/admin/config.yml` 的 `base_url`（指向你的 Cloudflare Worker）和 Worker 里的两个密钥。改域名或换账号时，按「三、可视化写作后台 → 3.1」重新走一遍即可。
