title: 微服务框架 Colossus
tags:
  - actor
  - akka
  - microservice
  - scala
date: 2014-12-04 16:20:47
---

> 一直认为 Akka 是 JVM 上实现微服务框架的最理想基础设施，现在 Colossus 终于来了！

Tumblr 开源了其用 Scala 实现的微服务框架 Colossus。Colossus 是轻量级的 Scala 微服务 I/O 框架，基于 Akka Actor 实现，项目地址请戳 [http://github.com/tumblr/colossus](http://github.com/tumblr/colossus)。

<a id="more"></a>

Tumblr 面临的最大问题之一是如何架设及扩展不断持续增长的服务平台。这是病得治，微服务架构是药。它将小而专的应用封装成一个特性或组件，抛弃之前那种一个独立的大应用包含整站逻辑的做法。

微服务框架提供清晰的职责分离，有助于促进建造良好的基础设施，更容易排查缺陷和性能瓶颈。微服务有如此多的优点，但同样也面临挑战，如微服务要易于构建、维护、部署和监控，最重要的是他们需要极高的性能和容错性。单个服务每秒必须响应数万或数十万请求，并且有严格的延迟时间和正常运行时间要求。

Colossus 是 Tumblr 用来解决如上问题的新框架。他提供一个轻量级、简单的模型，来创建高性能的微服务。他用 scala 实现，基于 NIO 和 Akka Actor。该框架对 Tumblr 内部的服务搭建产生了极大的影响。

微服务在 Tumblr 不是新鲜事物，过去旧的框架很难写出服务高性能、高稳定性、高可用的服务。构建一个服务，只有少数几个具有领域知识的工程师才能高效完成的。Colossus 的出现改变了这一局面，使得更容易开发快速的容错服务，大大降低了准入门槛。

Colossus 主要有两个目标： 

### 性能

目前，最重要的目标就是 Colossus 的程序应该至少与直接使用NIO（不使用任何框架）写的程序一样快。Colossus 是设计用来封装那些直接使用 NIO 服务的 I/O 层，目前的已有框架都有性能问题。因此，我们要重新打造一个无损性能的框架。

微服务架构用来并发处理来自各种客户端大量无状态小请求。Reactor 模型是一种实现方案，他使用单线程的事件循环去处理多元的客户端 TCP 连接。Colossus 提供一个干净的此种模型的实现，保证尽可能少的开销。在很多情况下，并发的代码不容易写，实际上使用Futures 和 Akka actors 是简单高效的，他是真正的并行。

这种混合 Actor/Reactor 模型保证了所需的性能。我们基准测试达到了数百万QPS，一些生产系统已经处理数千亿的请求，其中 99.99% 延迟都在5毫秒以内。

### 简单

Colossus 的另一个目标是小而聚焦，低的准入门槛。简单包含两个方面：框架自身简单和框架用起来简单。

框架自身简单指的是 Colossus 只聚焦于微服务。为此 Colossus 的核心是一个广义的 NIO 包装，我们的大部分工作都在微服务用例，来保证代码的小而简单直接。

框架用起来简单指的是API层面，这主要用到 Scala 语言的优势。Scala 的最大优点是极具表现力的代码和设计简单的DSL。此外，因为scala重视类型安全性和函数式编程，我们确保 Colossus 尽量集成这些优点。这导致程序猿写应用更简单，更聚焦于业务逻辑而不是代码自身。

这些原则使得 Colossus 变成 Tumblr 基础设施的基本组成部分，并使 Tumblr 走向一个更加面向服务的体系结构。 Colossus 已经大大改善了 Tumblr 内部构造服务的方式，在生产系统系统中取得巨大的成功。

<figure class="highlight"><table><tr><td class="code"><pre><span class="line">libraryDependencies += &#34;com.tumblr&#34; % &#34;colossus_2.11&#34; % &#34;0.5.1-M1&#34;</span>
</pre></td></tr></table></figure>

a little http server

<figure class="highlight scala"><table><tr><td class="code"><pre><span class="line"><span class="keyword">import</span> colossus._</span>
<span class="line"><span class="keyword">import</span> service._</span>
<span class="line"><span class="keyword">import</span> protocols.http._</span>
<span class="line"><span class="keyword">import</span> <span class="type">UrlParsing</span>._</span>
<span class="line"><span class="keyword">import</span> <span class="type">HttpMethod</span>._</span>
<span class="line"></span>
<span class="line"><span class="class"><span class="keyword">object</span> <span class="title">Main</span> <span class="keyword"><span class="keyword">extends</span></span> <span class="title">App</span> &#123;</span></span>
<span class="line">  </span>
<span class="line">  <span class="keyword">implicit</span> <span class="function"><span class="keyword">val</span> <span class="title">io_system</span> =</span> <span class="type">IOSystem</span>()</span>
<span class="line"></span>
<span class="line">  <span class="type">Service</span>.become[<span class="type">Http</span>](<span class="string">"http-echo"</span>, <span class="number">9000</span>)&#123;</span>
<span class="line">    <span class="keyword">case</span> request @ <span class="type">Get</span> on <span class="type">Root</span> =&gt; request.ok(<span class="string">"Hello world!"</span>)</span>
<span class="line">    <span class="keyword">case</span> request @ <span class="type">Get</span> on <span class="type">Root</span> / <span class="string">"echo"</span> / str =&gt; request.ok(str)</span>
<span class="line">  &#125;</span>
<span class="line">&#125;</span>
</pre></td></tr></table></figure>

KeyValExample

<figure class="highlight scala"><table><tr><td class="code"><pre><span class="line"><span class="class"><span class="keyword">class</span> <span class="title">KeyValDB</span> <span class="keyword"><span class="keyword">extends</span></span> <span class="title">Actor</span> &#123;</span></span>
<span class="line"></span>
<span class="line">  <span class="keyword">import</span> <span class="type">KeyValDB</span>._</span>
<span class="line"></span>
<span class="line">  <span class="function"><span class="keyword">val</span> <span class="title">db</span> =</span> collection.mutable.<span class="type">Map</span>[<span class="type">ByteString</span>, <span class="type">ByteString</span>]()</span>
<span class="line"></span>
<span class="line">  <span class="function"><span class="keyword">def</span> <span class="title">receive</span> =</span> &#123;</span>
<span class="line">    <span class="keyword">case</span> <span class="type">Get</span>(key, promise) =&gt; promise.success(db.get(key))</span>
<span class="line">    <span class="keyword">case</span> <span class="type">Set</span>(key, value, promise) =&gt; &#123;</span>
<span class="line">      db(key) = value</span>
<span class="line">      promise.success(())</span>
<span class="line">    &#125;</span>
<span class="line">  &#125;</span>
<span class="line">&#125;</span>
<span class="line"></span>
<span class="line"><span class="class"><span class="keyword">object</span> <span class="title">KeyValDB</span> &#123;</span></span>
<span class="line">  <span class="keyword">case</span> <span class="class"><span class="keyword">class</span> <span class="title">Get</span>(</span>key: <span class="type">ByteString</span>, promise: <span class="type">Promise</span>[<span class="type">Option</span>[<span class="type">ByteString</span>]] = <span class="type">Promise</span>())</span>
<span class="line">  <span class="keyword">case</span> <span class="class"><span class="keyword">class</span> <span class="title">Set</span>(</span>key: <span class="type">ByteString</span>, value: <span class="type">ByteString</span>, promise: <span class="type">Promise</span>[<span class="type">Unit</span>] = <span class="type">Promise</span>())</span>
<span class="line">&#125;</span>
<span class="line"></span>
<span class="line"><span class="class"><span class="keyword">object</span> <span class="title">KeyValExample</span> &#123;</span></span>
<span class="line">  </span>
<span class="line">  <span class="function"><span class="keyword">def</span> <span class="title">start</span>(</span>port: <span class="type">Int</span>)(<span class="keyword">implicit</span> io: <span class="type">IOSystem</span>): <span class="type">ServerRef</span> = &#123;</span>
<span class="line">    <span class="keyword">import</span> io.actorSystem.dispatcher</span>
<span class="line"></span>
<span class="line">    <span class="function"><span class="keyword">val</span> <span class="title">db</span> =</span> io.actorSystem.actorOf(<span class="type">Props</span>[<span class="type">KeyValDB</span>])</span>
<span class="line"></span>
<span class="line">    <span class="type">Service</span>.become[<span class="type">Redis</span>](<span class="string">"key-value-example"</span>, port)&#123;</span>
<span class="line">      <span class="keyword">case</span> <span class="type">Command</span>(<span class="string">"GET"</span>, args) =&gt; &#123;</span>
<span class="line">        <span class="function"><span class="keyword">val</span> <span class="title">dbCmd</span> =</span> <span class="type">KeyValDB</span>.<span class="type">Get</span>(args(<span class="number">0</span>))</span>
<span class="line">        db ! dbCmd</span>
<span class="line">        dbCmd.promise.future.map&#123;</span>
<span class="line">          <span class="keyword">case</span> <span class="type">Some</span>(value) =&gt; <span class="type">BulkReply</span>(value)</span>
<span class="line">          <span class="keyword">case</span> <span class="type">None</span> =&gt; <span class="type">NilReply</span></span>
<span class="line">        &#125;</span>
<span class="line">      &#125;</span>
<span class="line">      <span class="keyword">case</span> <span class="type">Command</span>(<span class="string">"SET"</span>, args) =&gt; &#123;</span>
<span class="line">        <span class="function"><span class="keyword">val</span> <span class="title">dbCmd</span> =</span> <span class="type">KeyValDB</span>.<span class="type">Set</span>(args(<span class="number">0</span>), args(<span class="number">1</span>))</span>
<span class="line">        db ! dbCmd</span>
<span class="line">        dbCmd.promise.future.map&#123;_ =&gt;</span>
<span class="line">          <span class="type">StatusReply</span>(<span class="string">"OK"</span>)</span>
<span class="line">        &#125;</span>
<span class="line">      &#125;</span>
<span class="line">    &#125;</span>
<span class="line">  &#125;</span>
<span class="line">&#125;</span>
</pre></td></tr></table></figure>

HttpExample

<figure class="highlight scala"><table><tr><td class="code"><pre><span class="line"><span class="class"><span class="keyword">object</span> <span class="title">HttpExample</span> &#123;</span></span>
<span class="line"></span>
<span class="line">  <span class="comment">/**</span>
<span class="line">   * Here we're demonstrating a common way of breaking out the business logic</span>
<span class="line">   * from the server setup, which makes functional testing easy</span>
<span class="line">   */</span></span>
<span class="line">  <span class="class"><span class="keyword">class</span> <span class="title">HttpRoutes</span>(</span>redis: <span class="type">LocalClient</span>[<span class="type">Command</span>, <span class="type">Reply</span>]) &#123;</span>
<span class="line">    </span>
<span class="line">    <span class="function"><span class="keyword">def</span> <span class="title">invalidReply</span>(</span>reply: <span class="type">Reply</span>) = s<span class="string">"Invalid reply from redis $reply"</span>    </span>
<span class="line"></span>
<span class="line">    <span class="function"><span class="keyword">val</span> <span class="title">handler</span>:</span> <span class="type">PartialFunction</span>[<span class="type">HttpRequest</span>, <span class="type">Response</span>[<span class="type">HttpResponse</span>]] = &#123;</span>
<span class="line">      <span class="keyword">case</span> req @ <span class="type">Get</span> on <span class="type">Root</span> =&gt; req.ok(<span class="string">"Hello World!"</span>)</span>
<span class="line"></span>
<span class="line">      <span class="keyword">case</span> req @ <span class="type">Get</span> on <span class="type">Root</span> / <span class="string">"get"</span>  / key =&gt; redis.send(<span class="type">Commands</span>.<span class="type">Get</span>(<span class="type">ByteString</span>(key))).map&#123;</span>
<span class="line">        <span class="keyword">case</span> <span class="type">BulkReply</span>(data) =&gt; req.ok(data.utf8String)</span>
<span class="line">        <span class="keyword">case</span> <span class="type">NilReply</span> =&gt; req.notFound(<span class="string">"(nil)"</span>)</span>
<span class="line">        <span class="keyword">case</span> other =&gt; req.error(invalidReply(other))</span>
<span class="line">      &#125;</span>
<span class="line"></span>
<span class="line">      <span class="keyword">case</span> req @ <span class="type">Get</span> on <span class="type">Root</span> / <span class="string">"set"</span> / key / value =&gt; redis.send(<span class="type">Commands</span>.<span class="type">Set</span>(<span class="type">ByteString</span>(key), <span class="type">ByteString</span>(value))).map&#123;</span>
<span class="line">        <span class="keyword">case</span> <span class="type">StatusReply</span>(msg) =&gt; req.ok(msg)</span>
<span class="line">        <span class="keyword">case</span> other =&gt; req.error(invalidReply(other))</span>
<span class="line">      &#125;</span>
<span class="line"></span>
<span class="line">    &#125;</span>
<span class="line"></span>
<span class="line">  &#125;</span>
<span class="line"></span>
<span class="line"></span>
<span class="line">  <span class="function"><span class="keyword">def</span> <span class="title">start</span>(</span>port: <span class="type">Int</span>, redisAddress: <span class="type">InetSocketAddress</span>)(<span class="keyword">implicit</span> system: <span class="type">IOSystem</span>): <span class="type">ServerRef</span> = &#123;</span>
<span class="line">    <span class="type">Service</span>.serve[<span class="type">Http</span>](<span class="string">"http-example"</span>, port)&#123;context =&gt;</span>
<span class="line">      <span class="function"><span class="keyword">val</span> <span class="title">redis</span> =</span> context.clientFor[<span class="type">Redis</span>](redisAddress.getHostName, redisAddress.getPort)</span>
<span class="line">      <span class="comment">//because our routes object has no internal state, we can share it among</span></span>
<span class="line">      <span class="comment">//connections.  If the class did have some per-connection internal state,</span></span>
<span class="line">      <span class="comment">//we'd just create one per connection</span></span>
<span class="line">      <span class="function"><span class="keyword">val</span> <span class="title">routes</span> =</span> <span class="keyword">new</span> <span class="type">HttpRoutes</span>(redis)</span>
<span class="line"></span>
<span class="line">      context.handle&#123;connection =&gt; </span>
<span class="line">        connection.become(routes.handler)</span>
<span class="line">      &#125;</span>
<span class="line">    &#125;</span>
<span class="line">  &#125;</span>
<span class="line"></span>
<span class="line">&#125;</span>
</pre></td></tr></table></figure>

![tumblr colossus](http://static.tumblr.com/dbcxhwx/lQ7m5bev3/engineering.png)

参考文献：

1.  [Colossus: A New Service Framework from Tumblr](http://engineering.tumblr.com/post/102906359034/colossus-a-new-service-framework-from-tumblr)
2.  [Tumblr推出开源微服务框架Colossus](http://www.jdon.com/46881)
3.  [Github: tumblr colossus](http://github.com/tumblr/colossus)
4.  [Colossus Page](http://tumblr.github.io/colossus/)
5.  [Colossus Documentation](http://tumblr.github.io/colossus/docs/)