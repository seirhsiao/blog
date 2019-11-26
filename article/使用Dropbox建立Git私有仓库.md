title: 使用Dropbox建立Git私有仓库
tags: []
date: 2014-01-06 17:48:58
---

无论是小型的团队或是个人都有协同开发的需要，[GitHub](http://github.com)上提供了仓库但是必须是public的，对于暂不公开的代码，或自己的小实验室，怎么玩呢？
用 [Dropbox](http://www.dropbox.com) 是个很好的选择，我之前是直接同步workspace，但是换台机器直接打开经常会报错。还是用 [Git](http://git-scm.com) 管理吧，满足个人多台机器工作，同时也满足多人协同办公。

> 本文主要介绍 [Dropbox](http://www.dropbox.com) 作为 [Git](http://git-scm.com/book/zh) 私有仓库。你也可以使用其它云存储工具，如 [SkyDrive](http://skydrive.live.com)， [Google Drive](http://drive.google.com)等，或国内的[金山快盘](http://www.kuaipan.cn/)，[百度云盘](http://pan.baidu.com)，[360云盘](http://yunpan.360.cn)。对于源代码这些重要资料，我强烈推荐大家使用国外的云产品，百度云曾经丢过我的文件，实在信不过，只作为电影备份盘。
<a id="more"></a>

### 环境准备

*   安装 [Git客户端](http://git-scm.com/book/zh/%E8%B5%B7%E6%AD%A5-%E5%AE%89%E8%A3%85-Git)*   [注册](https://db.tt/ALifTz8G)并安装 [Dropbox客户端](http://www.dropbox.com/downloading?src=index)

### 建立 Git Server

到你Dropbox中私有仓库的目标目录repository下，执行git init命令，注意加上bare参数，bare参数不会生成.git目录，而是把.git中的内容开放出来，你不会直接看到项目的源代码。
<figure class="highlight bash"><table><tr><td class="code"><pre><span class="line"><span class="built_in">cd</span> ~/Dropbox         <span class="comment">#切换到Dropbox目录</span></span>
<span class="line">nkdir repository     <span class="comment">#建立仓库根目录</span></span>
<span class="line"><span class="built_in">cd</span> repository        <span class="comment">#切换到仓库目录</span></span>
<span class="line">mkdir <span class="variable">$&#123;PROJECT&#125;</span>.git <span class="comment">#建立项目仓库，$&#123;PROJECT&#125;替换为你的项目名称</span></span>
<span class="line"><span class="built_in">cd</span> <span class="variable">$&#123;PROJECT&#125;</span>.git    <span class="comment">#切换到项目目录</span></span>
<span class="line">git init --bare      <span class="comment">#初始化为git repository，即git server端的资料</span></span>
</pre></td></tr></table></figure>

至此，仓库建立完毕。你可以使用eclipse连接git仓库，share你的project，进行代码开发。下面介绍通过命令行如何使用：

### 建立本地仓库
<figure class="highlight bash"><table><tr><td class="code"><pre><span class="line"><span class="built_in">cd</span> ~/workspace    <span class="comment">#切换到工作空间</span></span>
<span class="line">mkdir &#123;PROJECT&#125;   <span class="comment">#建立项目目录</span></span>
<span class="line"><span class="built_in">cd</span> <span class="variable">$&#123;PROJECT&#125;</span>     <span class="comment">#切换到项目目录</span></span>
<span class="line">git init          <span class="comment">#初始化</span></span>
</pre></td></tr></table></figure>

### 链接到Git Server
<figure class="highlight avrasm"><table><tr><td class="code"><pre><span class="line">git <span class="keyword">add</span></span>
<span class="line">touch READM.md</span>
<span class="line">git commit --all -m <span class="string">"Initial commit"</span></span>
<span class="line">git remote <span class="keyword">add</span> origin ~/Dropbox/repository/$&#123;PROJECT&#125;.git/</span>
<span class="line">git <span class="keyword">push</span> origin master</span>
</pre></td></tr></table></figure>

OK。提交本地代码，执行：
<figure class="highlight avrasm"><table><tr><td class="code"><pre><span class="line">git <span class="keyword">push</span> origin master</span>
</pre></td></tr></table></figure>

需要获取原创更新，执行：
<figure class="highlight nginx"><table><tr><td class="code"><pre><span class="line"><span class="title">git</span> pull origin master</span>
</pre></td></tr></table></figure>

另外，如果在push时中遇到如下错误，是因为Git默认http post的缓存为1M，具体可以[参考](http://blog.chengyunfeng.com/?p=488)。

> Error writing request body to server

# 参考文献

[把Dropbox改造为Git私有仓库](http://weizhifeng.net/git-with-dropbox.html)
[使用 Git + Dropbox + SourceTree 做 Source Code Management](http://kenlai.logdown.com/posts/52372--git-dropbox-sourcetree-source-code-management)
[使用 Dropbox 作为 Git 私有仓库](http://blog.jimu.in/?p=11)
[Git教學：Git的遠端操作及利用Dropbox建立Server進行協同開發(Windows)](http://www.mrmu.com.tw/2011/05/06/git-using-dropbox-as-server)
[远端仓库初始化成裸仓库 git init —bare](http://blog.csdn.net/feizxiang3/article/details/8065506)
[GIT初始化—bare参数：git init &amp; git init —bare](http://hi.baidu.com/aatfjctoytaefkr/item/00c693450a5b36af60d7b93f)
[什么叫做bare repo?](http://www.cnblogs.com/bamanzi/archive/2012/08/15/git-hg-bare-repo.html)