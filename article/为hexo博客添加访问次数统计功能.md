title: 为hexo博客添加访问次数统计功能
tags:
  - hexo
  - javascript
  - default
date: 2015-04-10 15:30:12
---

> 最新的统计服务已经开放，两行代码轻松搞定，你可以直接使用：[不蒜子](http://ibruce.info/2015/04/04/busuanzi) 微服务。

# 方法一：自搭服务

hexo是静态博客，虽有速度快的优点，但无法存储动态数据是不可否认的劣势之一。没有出路就要思考出路，没人阻止你借助第三方系统实现动态数据处理，比如评论功能借助[Disqus](http://disqus.com)或[多说](http://duoshuo.com)。统计功能也可以这样处理，我们借助[BAE](http://developer.baidu.com/bae)或[SAE](http://sae.sina.com.cn)平台搭建自己的统计服务。

> [SAE](http://sae.sina.com.cn)已经提供[Counter](http://sae.sina.com.cn/?m=devcenter&amp;catId=194)服务，但是貌似只支持php语言，这里是[SAE计数器服务示例](http://static.sae.sina.com.cn/flash/video/counter)。在[BAE2.0](http://developer.baidu.com/wiki/index.php?title=docs/cplat/rt "docs/cplat/rt")中也有专门的[Counter（计数器）](http://developer.baidu.com/wiki/index.php?title=docs/cplat/rt/counter "docs/cplat/rt/counter")服务，但是BAE3.0中尚未提供，应该是还未迁移过来。
<a id="more"></a>

这里以新版[BAE](http://developer.baidu.com/cloud/rt)，即[BAE3.0](http://developer.baidu.com/wiki/index.php?title=docs/cplat/bae "docs/cplat/bae")为例介绍整个流程。难度不大，只简单说下。

### 创建bae应用

到[管理控制台](http://developer.baidu.com/console)，点击『创建应用』，创建你的应用。请参考[新手入门](http://developer.baidu.com/wiki/index.php?title=docs/cplat/bae/start "docs/cplat/bae/start")。

### 添加Redis服务

点击刚刚创建的应用，进入应用『基本信息』页面，点击『应用引擎』-『扩展服务』-『扩展新服务』-『Redis』，填写基本信息即可。请参考[Redis（数据库）](http://developer.baidu.com/wiki/index.php?title=docs/cplat/bae/redis "docs/cplat/bae/redis")。

> 也可以使用MySQL或MongoDB服务，我选择Redis的原因之一是其有原子自增操作incr。

### jsonp跨域访问

以本文为例，hexo博客地址为[http://ibruce.info](http://ibruce.info)，而bae应用地址为[http://lbservice.duapp.com](http://lbservice.duapp.com)。两个不同的域之间，是不能直接访问数据的，此时就要借助[jsonp](http://baike.baidu.com/view/2131174.htm)，请参考[JQuery中利用JSONP解决AJAX跨域问题](http://www.clanfei.com/2012/08/1637.html)和[JQuery+AJAX+JSONP跨域访问](http://www.iteye.com/topic/1130452)。

### 修改hexo页面

打开footer.ejs编辑，增加代码。
<figure class="highlight html"><table><tr><td class="code"><pre><span class="line"><span class="tag">&lt;<span class="title">font</span> <span class="attribute">id</span>=<span class="value">"counter"</span>&gt;</span></span>
<span class="line">    本站共到访 <span class="tag">&lt;<span class="title">font</span> <span class="attribute">id</span>=<span class="value">"counterValue"</span> <span class="attribute">style</span>=<span class="value">"color:white"</span>&gt;</span>?<span class="tag">&lt;/<span class="title">font</span>&gt;</span> 次</span>
<span class="line"><span class="tag">&lt;/<span class="title">font</span>&gt;</span></span>
</pre></td></tr></table></figure>

<figure class="highlight javascript"><table><tr><td class="code"><pre><span class="line">&lt;script type=<span class="string">"text/javascript"</span>&gt;</span>
<span class="line">$(<span class="function"><span class="keyword">function</span><span class="params">()</span></span>&#123;</span>
<span class="line">    $.ajax(&#123;</span>
<span class="line">        type     : <span class="string">"GET"</span>,</span>
<span class="line">        url      : <span class="string">'http://lbservice.duapp.com/xxx'</span>,</span>
<span class="line">        dataType : <span class="string">"jsonp"</span>,</span>
<span class="line">        jsonp    : <span class="string">"jsonpCallback"</span>,</span>
<span class="line">        success  : <span class="function"><span class="keyword">function</span><span class="params">(data)</span> </span>&#123;</span>
<span class="line">                    $(<span class="string">"#counterValue"</span>).text(data);</span>
<span class="line">                   &#125;,</span>
<span class="line">        error    : <span class="function"><span class="keyword">function</span><span class="params">()</span> </span>&#123; </span>
<span class="line">                    $(<span class="string">"#counter"</span>).html(<span class="string">""</span>); </span>
<span class="line">                   &#125;</span>
<span class="line">    &#125;);</span>
<span class="line">&#125;);</span>
<span class="line"><span class="xml"><span class="tag">&lt;/<span class="title">script</span>&gt;</span></span></span>
</pre></td></tr></table></figure>

### 修改应用代码

进入应用『基本信息』页面，点击『应用引擎』-『点击复制』SVN/GIT地址，获取源码到你喜欢的工具。
添加必要的Redis代码，关键内容如下。
<figure class="highlight java"><table><tr><td class="code"><pre><span class="line"><span class="comment">// 配置相关信息</span></span>
<span class="line"><span class="keyword">final</span> String databaseName = <span class="string">"yBeHeL"</span>;</span>
<span class="line"><span class="keyword">final</span> String host = <span class="string">"redis.duapp.com"</span>;</span>
<span class="line"><span class="keyword">final</span> <span class="keyword">int</span> port = <span class="number">80</span>;</span>
<span class="line"><span class="keyword">final</span> String username = <span class="string">"8TAbwkckuyxq"</span>;<span class="comment">// 用户名(api key);</span></span>
<span class="line"><span class="keyword">final</span> String password = <span class="string">"HszPIhnaG9d"</span>;<span class="comment">// 密码(secret key)</span></span>
<span class="line"><span class="comment">// 创建连接</span></span>
<span class="line">Jedis jedis = <span class="keyword">new</span> Jedis(host, port);</span>
<span class="line">jedis.connect();</span>
<span class="line">jedis.auth(username + <span class="string">"-"</span> + password + <span class="string">"-"</span> + databaseName);</span>
<span class="line"><span class="comment">// 操作数据库</span></span>
<span class="line">jedis.set(<span class="string">"ibruce.info"</span>, <span class="string">"0"</span>);</span>
<span class="line"><span class="keyword">long</span> counter = jedis.incr(<span class="string">"ibruce.info"</span>);</span>
<span class="line"></span>
<span class="line"><span class="comment">// 准备输出</span></span>
<span class="line">String jsonpCallback = request.getParameter(<span class="string">"jsonpCallback"</span>);</span>
<span class="line">PrintWriter out = response.getWriter();</span>
<span class="line">out.println(String.format(<span class="string">"try&#123;%s(%s);&#125;catch(e)&#123;&#125;"</span>, jsonpCallback, counter));</span>
<span class="line">out.flush();</span>
<span class="line">out.close();</span>
</pre></td></tr></table></figure>

### 部署bae和hexo

通过SVN/GIT提交代码部署bae应用，然后在同一页面点击『快捷发布』完成发布。通过hexo d -g命令部署hexo代码。

### 小结

本文目的并不仅是添加统计功能，而是想抛砖引玉，介绍一种添加动态数据的通用方法，其他类似的需求都可以如此处理。如果你想为自己的hexo博客添加访问次数统计功能，又觉得太麻烦，我可以在我的bae应用下帮你统计，有需要的请留言。

> 上文所述的这种方法已经废弃，现在有更高大上的做法了,参考 [hexo你的博客](http://ibruce.info/2013/11/22/hexo-your-blog) 补充部分。

# 方法二：使用firebase

在你的站点需要显示的位置添加标签：
<figure class="highlight xml"><table><tr><td class="code"><pre><span class="line"><span class="tag">&lt;<span class="title">font</span> <span class="attribute">id</span>=<span class="value">"counter"</span>&gt;</span><span class="tag">&lt;/<span class="title">font</span>&gt;</span></span>
</pre></td></tr></table></figure>

引入firebase：

<figure class="highlight xml"><table><tr><td class="code"><pre><span class="line"><span class="tag">&lt;<span class="title">script</span> <span class="attribute">src</span>=<span class="value">"//buru.u.qiniudn.com/firebase-2.0.5.js"</span>&gt;</span><span class="undefined"></span><span class="tag">&lt;/<span class="title">script</span>&gt;</span></span>
</pre></td></tr></table></figure>
> 你也可以添加firebase官网的链接，但我测试速度较慢。

引入计数：
<figure class="highlight xml"><table><tr><td class="code"><pre><span class="line"><span class="tag">&lt;<span class="title">script</span> <span class="attribute">src</span>=<span class="value">"//ibruce.info/js/counter.js"</span>&gt;</span><span class="undefined"></span><span class="tag">&lt;/<span class="title">script</span>&gt;</span></span>
</pre></td></tr></table></figure>

具体参考本人博客。

# 方法三：使用不蒜子

最新的统计服务，仅两行代码就搞定，你可以直接使用：[不蒜子](http://ibruce.info/2015/04/04/busuanzi)微服务，墙裂推荐。