
# 语台茶馆
[![996.icu](https://img.shields.io/badge/link-996.icu-red.svg)](https://996.icu)

[![Anti996 LICENSE](https://img.shields.io/badge/license-Anti%20996-blue.svg)](https://github.com/996icu/996.ICU/blob/master/LICENSE)

[![GPLv2 License](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/gpl-2.0.html)

[English](README.md)

## 内容索引

- [简介](#简介)

- [安装](#安装)

- [用法](#用法)

- [特性](#特性)

- [做贡献](#做贡献)

- - [待办事项](#待办事项)

- [许可协议](#许可协议)

- [常见问题](#常见问题)

- [依赖库列表](#依赖库列表)

- [联系我](#联系我)

## 简介

这是一个去中心化的聊天平台的实验，目前仍处于alpha测试阶段。然而，它与其他P2P应用的不同之处在于，***它是一个网页！***

[这里有个小Demo](https://i-am-cjc.tech)


## 安装

你需要确保你安装了 [Node.js](https://nodejs.org/) 和 [Git ](https://git-scm.com/)。然后，运行下面的命令

```
git clone https://github.com/yutai-teahouse/yutai-teahouse
cd yutai-teahouse
npm install
```
## 用法

这个项目利用了[vite bundler](https://vitejs.dev/). 要启动vite服务器，请运行

```
npm start
```

要构建一个生产环境用版本，请运行

```
npm run build
```

## 特性

- **匿名。** 它只会显示一串临时的ID，而且这玩意不会收集你的任何个人信息。

- **高可用性。** 一旦静态文件被下载到浏览器的缓存中，和服务器就半毛钱关系没有了。所以，哪怕服务器宕机了，这玩意还能用。

- **聊天室按语言划分。** 它会检测你的浏览器语言，然后把界面和聊天室切换成你所在的语言。

- **没有消息记录。** 把聊天窗口关了消息就没了。

- **支持Markdown。** 现在富文本聊天已经很常见了，为此我加入了Markdown。

## 做贡献

就像我上面说的那样，这玩意还是alpha测试版。要做的事情太多了。欢迎交Issue和PR！

### 待办事项
1) 美化一下UI
2) 找Bug
3) 设计个图标
4) 移除Herobrine

## 许可协议

本项目由GPL v2许可证和Anti-996许可证叠加许可，其中若有矛盾部分，以Anti-996许可证为准。详情请见`LICENSE-GPLv2`和`LICENSE-Anti996`。

## 常见问题
- 为什么要管这玩意叫 **“语台茶馆”** 呢？
- **“语台茶馆”**谐音自**“裕泰茶馆”**，来自于老舍的知名剧本《茶馆》。我在读《茶馆》时，就在想："如果我现在是王利发，我会怎么办呢？" 然后，在《茶馆》的开头，我看到有一段是这么写的： 

>在这里，可以听到最荒唐的新闻，如某处的大蜘蛛怎么成了精，受到雷击。奇怪的意见也在这里可以听到，像把海边上都修上大墙，就足以挡住洋兵上岸。这里还可以听到某京戏演员新近创造了什么腔儿，和煎熬鸦片烟的最好的方法。这里也可以看到某人新得到的奇珍──一个出土的玉扇坠儿，或三彩的鼻烟壶。这真是个重要的地方，简直可以算作文化交流的所在。

这就是这个项目的灵感来源。

## 依赖库列表

[js-libp2p](https://github.com/libp2p/js-libp2p/)及其依赖 ( 在`package.json` 和`package-lock.json`中列举）

[marked](https://github.com/markedjs/marked) 及其依赖 ( 在`package.json` 和`package-lock.json`中列举）

[tailwindcss](https://github.com/tailwindlabs/tailwindcss) 及其依赖 ( 在`package.json` 和`package-lock.json`中列举）

[DOMPurify](https://github.com/cure53/DOMPurify) 及其依赖 ( 在`package.json` 和`package-lock.json`中列举）

[emoji-mart](https://github.com/missive/emoji-mart/) 及其依赖 ( 在`package.json` 和`package-lock.json`中列举）

[badwords-list](https://github.com/web-mech/badwords-list) 及其依赖 ( 在`package.json` 和`package-lock.json`中列举）

[naughty-words](https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words) 及其依赖 ( 在`package.json` 和`package-lock.json`中列举）

[Day-night-toggle-button](https://github.com/Xiumuzaidiao/Day-night-toggle-button)

## 联系我

Email: i-am-cjc@i-am-cjc.tech
