title: 通过 Spray 创建简单的 Restful Http Server
tags:
  - akka
  - sbt
  - spray
  - scala
date: 2014-04-15 15:53:56
---

好久没写文章，实在太忙。最近我在项目中，搭建了很多小的零散的 Restful 服务，各个服务之间通过rest接口调用，相互协作。

Java出身的码农，动辄就是Tomcat、Spring，RestEasy、Hibernate、JPA、Jackson、HttpClient… 这些巨无霸非常臃肿，其实我的项目就是一个简简单单的Rest服务，请求Json参数 → 调用资源接口 → 返回Json数据，还好有Spray！

使用Scala系的工具，无论是体重上（包的大小）还是身高上（代码的长度），都能极大的减负，同时提升逼格和优雅度。下面介绍一个简单的Restful Http Server的开发示例。

首先安装 [SBT](http://www.scala-sbt.org)（简单理解为scala下的maven），安装方法参考 [sbt documentation - setup](http://www.scala-sbt.org/release/docs/Getting-Started/Setup.html)。

win7环境下，直接下载 [0.13.1-zip包](http://repo.scala-sbt.org/scalasbt/sbt-native-packages/org/scala-sbt/sbt/0.13.1/sbt.zip) 解压到c:\sbt，配置SBT_HOME到path，cmd中敲入sbt检查有无成功，%SBT_HOME%\conf\sbtconfig.txt中可以配置启动参数。

<figure class="highlight haml"><table><tr><td class="code"><pre><span class="line"># Set the java args to high</span>
<span class="line">-<span class="ruby"><span class="constant">Xmx1024M</span></span>
<span class="line"></span>-<span class="ruby"><span class="constant">XX</span><span class="symbol">:MaxPermSize=</span><span class="number">512</span>m</span>
<span class="line"></span>-<span class="ruby"><span class="constant">XX</span><span class="symbol">:ReservedCodeCacheSize=</span><span class="number">256</span>m</span>
<span class="line"></span></span>
<span class="line"># Set the extra SBT options</span>
<span class="line">-<span class="ruby"><span class="constant">Dsbt</span>.log.format=<span class="keyword">true</span></span>
<span class="line"></span>-<span class="ruby"><span class="constant">Dfile</span>.encoding=<span class="constant">ISO</span>-<span class="number">8859</span>-<span class="number">1</span></span>
<span class="line"></span>-<span class="ruby"><span class="constant">Dsbt</span>.boot.directory=<span class="constant">H</span><span class="symbol">:/sbt/boot/</span> </span>
<span class="line"></span>-<span class="ruby"><span class="constant">Dsbt</span>.ivy.home=<span class="constant">H</span><span class="symbol">:/sbt/</span></span></span>
</pre></td></tr></table></figure>
<a id="more"></a>
> 1、-Dfile.encoding 配置成 ISO-8859-1 而不是 UTF-8，是因为在 cmd 下按键盘的上下键，无法切换历史输入的sbt命令，显示全是乱码，这让我很不爽，只好忍痛ISO啦。
> 2、-Dsbt.boot.directory 和 -Dsbt.ivy.home 是为将sbt自动下载的jar放到非系统盘，以免统一管理，这个看个人爱好。

下面跑一个官方的例子，从Spray的官方文档 [Getting Started](http://spray.io/introduction/getting-started) 上，找到 [spray-template](https://github.com/spray/spray-template)，在branch中下载1.3版的 [spray-can sample](http://github.com/spray/spray-template/tree/on_spray-can_1.3)。
解压，执行sbt命令。在浏览器运行 [http://127.0.0.1:8080](http://127.0.0.1:8080) 看结果。

<figure class="highlight applescript"><table><tr><td class="code"><pre><span class="line">sbt</span>
<span class="line">compile</span>
<span class="line"><span class="command">run</span></span>
</pre></td></tr></table></figure>
> build.sbt 已配置 Revolver.settings，可使用命令：re-start和re-stop，详细参考 [sbt-revolver](http://github.com/spray/sbt-revolver)。

瞄一下 [src/main/scala/com/example/MyService.scala](https://github.com/spray/spray-template/blob/on_spray-can_1.3/src/main/scala/com/example/MyService.scala)，可以看到只有简单的。
<figure class="highlight scala"><table><tr><td class="code"><pre><span class="line"><span class="class"><span class="keyword">trait</span> <span class="title">MyService</span> <span class="keyword"><span class="keyword">extends</span></span> <span class="title">HttpService</span> &#123;</span></span>
<span class="line">  <span class="function"><span class="keyword">val</span> <span class="title">myRoute</span> =</span></span>
<span class="line">    path(<span class="string">""</span>) &#123;</span>
<span class="line">      get &#123;</span>
<span class="line">        respondWithMediaType(`text/html`) &#123;</span>
<span class="line">          complete &#123;</span>
<span class="line">            &lt;html&gt;</span>
<span class="line">              &lt;body&gt;</span>
<span class="line">                &lt;h1&gt;<span class="type">Say</span> hello to &lt;i&gt;spray-routing&lt;/i&gt; on &lt;i&gt;spray-can&lt;/i&gt;!&lt;/h1&gt;</span>
<span class="line">              &lt;/body&gt;</span>
<span class="line">            &lt;/html&gt;</span>
<span class="line">          &#125;</span>
<span class="line">        &#125;</span>
<span class="line">      &#125;</span>
<span class="line">    &#125;</span>
<span class="line">&#125;</span>
</pre></td></tr></table></figure>

Boot方法启动一个Actor并绑定到8080端口。
<figure class="highlight scala"><table><tr><td class="code"><pre><span class="line"><span class="class"><span class="keyword">object</span> <span class="title">Boot</span> <span class="keyword"><span class="keyword">extends</span></span> <span class="title">App</span> &#123;</span></span>
<span class="line">  <span class="comment">// we need an ActorSystem to host our application in</span></span>
<span class="line">  <span class="keyword">implicit</span> <span class="function"><span class="keyword">val</span> <span class="title">system</span> =</span> <span class="type">ActorSystem</span>(<span class="string">"on-spray-can"</span>)</span>
<span class="line">  <span class="comment">// create and start our service actor</span></span>
<span class="line">  <span class="function"><span class="keyword">val</span> <span class="title">service</span> =</span> system.actorOf(<span class="type">Props</span>[<span class="type">MyServiceActor</span>], <span class="string">"demo-service"</span>)</span>
<span class="line">  <span class="keyword">implicit</span> <span class="function"><span class="keyword">val</span> <span class="title">timeout</span> =</span> <span class="type">Timeout</span>(<span class="number">5.</span>seconds)</span>
<span class="line">  <span class="comment">// start a new HTTP server on port 8080 with our service actor as the handler</span></span>
<span class="line">  <span class="type">IO</span>(<span class="type">Http</span>) ? <span class="type">Http</span>.<span class="type">Bind</span>(service, interface = <span class="string">"localhost"</span>, port = <span class="number">8080</span>)</span>
<span class="line">&#125;</span>
</pre></td></tr></table></figure>

在 [spray-servlet on jetty](http://github.com/spray/spray-template/tree/on_jetty_1.3) 分支下，有部署到servlet容器的工程模板代码。另外在 [Spray](http://github.com/spray/spray) 项目的源代码下，也有一些 [example](http://github.com/spray/spray/tree/master/examples)，找到 [spray-can/simple-http-server](http://github.com/spray/spray/tree/master/examples/spray-can/simple-http-server),也可以试着跑一下，其中的 [DemoService.scala](https://github.com/spray/spray/blob/master/examples/spray-can/simple-http-server/src/main/scala/spray/examples/DemoService.scala) 例子内容比较多。

> 更多玩法参考 [wiki example-projects](http://github.com/spray/spray/wiki/Example-Projects) 或 [document spray-can](http://spray.io/documentation/1.2.1/spray-can/)。

又要忙项目，推荐两个文章吧，自己写 spray 工程可以参考一下：[Building REST Service with Scala](http://sysgears.com/articles/building-rest-service-with-scala)、[API first REST in Akka and Spray](http://www.cakesolutions.net/teamblogs/2012/07/29/api-first-rest-in-akka-and-spray)、[stockman](https://github.com/mhamrah/stockman)。

<!-- 
参考文档
* [用 Spray 建立一個簡單的 RESTful API Server](http://swind.code-life.info/posts/build-restful-api-server-by-spray.html)
-->