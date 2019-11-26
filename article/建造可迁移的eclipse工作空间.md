title: 建造可迁移的eclipse工作空间
tags:
  - eclipse
  - green
  - java
date: 2013-12-18 10:01:40
---

为便于在各种机器和工作地点之间方便的迁移，我喜欢打造自己的绿色工作台，可谓有绿癖。
我的eclipse空间一般弄成如下目录结构（其它开发工具我也喜欢这么弄）：
<figure class="highlight r"><table><tr><td class="code"><pre><span class="line">.</span>
<span class="line">├── eclipse.bat                   <span class="comment">#一键启动</span></span>
<span class="line">├── workspace                     <span class="comment">#工作空间</span></span>
<span class="line">├── <span class="keyword">...</span>                           <span class="comment">#其他必要文件，如jdk，maven等</span></span>
<span class="line">└── eclipse-jee-kepler-SR1-win32  <span class="comment">#eclipse目录</span></span>
<span class="line">    └── eclipse.exe               <span class="comment">#eclipse启动文件</span></span>
</pre></td></tr></table></figure>

<a id="more"></a>

eclipse.bat采用相对路径启动eclipse.exe：
<figure class="highlight coffeescript"><table><tr><td class="code"><pre><span class="line"><span class="property">@echo</span> <span class="literal">off</span></span>
<span class="line">start ./eclipse-jee-kepler-SR1-win32/eclipse.exe</span>
</pre></td></tr></table></figure>

eclipse的workspace也要设置成相对路径：
<figure class="highlight mel"><table><tr><td class="code"><pre><span class="line">./<span class="keyword">workspace</span></span>
</pre></td></tr></table></figure>

![相对路径](http://bruce.u.qiniudn.com/2013/12/16/eclipse-workspace-relative-path.jpg)

> win7下『_./_』代表当前目录，『_../_』代表当前目录父目录，『_/_』代表盘符根目录。