---
title: "Markdown 写作速查：常用语法与 Hugo 短代码"
slug: "markdown-cheatsheet"
date: 2026-10-04T10:30:00+08:00
lastmod: 2026-10-04T10:30:00+08:00
draft: false
author: "Kushyan"
description: "把常用的 Markdown 语法和 Hugo 内置短代码整理成一页，写作时直接照抄。"
tags: ["Markdown", "Hugo", "写作"]
categories: ["技术笔记"]
series: ["博客搭建"]
ShowToc: true
ShowReadingTime: true
comments: true
---

写博客不需要记住太多语法，下面这些覆盖了日常九成场景。

## 文本与强调

```markdown
**加粗**、*斜体*、~~删除线~~、`行内代码`
[链接文字](https://example.com)
![图片描述](/images/example.png)
```

**加粗**、*斜体*、~~删除线~~、`行内代码`。

## 列表与任务

```markdown
- 无序列表
  - 二级缩进
1. 有序列表
- [x] 已完成
- [ ] 待办
```

- [x] 已完成的事
- [ ] 待办的事

## 引用与提示块

> 引用一段别人的话，或者给自己留个提醒。

Hugo 内置了 `details` 短代码，适合折叠长内容：

{{% details "点开看折叠内容" %}}
这里是折叠起来的内容，适合放日志、附件说明等。
{{% /details %}}

## 代码块

带语言标注就会自动高亮，右上角有一键复制：

```python
def fib(n: int) -> int:
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
```

```yaml
name: deploy
on:
  push:
    branches: [main]
```

## 表格

```markdown
| 语法 | 效果 | 备注 |
| --- | --- | --- |
| `**粗体**` | **粗体** | 常用 |
```

| 语法 | 效果 | 备注 |
| --- | --- | --- |
| `**粗体**` | **粗体** | 常用 |
| `> 引用` | 引用块 | 引用他人观点 |

## 图片与图注

PaperMod 支持 `figure` 短代码，自带图注和缩放：

```markdown
{{</* figure src="/images/cover.png" caption="这是一张示例图" */>}}
```

## 小结

语法够用就好，真正重要的是**持续写**。把这篇当作模板，需要时回来抄一段即可。
