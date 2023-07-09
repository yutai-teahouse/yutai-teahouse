# YuTai Teahouse
[![996.icu](https://img.shields.io/badge/link-996.icu-red.svg)](https://996.icu)[![LICENSE](https://img.shields.io/badge/license-Anti%20996-blue.svg)](https://github.com/996icu/996.ICU/blob/master/LICENSE)[![GPLv2 License](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/gpl-2.0.html)

[简体中文版](README.zh-CN.md)

## Table of Contents

- [Introduction](#introduction)

- [Installation](#installation)

- [Usage](#usage)

- [Features](#features)

- [Contributing](#contributing)

- - [TODOs](#todos)

- [License](#license)

- [FAQs](#faqs)

- [Credits](#credits)

- [Contact](#contact)

## Introduction

This is an experiment of a decentralized chat platform, which is still in alpha test. However, what makes it different from other P2P apps is that ***it is realized in your browser!***

[Demo here](https://i-am-cjc.tech/)

## Installation

You need to ensure that you have got the latest [Node.js](https://nodejs.org/) and [Git ](https://git-scm.com/). Then, run the commands below.

```
git clone https://github.com/yutai-teahouse/yutai-teahouse
cd yutai-teahouse
npm install
```
## Usage

This reponsitory leverages the [vite bundler](https://vitejs.dev/). To start the vite server, run

```
npm start
```

To build a production version, run

```
npm run build
```

## Features

- **Anonymous.** Only a string of your temporaily ID is displayed. It won't collect ANY of your information.

- **High stability.** Once the static files are downloaded into the cache of your browser, there is nothing to do with the server anymore. So, it could still be avaliable after the server is down.

- **Divided chat rooms by language.** It will detect your browser language, and switch the UI and the chat room to your language.

- **No message recorded.** No message is stored after closing your chat window.

- **Markdown support.** It is common to see rich-text message this days, and here, we realized it using markdown.

## Contributing

As I mentioned above, this reponsitory is still in alpha test. There is LOTS of things to do. Issues and PRs are warmly welcomed!

### TODOs

Listed by the priority.

1) Realize the manual selection of languages
2) ~~Translation of UI to other languages~~ Github Copilot really helps when it comes to i18n.
3) Have the UI beautified
4) Realize content filtering
5) Find & kill the bugs
6) Design an icon
7) Remove the herobrine

## License

This responsitory is licensed under both Anti-996 license and GPL v2 license. In case of contradiction, the Anti-996 license shall prevail.  See `LICENSE-GPLv2` and `LICENSE-Anti996` for detail. 

## FAQs

- Why is it named as **"Yutai Teahouse"** ?
- This name comes from Lao She's famous play "The Teahouse". When I was reading the lines of the play, I was wandering, "What if I am a Wang Lifa at now, how would I run it?" Then I saw a period of description of the teahouse at the beggining of the play: 

> In the teahouses one could hear the most absurd stories, such as how in a certain place a huge spider had turned into a demon and was then struck by lightening. One could also come in contact with the strangest views; for example, that foreign troops could be prevented from landing by building a Great Wall along the sea coast. Here one might also hear about the latest tune composed by some Beijing Opera star, or the best way to prepare opium. In the teahouses one might also see rare art objects newly acquired by some patron -- a jade fan pendant, recently unearthed, or a three-colour glazed snuff bottle. Yes, the teahouse was indeed an important place; it could even be reckoned a kind of cultural centre.

> (COPYRIGHT CLAIM: The copyright of this work has expired according to the relevant laws of PRC)

That's where my inspiration of this project come from.

## Credits

[js-libp2p](https://github.com/libp2p/js-libp2p/) and its supporting modules ( Listed in `package.json`  and `package-lock.json`)

[marked](https://github.com/markedjs/marked) and its supporting modules ( Listed in `package.json`  and `package-lock.json`)

[tailwindcss](https://github.com/tailwindlabs/tailwindcss) and its supporting modules ( Listed in `package.json` and `package-lock.json`)

[DOMPurify](https://github.com/cure53/DOMPurify) and its supporting modules ( Listed in `package.json` and `package-lock.json`)

[emoji-mart](https://github.com/missive/emoji-mart) and its supporting modules ( Listed in `package.json` and `package-lock.json`)


## Contact

Email: i-am-cjc@i-am-cjc.tech