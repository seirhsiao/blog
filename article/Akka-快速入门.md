title: Akka 快速入门
tags:
  - akka
  - scala
date: 2014-05-25 16:10:00
---

Akka的优点太多，高性能、高可靠、高并发、分布式、可容错、可扩展、事件驱动，不一一叙述。不同版本的API差异很大，本文代码运行在 [Scala 2.10.3](http://www.scala-lang.org) 和 [Akka 2.3.2](http://akka.io) 之上。
<figure class="highlight xml"><table><tr><td class="code"><pre><span class="line"><span class="tag">&lt;<span class="title">dependency</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;<span class="title">groupId</span>&gt;</span>com.typesafe.akka<span class="tag">&lt;/<span class="title">groupId</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;<span class="title">artifactId</span>&gt;</span>akka-actor_2.10<span class="tag">&lt;/<span class="title">artifactId</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;<span class="title">version</span>&gt;</span>2.3.2<span class="tag">&lt;/<span class="title">version</span>&gt;</span></span>
<span class="line"><span class="tag">&lt;/<span class="title">dependency</span>&gt;</span></span>
<span class="line"><span class="tag">&lt;<span class="title">dependency</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;<span class="title">groupId</span>&gt;</span>org.scala-lang<span class="tag">&lt;/<span class="title">groupId</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;<span class="title">artifactId</span>&gt;</span>scala-library<span class="tag">&lt;/<span class="title">artifactId</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;<span class="title">version</span>&gt;</span>2.10.3<span class="tag">&lt;/<span class="title">version</span>&gt;</span></span>
<span class="line"><span class="tag">&lt;/<span class="title">dependency</span>&gt;</span></span>
</pre></td></tr></table></figure>

# 定义

定义Actor很简单，继承 akka.actor.Actor ，实现receive方法即可。

<figure class="highlight scala"><table><tr><td class="code"><pre><span class="line"><span class="class"><span class="keyword">class</span> <span class="title">Hello</span> <span class="keyword"><span class="keyword">extends</span></span> <span class="title">Actor</span> &#123;</span></span>
<span class="line">  <span class="function"><span class="keyword">def</span> <span class="title">receive</span> =</span> &#123;</span>
<span class="line">    <span class="keyword">case</span> msg: <span class="type">String</span> =&gt; println(<span class="string">"hello "</span> + msg)</span>
<span class="line">    <span class="keyword">case</span> _ =&gt; println(<span class="string">"unexpected message."</span>)</span>
<span class="line">  &#125;</span>
<span class="line">&#125;</span>
</pre></td></tr></table></figure>
<a id="more"></a>

# 启动

创建Actor实例需要通过 ActorSystem 。

<figure class="highlight scala"><table><tr><td class="code"><pre><span class="line"><span class="function"><span class="keyword">val</span> <span class="title">system</span> =</span> <span class="type">ActorSystem</span>(<span class="string">"HelloSystem"</span>)</span>
<span class="line"><span class="function"><span class="keyword">val</span> <span class="title">hello</span> =</span> system.actorOf(<span class="type">Props</span>[<span class="type">Hello</span>], name = <span class="string">"hello"</span>)</span>
<span class="line"><span class="function"><span class="keyword">val</span> <span class="title">hello1</span> =</span> system.actorOf(<span class="type">Props</span>[<span class="type">Hello</span>])</span>
<span class="line"><span class="function"><span class="keyword">val</span> <span class="title">hello2</span> =</span> system.actorOf(<span class="type">Props</span>(<span class="keyword">new</span> <span class="type">Hello</span>()))</span>
</pre></td></tr></table></figure>

如果要在 Actor 中继续创建子 Actor，需要使用内置的 ActorContext 对象。

<figure class="highlight scala"><table><tr><td class="code"><pre><span class="line">context.actorOf(<span class="type">Props</span>[children], name = <span class="string">"children"</span>)</span>
</pre></td></tr></table></figure>

如果要创建远程 Actor，需要通过 actorSelection 方法，原 actorFor 方法不再使用。

<figure class="highlight scala"><table><tr><td class="code"><pre><span class="line">context.actorSelection(<span class="string">"akka.tcp://HelloRemoteSystem@127.0.0.1:5150/user/RemoteActor"</span>)</span>
</pre></td></tr></table></figure>

# 发消息

巨简单，就是一个!，可以发送任意类型的消息，此消息是异步的。

<figure class="highlight scala"><table><tr><td class="code"><pre><span class="line">hello ! <span class="string">"bruce"</span></span>
<span class="line">hello ! <span class="number">10086</span></span>
</pre></td></tr></table></figure>

同步消息的发送需要使用 Future 对象。

<figure class="highlight nimrod"><table><tr><td class="code"><pre><span class="line">implicit val timeout = <span class="type">Timeout</span>(<span class="number">5</span> seconds)</span>
<span class="line">val future = hello ? <span class="string">"sha"</span></span>
<span class="line">val <span class="literal">result</span> = <span class="type">Await</span>.<span class="literal">result</span>(future, timeout.duration).asInstanceOf[<span class="type">String</span>]</span>
</pre></td></tr></table></figure>

# 停止

有两种方式停止一个Actor。

一种是通过内部 ActorContext.stop() 方法，该方法会将 children actor 逐层杀掉后，再自刎。

<figure class="highlight scala"><table><tr><td class="code"><pre><span class="line"><span class="function"><span class="keyword">def</span> <span class="title">receive</span> =</span> &#123;</span>
<span class="line">    <span class="keyword">case</span> <span class="string">"stop"</span> =&gt; context.stop(self)</span>
<span class="line">    ...</span>
<span class="line">  &#125;</span>
</pre></td></tr></table></figure>

另一种是外部喂毒药，通过 ActorRef.tell() 方法实现。后一个参数是向谁reply，这里显然不需要，传空。

<figure class="highlight scala"><table><tr><td class="code"><pre><span class="line">hello.tell(<span class="type">PoisonPill</span>.getInstance, <span class="type">ActorRef</span>.noSender);</span>
</pre></td></tr></table></figure>

# 哼哈示例
> 哼哈二将本是两位佛寺的门神俗称，是执金刚神的一种。明代小说《封神演义》作者陈仲琳据此附会两员神将，形象威武凶猛。一名郑伦，能鼻哼白气制敌；一名陈奇，能口哈黄气擒将。
<figure class="highlight scala"><table><tr><td class="code"><pre><span class="line"><span class="class"><span class="keyword">object</span> <span class="title">HengHa</span> <span class="keyword"><span class="keyword">extends</span></span> <span class="title">App</span> &#123;</span></span>
<span class="line">  <span class="function"><span class="keyword">val</span> <span class="title">system</span> =</span> <span class="type">ActorSystem</span>(<span class="string">"HengHaSystem"</span>)</span>
<span class="line">  <span class="function"><span class="keyword">val</span> <span class="title">ha</span> =</span> system.actorOf(<span class="type">Props</span>[<span class="type">Ha</span>], name = <span class="string">"ha"</span>)</span>
<span class="line">  <span class="function"><span class="keyword">val</span> <span class="title">heng</span> =</span> system.actorOf(<span class="type">Props</span>(<span class="keyword">new</span> <span class="type">Heng</span>(ha)), name = <span class="string">"heng"</span>)</span>
<span class="line"></span>
<span class="line">  heng ! <span class="string">"start"</span></span>
<span class="line">&#125;</span>
</pre></td></tr></table></figure>
<figure class="highlight scala"><table><tr><td class="code"><pre><span class="line"><span class="class"><span class="keyword">class</span> <span class="title">Heng</span>(</span>ha: <span class="type">ActorRef</span>) <span class="keyword">extends</span> <span class="type">Actor</span> &#123;</span>
<span class="line">  <span class="function"><span class="keyword">def</span> <span class="title">receive</span> =</span> &#123;</span>
<span class="line">    <span class="keyword">case</span> <span class="string">"start"</span> =&gt; ha ! <span class="string">"heng"</span></span>
<span class="line">    <span class="keyword">case</span> <span class="string">"ha"</span> =&gt; </span>
<span class="line">      println(<span class="string">"哈"</span>)</span>
<span class="line">      ha ! <span class="string">"heng"</span></span>
<span class="line">    <span class="keyword">case</span> _ =&gt; println(<span class="string">"heng what?"</span>)</span>
<span class="line">  &#125;</span>
<span class="line">&#125;</span>
</pre></td></tr></table></figure>
<figure class="highlight scala"><table><tr><td class="code"><pre><span class="line"><span class="class"><span class="keyword">class</span> <span class="title">Ha</span> <span class="keyword"><span class="keyword">extends</span></span> <span class="title">Actor</span> &#123;</span></span>
<span class="line">  <span class="function"><span class="keyword">def</span> <span class="title">receive</span> =</span> &#123;</span>
<span class="line">    <span class="keyword">case</span> <span class="string">"heng"</span> =&gt; </span>
<span class="line">      println(<span class="string">"哼"</span>)</span>
<span class="line">      sender ! <span class="string">"ha"</span></span>
<span class="line">    <span class="keyword">case</span> _ =&gt; println(<span class="string">"ha what?"</span>)</span>
<span class="line">  &#125;</span>
<span class="line">&#125;</span>
</pre></td></tr></table></figure>

Run 起来，结果：

<figure class="highlight erlang"><table><tr><td class="code"><pre><span class="line">哼</span>
<span class="line">哈</span>
<span class="line">哼</span>
<span class="line">哈</span>
<span class="line">哼</span>
<span class="line">...</span>
</pre></td></tr></table></figure>

# 远程示例

### local工程

application.conf
<figure class="highlight"><table><tr><td class="code"><pre><span class="line">akka &#123;</span>
<span class="line">  loglevel = "DEBUG"</span>
<span class="line">  actor &#123;</span>
<span class="line">    provider = "akka.remote.RemoteActorRefProvider"</span>
<span class="line">  &#125;</span>
<span class="line">  remote &#123;</span>
<span class="line">    enabled-transports = ["akka.remote.netty.tcp"]</span>
<span class="line">    netty.tcp &#123;</span>
<span class="line">      hostname = "127.0.0.1"</span>
<span class="line">      port = 5155</span>
<span class="line">    &#125;</span>
<span class="line"> &#125;</span>
<span class="line">&#125;</span>
</pre></td></tr></table></figure>

<figure class="highlight scala"><table><tr><td class="code"><pre><span class="line"><span class="class"><span class="keyword">object</span> <span class="title">Local</span> <span class="keyword"><span class="keyword">extends</span></span> <span class="title">App</span> &#123;</span></span>
<span class="line">  <span class="function"><span class="keyword">val</span> <span class="title">system</span> =</span> <span class="type">ActorSystem</span>(<span class="string">"LocalSystem"</span>)</span>
<span class="line">  <span class="function"><span class="keyword">val</span> <span class="title">localActor</span> =</span> system.actorOf(<span class="type">Props</span>[<span class="type">LocalActor</span>], name = <span class="string">"LocalActor"</span>) <span class="comment">// the local actor</span></span>
<span class="line">  localActor ! <span class="string">"START"</span> <span class="comment">// start the action</span></span>
<span class="line">&#125;</span>
</pre></td></tr></table></figure>
<figure class="highlight scala"><table><tr><td class="code"><pre><span class="line"><span class="class"><span class="keyword">class</span> <span class="title">LocalActor</span> <span class="keyword"><span class="keyword">extends</span></span> <span class="title">Actor</span> &#123;</span></span>
<span class="line">  <span class="comment">// create the remote actor</span></span>
<span class="line">  <span class="function"><span class="keyword">val</span> <span class="title">remote</span> =</span> context.actorSelection(<span class="string">"akka.tcp://HelloRemoteSystem@127.0.0.1:5150/user/RemoteActor"</span>)</span>
<span class="line">  <span class="keyword">var</span> counter = <span class="number">0</span></span>
<span class="line"></span>
<span class="line">  <span class="function"><span class="keyword">def</span> <span class="title">receive</span> =</span> &#123;</span>
<span class="line">    <span class="keyword">case</span> <span class="string">"START"</span> =&gt;</span>
<span class="line">      remote ! <span class="string">"Hello from the LocalActor"</span></span>
<span class="line">    <span class="keyword">case</span> msg: <span class="type">String</span> =&gt;</span>
<span class="line">      println(s<span class="string">"LocalActor received message: '$msg'"</span>)</span>
<span class="line"></span>
<span class="line">      <span class="keyword">if</span> (counter &lt; <span class="number">5</span>) &#123;</span>
<span class="line">        sender ! <span class="string">"Hello back to you"</span></span>
<span class="line">        counter += <span class="number">1</span></span>
<span class="line">      &#125;</span>
<span class="line">  &#125;</span>
<span class="line">&#125;</span>
</pre></td></tr></table></figure>

### remote工程

application.conf
<figure class="highlight"><table><tr><td class="code"><pre><span class="line">akka &#123;</span>
<span class="line">  loglevel = "DEBUG"</span>
<span class="line">  actor &#123;</span>
<span class="line">    provider = "akka.remote.RemoteActorRefProvider"</span>
<span class="line">  &#125;</span>
<span class="line">  remote &#123;</span>
<span class="line">    enabled-transports = ["akka.remote.netty.tcp"]</span>
<span class="line">    netty.tcp &#123;</span>
<span class="line">      hostname = "127.0.0.1"</span>
<span class="line">      port = 5150</span>
<span class="line">    &#125;</span>
<span class="line"> &#125;</span>
<span class="line">&#125;</span>
</pre></td></tr></table></figure>

<figure class="highlight scala"><table><tr><td class="code"><pre><span class="line"><span class="class"><span class="keyword">object</span> <span class="title">HelloRemote</span> <span class="keyword"><span class="keyword">extends</span></span> <span class="title">App</span> &#123;</span></span>
<span class="line">  <span class="function"><span class="keyword">val</span> <span class="title">system</span> =</span> <span class="type">ActorSystem</span>(<span class="string">"HelloRemoteSystem"</span>)</span>
<span class="line">  <span class="function"><span class="keyword">val</span> <span class="title">remoteActor</span> =</span> system.actorOf(<span class="type">Props</span>[<span class="type">RemoteActor</span>], name = <span class="string">"RemoteActor"</span>)</span>
<span class="line"></span>
<span class="line">  remoteActor ! <span class="string">"The RemoteActor is alive"</span></span>
<span class="line">&#125;</span>
</pre></td></tr></table></figure>
<figure class="highlight scala"><table><tr><td class="code"><pre><span class="line"><span class="class"><span class="keyword">class</span> <span class="title">RemoteActor</span> <span class="keyword"><span class="keyword">extends</span></span> <span class="title">Actor</span> &#123;</span></span>
<span class="line">  <span class="function"><span class="keyword">def</span> <span class="title">receive</span> =</span> &#123;</span>
<span class="line">    <span class="keyword">case</span> msg: <span class="type">String</span> =&gt;</span>
<span class="line">      println(s<span class="string">"RemoteActor received message '$msg'"</span>)</span>
<span class="line">      sender ! <span class="string">"Hello from the RemoteActor"</span></span>
<span class="line">  &#125;</span>
<span class="line">&#125;</span>
</pre></td></tr></table></figure>
<!-- 
 swind.code-life.info/categories/akka.html
-->