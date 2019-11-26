title: 使用Hexo搭建博客
tags:
  - Blog
  - NexT
  - Hexo
date: 2015-09-20 17:29:24
---

这是一篇个人搭建博客过程中的经验总结, 不适合用作入门教程;
需要更详细的资料请 [点击这里](http://lmgtfy.com/?q=Hexo)

# 安装

系统环境 Windows 10 64bit

文本编辑器推荐使用 [Sublime Text](http://www.sublimetext.com/),
文件编码选择 `UTF-8`

## Git

安装 [GitHub for Windows](https://windows.github.com/),
登录后会自动在本地配置好 SSH, 执行`git shell`时也不需要-config用户名和邮箱

新建仓库, Github Pages 的仓库名必须为`your_user_name.github.io`
your_user_name 替换成你的用户名

配置 SSH, 参考 [SSH配置教程](https://help.github.com/articles/generating-ssh-keys)

## Node.js

安装 [Node.js](http://nodejs.org/), Node 安装包里带有 npm

## Hexo

安装 Hexo
```bash
//2.x
npm install hexo -g

//3.x
npm install hexo-cli -g
npm install hexo --save
```

查看 Node 版本

```bash
node -v
```

查看 Hexo 版本
```bash
hexo version
```

创建项目
```bash
hexo init hexo-lcx
```

进入目录
```bash
cd hexo-lcx
```

也可以先建文件夹再进目录初始化
```bash
cd hexo-lcx
hexo init
```


安装依赖包
```bash
//2.x
npm install

// 3.x
npm install
// generators
npm install hexo-generator-index --save
npm install hexo-generator-archive --save
npm install hexo-generator-category --save
npm install hexo-generator-tag --save
// server
npm install hexo-server --save
// deployers
npm install hexo-deployer-git --save
npm install hexo-deployer-heroku --save
npm install hexo-deployer-rsync --save
npm install hexo-deployer-openshift --save
// plugins
npm install hexo-renderer-marked@0.2 --save
npm install hexo-renderer-stylus@0.2 --save
npm install hexo-generator-feed@1 --save
npm install hexo-generator-sitemap@1 --save
```

以后所有的命令都在该目录下进行

启动服务
```bash
hexo server
```

用浏览器打开 `http://localhost:4000/` 或者 `http://127.0.0.1:4000/` 就能看到网页了
推荐使用现代化浏览器(Chrome)获得最佳效果

按 `Ctrl+C` 停止本地预览服务

# 使用

## 目录结构
```bash
.
├── .deploy       #需要部署的文件
├── node_modules  #Hexo插件
├── public        #生成的静态网页文件
├── scaffolds     #模板
├── source        #博客正文和其他源文件, 404 favicon CNAME 等都应该放在这里
|   ├── _drafts   #草稿
|   └── _posts    #文章
├── themes        #主题
├── _config.yml   #全局配置文件
└── package.json
```
## 全局配置 _config.yml

**配置文件的冒号”:”后面有空格**

```bash
# Site #站点信息
title: lmintlcx #标题
subtitle: 做人不卖萌跟咸鱼有什么区别 #副标题
description: lmintlcx lm lcx blog #描述
author: lmintlcx #作者
language: zh-Hans #语言
timezone: Asia/Shanghai #时区

# URL #链接格式
url: http://blog.lmintlcx.com #网址
root: / #根目录
permalink: post/:title.html #文章的链接格式
permalinkdefaults:

# Directory #目录
sourcedir: source #源文件
publicdir: public #生成的网页文件
tagdir: tags #标签
archivedir: archives #归档
categorydir: categories #分类
codedir: downloads/code
i18ndir: :lang #国际化
skiprender:

# Writing #写作
newpostname: :title.md #新文章标题
defaultlayout: post #默认模板(post page photo draft)
titlecase: false #标题转换成大写
externallink: true #新标签页里打开连接
filenamecase: 0
renderdrafts: false
postassetfolder: false
relativelink: false
future: true
highlight: #语法高亮
  enable: true
  linenumber: false #显示行号
  autodetect: true
  tabreplace:

# Category & Tag #分类和标签
defaultcategory: uncategorized #默认分类
categorymap:
tagmap:

# Date / Time format #日期时间格式
## http://momentjs.com/docs/#/displaying/format/
dateformat: YYYY-MM-DD
timeformat: HH:mm:ss

# Pagination #分页
per_page: 20 #每页文章数, 设置成 0 禁用分页
paginationdir: page

# Extensions #插件和主题
## 插件: http://hexo.io/plugins/
## 主题: http://hexo.io/themes/
theme: next

# Deployment #部署, lmintlcx是我的用户名, 同时发布在 GitHub 和 GitCafe 上面
deploy:
  type: git
  repo: 
    github: https://github.com/lmintlcx/lmintlcx.github.io.git,master
    gitcafe: https://gitcafe.com/lmintlcx/lmintlcx.git,gitcafe-pages

# Disqus #Disqus评论系统
disqusshortname: 

plugins: #插件，例如生成 RSS 和站点地图的
- hexo-generator-feed
- hexo-generator-sitemap
```

## 命令行使用

常用命令:
```bash
hexo help #查看帮助
hexo init #初始化一个目录
hexo new "postName" #新建文章
hexo new page "pageName" #新建页面
hexo generate #生成网页, 可以在 public 目录查看整个网站的文件
hexo server #本地预览, 'Ctrl+C'关闭
hexo deploy #部署.deploy目录
hexo clean #清除缓存, 强烈建议每次执行命令前先清理缓存, 每次部署前先删除 .deploy 文件夹
```

复合命令:
```bash
hexo deploy -g #生成加部署
hexo server -g #生成加预览
```

简写：
```bash
hexo n == hexo new
hexo g == hexo generate
hexo s == hexo server
hexo d == hexo deploy
```

安装插件, `&lt;plugin-name&gt;` 为插件名
```bash
npm install <plugin-name> --save #安装
npm update #升级
npm uninstall <plugin-name> #卸载
```

安装主题, `&lt;repository&gt;` 为主题的 git 仓库, `&lt;theme-name&gt;`为要存放在本地的目录名
```bash
git clone <repository> themes/<theme-name>
```

修改网站配置文件
```bash
theme: <theme-name>
```

## 编辑文章

新建文章
```bash
hexo new "标题"
```

在 _posts 目录下会生成文件 `标题.md`

```
title: 标题
date: 2014-11-11 11:11:11
tags:
- 标签1
- 标签2
- 标签3
categories: [分类1,分类2,分类3]
---
正文, 使用 Markdown 语法书写
```

编辑完后保存, hexo server 预览

##发布

以发布到 Github 为例

编辑全局配置文件 _config.yml 中的 deploy 部分, `lmintlcx`为用户名
```
deploy:
  type: github
  repo: https://github.com/lmintlcx/lmintlcx.github.io.git
  branch: master
```

或者
```
deploy:
  type: github
  repository: git@github.com:lmintlcx/lmintlcx.github.com.git
  branch: master
```

**项目主页需要把 branch 设置为 gh-pages **

托管到 Gitcafe 的话修改为
```
deploy:
  type: github
  repository: git@gitcafe.com:lmintlcx/lmintlcx.git
  branch: gitcafe-pages
```
部署
```bash
hexo deploy
```

以下提示说明部署成功
```
[info] Deploy done: github
```

点击 Github 上项目的 Settings, GitHub Pages, 提示 `Your site is published at http://lmintlcx.github.io/`
第一次上传网站需要等十分钟左右, 以后每次更新都能马上打开

## 绑定域名

不绑定域名的话只能通过 `your_user_name.github.io` 访问
申请域名推荐 [GoDaddy](https://www.godaddy.com/), 域名解析推荐 [DNSPod](https://www.dnspod.cn/Domain)

### 绑定顶级域名

新建文件 CNAME, 无后缀, 纯文本文件, 内容为要绑定的域名 `lmintlcx.com`
如果要使用 `www.lmintlcx.com` 的形式, 文件内容改为 `www.lmintlcx.com`

DNS设置
主机记录`@`, 类型`A`, 记录值`192.30.252.153`
主机记录`www`, 类型`A`, 记录值`192.30.252.153`
参考 [Tips for configuring an A record with your DNS provider](https://help.github.com/articles/tips-for-configuring-an-a-record-with-your-dns-provider)

### 绑定子域名

比如使用域名`lmintlcx.com`的子域名`blog.lmintlcx.com`
CNAME文件内容为`blog.lmintlcx.com`

DNS设置
主机记录`blog`, 类型`CNAME`, 记录值`lmintlcx.github.io`
参考 [Tips for configuring a CNAME record with your DNS provider](https://help.github.com/articles/tips-for-configuring-a-cname-record-with-your-dns-provider)

### Gitcafe 绑定域名

项目管理界面, 左侧的导航栏中有自定义域名设置

# 主题

Hexo 的 [主题列表](https://github.com/hexojs/hexo/wiki/Themes)

NexT 主题的诞生:
[https://www.v2ex.com/t/165661](https://www.v2ex.com/t/165661)

文档:
[http://theme-next.iissnan.com/theme-settings.html](http://theme-next.iissnan.com/theme-settings.html)

代码:
[https://github.com/iissnan/hexo-theme-next](https://github.com/iissnan/hexo-theme-next)

## 下载安装主题
```bash
cd hexo-lcx
git clone https://github.com/iissnan/hexo-theme-next themes/next
```

也可以手动下载后解压到 themes 目录

全局配置文件 _config.yml 中 theme 改成 next

## 主题目录结构
```
.
├── languages          #国际化
|   ├── default.yml    #默认
|   └── zh-CN.yml      #中文
├── layout             #布局
|   ├── _partial       #局部的布局
|   └── _widget        #小挂件的布局
├── script             #js脚本
├── source             #源代码文件
|   ├── css            #CSS
|   |   ├── _base      #基础CSS
|   |   ├── _partial   #局部CSS
|   |   ├── fonts      #字体
|   |   ├── images     #图片
|   |   └── style.styl #style.css
|   ├── fancybox       #fancybox
|   └── js             #js
├── _config.yml        #主题配置文件
└── README.md          #主题介绍
```

## 主题配置文件

以下是主题  [NexT](https://github.com/iissnan/hexo-theme-next) 的配置文件
```
menu: #菜单
  home: / #首页
  archives: /archives #归档
  about: /about #关于
  #commonweal: /404.html #公益404
  #tags: /tags #标签
  #categories: /categories #分类

# 小图标
favicon: /favicon.ico

# 默认关键词
keywords: "-^"

# 留空使用默认的, false 禁用, 也可以写指定的地址
rss:

# Icon fonts
# default | linecons | fifty-shades | feather
iconfont: default

# 代码高亮主题 https://github.com/chriskempson/tomorrow-theme
# normal | night | night eighties | night blue | night bright
highlighttheme: normal

# MathJax Support #数学公式
mathjax: true

# Schemes #启用主题中的主题Mist
scheme: Mist

# 侧边栏
#  - post    只在文章页面显示
#  - always  所有页面显示
#  - hide    隐藏
sidebar: always

# 自动滚动到"阅读更多"标记的下面
scrolltomore: true

# 自动给目录添加序号
toclistnumber: true

# 自动截取摘要
autoexcerpt:
  enable: false
  length: 150

# Lato 字体
usefontlato: true

# Make duoshuo show UA
# userid must NOT be null when adminenable is true!
# you can visit http://dev.duoshuo.com get duoshuo user id.
duoshuoinfo:
  uaenable: true
  adminenable: false
  userid: 0
  #adminnickname: ROOT

## DO NOT EDIT THE FOLLOWING SETTINGS
## UNLESS YOU KNOW WHAT YOU ARE DOING

# 动画
usemotion: true

# Fancybox 看图插件
fancybox: true

# Static files
vendors: vendors
css: css
js: js
images: images

# Theme version
version: 0.4.5.1
```

## 选择 Scheme
```
scheme: Mist
```

## 添加小图标favicon.ico

将 favicon.ico 文件放在 source 目录下, 修改主题配置文件
```
favicon: /favicon.ico
```

## 语言设置

可用的语言及代码

*   English (en)
*   中文简体 (zh-Hans)
*   French (fr-FR)
*   正体中文 (zh-hk/zh-tw)
*   Russian (ru)
*   German (de)

站点配置文件
```
language: zh-hk
```

## 菜单设置

编辑主题配置文件的 menu
若站点运行在子目录中, 将链接前缀的 `/` 去掉
```
menu:
  home: /
  archives: /archives
  categories: /categories
  tags: /tags
  commonweal: /404.html
  about: /about
```

## 标签云页面

添加一个标签云页面, 并在菜单中显示页面链接

新建 `tags` 页面

hexo new page “tags”

将页面的类型设置为 `tags`
```
title: tags
date: 2015-09-19 22:37:08
type: "tags"
---
```

关闭评论
```
title: tags
date: 2015-09-19 22:37:08
type: "tags"
comments: false
---
```

在菜单中添加链接. 编辑主题配置文件, 添加 `tags` 到 `menu` 中
```
menu:
  tags: /tags
```

## 分类页面

添加一个分类页面, 并在菜单中显示页面链接

新建 `categories` 页面

hexo new page categories

将页面的类型设置为 `categories`
```
title: categories
date: 2015-09-19 22:38:00
type: "categories"
---
```

关闭评论
```
title: categories
date: 2015-09-19 22:38:00
type: "categories"
comments: false
---
```

在菜单中添加链接. 编辑主题配置文件, 添加 `categories` 到 `menu` 中
```
menu:
  categories: /categories
```

## RSS 链接

编辑主题配置文件 `rss` 字段

rss: false
禁用Feed链接

rss:
默认使用站点的 Feed 链接, 需要安装 hexo-generator-feed 插件
浏览`http://localhost:4000/atom.xml`查看是否生效

rss: [http://your-feed-url](http://your-feed-url)
指定特定的链接地址, 适用于已经烧制过 Feed 的情形

## 代码高亮主题

NexT 使用 [Tomorrow Theme](https://github.com/chriskempson/tomorrow-theme) 作为代码高亮, 共有5款主题

## 站点建立时间

例如 `© 2014 - 2015`

站点配置文件新增字段 `since`
```
since: 2014
```

## 数学公式显示

NexT 使用 MathJax 来显示数学公式, 默认关闭

主题配置文件 `mathjax` 设定为 `true`
```
# MathJax Support
mathjax: true
```

访问过慢可替换为其他CDN, 修改文件
`themes\next\layout\_scripts\mathjax.swig`
```
<script type="text/javascript" src="http://cdn.bootcss.com/mathjax/2.5.3/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
```

## 侧栏设置

post - 默认行为, 在文章页面(拥有目录列表)时显示
always - 在所有页面中都显示
hide - 在所有页面中都隐藏(可以手动展开)

```
sidebar: post
```

## 头像设置

编辑站点配置文件, 新增字段 `avatar`, 头像的链接地址可以是:

*   网络地址
[https://avatars2.githubusercontent.com/u/4962914?v=3&amp;s=460](https://avatars2.githubusercontent.com/u/4962914?v=3&amp;s=460)

*   站点内的地址
/uploads/avatar.jpg //头像图片放置在站点的 source/uploads/
/images/avatar.jpg //头像图片放置在主题的 source/images/
```
avatar: /images/lmintlcx_avatar.png
```

## 作者名称

编辑站点配置文件 `author`

## 站点描述设置

编辑站点配置文件 `description`

## 侧边栏社交链接

站点配置文件新增字段 `social`, 然后添加社交站点名称与地址
```
# Social links
social:
  GitHub: https://github.com/lmintlcx
  Twitter: https://twitter.com/lmintlcx
  Zhihu: http://www.zhihu.com/people/lmintlcx
  Douban: http://www.douban.com/people/lmintlcx
  #Weibo: http://weibo.com/lmlcx
```

## 自定义页面

以关于页面为例
新建一个 `about` 页面
```bash
hexo new page "about"
```

编辑 source/about/index.md：
```
title: About
date: 2014-11-1 11:11:11
---
About Me
```

菜单显示 about 链接, 主题配置文件中将 `menu` 中 `about` 前面的注释去掉
```
menu:
  about: /about
```

## 友情链接

站点配置文件添加
```
# 标题
links_title: 友情链接
# 链接
links:
  Hexo: http://hexo.io/
  Lmintlcx: http://blog.lmintlcx.com/
```

## Sitemap 网站地图

安装插件
```
npm install hexo-generator-sitemap
```

站点配置文件里开启插件
```
plugins:
- hexo-generator-sitemap
```

浏览`http://localhost:4000/sitemap.xml`查看是否生效

## 腾讯公益 404 页面

效果 [http://blog.lmintlcx.com/404.html](http://blog.lmintlcx.com/404.html)

source 目录下新建 404.html 页面
```html
<!DOCTYPE HTML>
<html>
<head>
  <meta http-equiv="content-type" content="text/html;charset=utf-8;"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <meta name="robots" content="all" />
  <meta name="robots" content="index,follow"/>
</head>
<body>

<script type="text/javascript" src="http://www.qq.com/404/search_children.js" charset="utf-8" homePageUrl="your-site-url" homePageName="回到我的主页"></script>

</body>
</html>
```

## 文章摘录

NexT 支持三种方式来控制首页文章的显示方式

*   在文章中使用 `&lt;!-- more --&gt;` 手动进行截断
*   在文章的 front-matter 中添加 `description`, 内容为文章摘要
*   自动形成摘要, 在主题配置文件中添加
```
auto_excerpt:
  enable: true
  length: 150 #默认截取的长度为 150 字符
```

## 设定首页/归档/标签页面文章的篇数

安装以下插件
```bash
hexo-generator-index
hexo-generator-archive
hexo-generator-tag
```

站点配置文章中设定
```
indexgenerator:
  perpage: 5

archivegenerator:
  perpage: 20
  yearly: true
  monthly: true

taggenerator:
  perpage: 10
```

## 自定义字体

编辑主题 `source/css/_variables/custom.styl` 文件, 例如
```
$font-family-headings = Georgia, sans
$font-family-base = "Microsoft YaHei", Verdana, sans-serif
```

## 自定义页面内容区域的宽度

编辑主题 `source/css/_variables/custom.styl` 文件
```
$content-desktop = 700px
```

# 优化

## 多说评论系统
> 如需取消某个页面/文章的评论, 在 md 文件的 `front-matter` 中增加 `comments: false`

登陆多说创建站点, 多说域名 `xxx.duoshuo.com` 前面的 `xxx` 即为 `duoshuo_shortname`, 在站点配置文件中新增 `duoshuo_shortname` 字段
```
duoshuo_shortname: xxx
```

多说评论组件提供[热评文章](http://xirong.duoshuo.com/admin/tools/top-threads/)功能, 仅在文章页面显示

站点/主题配置文件中设置
```
# 多说热评文章 true 或者 false
duoshuo_hotartical: true
```

## Disqus

在 [Disqus官网](http://disqus.com/) 申请新网站的 shortname
站点配置文件, 添加 `disqus_shortname`
```
disqus_shortname: xxxxxxxx
```

## 设置网站统计

### 百度统计

登录 [百度统计](http://tongji.baidu.com/web/welcome/login), 定位到站点的代码获取页面
复制 `hm.js?` 后面那串统计脚本 id
编辑站点配置文件, 新增字段 `baidu_analytics` 字段
```
baidu_analytics: xxxxxxxxxxxxxxxx
```
### Google Analytics

从 [Google Analytics](http://www.google.com/analytics/) 获取 ID
站点配置文件新增 `google_analytics`, 设置成 Google 跟踪 ID. 通常是以 UA- 开头
```
google_analytics: UA-xxxxxxxx-x
```

## 分享

分享服务优先选择 [JiaThis](http://www.jiathis.com/)

### JiaThis

站点/主题配置文件添加字段 `jiathis`, 值为 `true`
```
# JiaThis 分享服务
jiathis: true
```

### 百度分享

站点/主题配置文件添加字段 `baidushare`, 值为 `true`

```
# 百度分享服务
baidushare: true
```

### 多说分享

站点/主题配置文件添加字段  `duoshuo_share`, 值为 `true`, 多说分享必须与多说评论同时使用
```
# 多说分享服务
duoshuo_share: true
```

## Swiftype 搜索

站点配置文件新增 `swiftype_key` 字段, 值为 [swiftype](https://swiftype.com/) 搜索引擎的 key
```
# Swiftype Search Key
swiftype_key: xxxxxxxxx
```

## Google Webmaster tools

设置 Google 站点管理工具的验证字符串, 用于提交 sitemap

*   获取 google site verification code
登录 [Google Webmaster Tools](https://www.google.com/webmasters/tools/), 导航到验证方法, 并选择 `HTML 标签`, 将会获取到一段代码:
```html
<meta name="google-site-verification" content="XXXXXXXXXXXXXXXXXXXXXXX" />
```

*   将 content 里面的 XXXXXXXXXXXXXXXXXXXXXXX 复制出来, 站点配置文件新增字段 `google_site_verification`

```
googlesiteverification: XXXXXXXXXXXXXXXXXXXXXXX
```

## 版权

参见 [知识共享许可协议](https://zh.wikipedia.org/wiki/%E5%89%B5%E4%BD%9C%E5%85%B1%E7%94%A8%E6%8E%88%E6%AC%8A%E6%A2%9D%E6%AC%BE)
站点配置文件新增
```
# Creative Commons 4.0 International License.
# http://creativecommons.org/
# Available: by | by-nc | by-nc-nd | by-nc-sa | by-nd | by-sa | zero
creative_commons: by-nc-sa
```

## 图片显示

把图片放到 source/images 目录下
```
![test](images/xxx.jpg)
```

推荐使用图床, 例如[七牛云存储](http://www.qiniu.com/)

## 自定义 404 页面

添加 source/404.html

404 页面不需要 Hexo 解析
```html
layout: false
--------
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>404</title>
    <link rel="icon" href="/favicon.ico">
  </head>
  <body>
    <div align="center">
      <p>404 你懂的</p>
    </div>
  </body>
</html>
```

## 添加 robots.txt

source 目录下添加 robots.txt
```
# robots.txt
User-agent: Baiduspider
Disallow: /
User-agent: Googlebot
Disallow:
```

## 生成 post 时默认生成 categories 配置项

在 scaffolds/post.md 中添加
```
categories:
```

## 添加 “fork me on github”

[官方教程](https://github.com/blog/273-github-ribbons)

## 点击加载评论

在 `themes\next\layout\_layout.swig` 里找到
```html
<div id="disqusthread">
<noscript>Please enable JavaScript to view the <a href="//disqus.com/?refnoscript">comments powered by Disqus.</a></noscript>
</div>
```

在上面添加
```html
<button id="load-disqus" onclick="disqus.load();" style="background-color: #ebebeb; color: #646464; font-size: 18px; padding: 8px 12px; border-radius: 5px; border: 1px solid #ebebeb;">点击查看评论</button>
```

修改文件
`themes\next\layout\_scripts\comments\disqus.swig`
```javascript
<script type="text/javascript">

var disqus = { //添加的内容
load : function disqus(){ //添加的内容

      var disqusshortname = '{{theme.disqusshortname}}';
      var disqusidentifier = '{{ page.path }}';
      var disqustitle = '{{ page.title }}';
      var disqusurl = '{{ page.permalink }}';
      function rundisqusscript(disqusscript){
        var dsq = document.createElement('script');
        dsq.type = 'text/javascript';
        dsq.async = true;
        dsq.src = '//' + disqusshortname + '.disqus.com/' + disqusscript;
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
      }
      rundisqusscript('count.js');
      {% if page.comments %}
        rundisqusscript('embed.js');
      {% endif %}

$('#load-disqus').remove(); //添加的内容
} //添加的内容
} //添加的内容

</script>
```

## 给 GitHub 添加 README

把 README.MD 文件的后缀名改成 `MDOWN`, 放到 source 文件夹下, 这样 Hexo 不会将其解析成网页, GitHub 也会作为 MD 文件解析

## 网站访问量统计

使用 [不蒜子](http://service.ibruce.info/) 提供的服务

安装脚本
```javascript
<script async src="https://dn-lbstatics.qbox.me/busuanzi/2.3/busuanzi.pure.mini.js"></script>
```

安装标签

算法a: pv的方式, 单个用户连续点击n篇文章, 记录n次访问量.
```html
<span id="busuanzicontainersitepv">
    本站总访问量<span id="busuanzivaluesitepv"></span>次
</span>
```

算法b: uv的方式, 单个用户连续点击n篇文章, 只记录1次访客数.
```html
<span id="busuanzicontainersiteuv">
  本站访客数<span id="busuanzivaluesiteuv"></span>人次
</span>
```

## 网站运行时间

脚本
```javascript
<script>
var birthDay = new Date("11/20/2014");
var now = new Date();
var duration = now.getTime() - birthDay.getTime(); 
var total= Math.floor(duration / (1000 * 60 * 60 * 24));
document.getElementById("showDays").innerHTML = "本站已运行 "+total+" 天";
</script>
```

标签
```html
<span id="showDays"></span>
```

## 简体中文/繁体中文切换

下载 [js文件](http://www.arao.me/js/tw_cn.js) 放到主题的 js 文件夹

添加标签
```html
<span id="showDays"></span>
```

添加脚本
```javascript
<script type="text/javascript" src="/js/tw_cn.js"></script>
<script type="text/javascript">
var defaultEncoding = 2; //网站编写字体是否繁体，1-繁体，2-简体
var translateDelay = 0; //延迟时间,若不在前, 要设定延迟翻译时间, 如100表示100ms,默认为0
var cookieDomain = "http://www.arao.me/"; //Cookie地址, 一定要设定, 通常为你的网址
var msgToTraditionalChinese = "繁體"; //此处可以更改为你想要显示的文字
var msgToSimplifiedChinese = "简体"; //同上，但两处均不建议更改
var translateButtonId = "translateLink"; //默认互换id
translateInitilization();
</script>
```

## Kill IE6
```html
<!--[if IE 6]>
  <script src="//letskillie6.googlecode.com/svn/trunk/2/zh_CN.js"></script>
<![endif]-->
```

## 迁移

参考官方文档 [Hexo Migration](http://zespia.tw/hexo/docs/migration.html)

* * *

20150825
主题从 Landscape-plus 改为 Yilia;
增加 Hexo 3.0 的相关内容.

20150919
主题改为 NexT.Mist.
主题配置的相关内容都改成 NexT.Mist.
标点符号优化.

-EOF-