title: ZooKeeper 简介
tags:
  - java
  - zookeeper
  - distribution
date: 2014-10-23 17:40:25
---

系统越来越大后切分出的模块越来越多，一些模块还部署了双机。配置文件混乱，更新部署极易出错，准备上 [zookeeper](http://zookeeper.apache.org)。

下载当前稳定版的 [zookeeper](http://zookeeper.apache.org/releases.html)，解压并拷贝 conf/zoo_sample.cfg 为 zoo.cfg，配置所需要的项目。最少配是只指定其中的 dataDir 项，其他项则使用默认值。

<figure class="highlight"><table><tr><td class="code"><pre><span class="line">tickTime=2000        # 心跳基本时间单位，毫秒级，zk基本上所有时间都是这个时间的整数倍</span>
<span class="line">clientPort=2181      # 监听客户端连接的端口</span>
<span class="line">dataDir=/zookeeper/server0/data         # 内存数据库快照存放地址</span>
<span class="line">dataLogDir=/zookeeper/server0/dataLog   # 事务日志存放地址，未指定则同dataDir项，建议分开</span>
</pre></td></tr></table></figure>
<a id="more"></a>

## 主要配置项说明

### 最小配置

最小配是保证zk正常运行必不可少的配置项。

*   **clientPort**：监听客户端连接的服务端口
*   **dataDir**：内存数据库快照地址，事务日志地址（除非由 dataLogDir 另行指定）
*   **tickTime**：毫秒级的基本时间单位，其他时间如心跳/超时等都为该单位时间的整数倍
> 建议另行指定 dataLogDir，以便将事务日志存储在单独的路径下，这很重要，因事物日志存储的设备效率直接影响zk的性能。

### 高级配置

高级参数是可选的，可以通过这些参数调优zk性能。有些参数还可以通过 java system properties 动态指定，格式为 zookeeper.keyword 。

*   **dataLogDir**：事务日志目录，可以使用专用的设备，以避免事务日志与快照之间的竞争。(No Java system property)
*   **globalOutstandingLimit**：zk接收的请求队列大小，默认1000，设置太大对导致内存溢出。(Java system property: zookeeper.globalOutstandingLimit)
*   **preAllocSize**：预先分配事务日志空间块，单位kb，默认64M。如果快照写入很频繁，减少这个值，参考 snapCount。 (Java system property: zookeeper.preAllocSize)
*   **snapCount**：每当 snapCount 个事物日志写入时，快照被创建，同时创建新的事务日志文件，默认值100,000。(Java system property: zookeeper.snapCount)

垃圾清理参数

*   **autopurge.purgeInterval**：清理频率，单位小时，默认0，表示不开启清理功能。
*   **autopurge.snapRetainCount**：需要保留的文件数目，默认是保留3个。

### 集群配置

*   **electionAlg**：领导选举算法，默认3。(No Java system property)
*   **initLimit**：tickTime的倍数，表示leader选举结束后，followers与leader同步需要的时间，leader的数据非常多时或followers比较多，则该值应该适当大一些。(No Java system property)
*   **syncLimit**：tickTime的倍数，表示follower和observer与leader交互时的最大等待时间，只不过是在与leader同步完毕之后，正常请求转发或ping等消息交互时的超时时间。(No Java system property)
*   **server.x**=[hostname]:nnnnn[:nnnnn], etc
集群配置中，在dataDir目录下必须有一个myid文件，其中的值就是数字x，范围是1-255。第一个nnnnn是与leader通讯使用，第二个nnnnn是选举leader使用，electionAlg等于0时不需要此参数。(No Java system property)

集群配置的例子
conf下的zoo.cfg文件：
<figure class="highlight axapta"><table><tr><td class="code"><pre><span class="line"><span class="keyword">server</span>.1=<span class="number">127.0</span>.0.1:<span class="number">12888</span>:<span class="number">13888</span></span>
<span class="line"><span class="keyword">server</span>.2=<span class="number">127.0</span>.0.1:<span class="number">22888</span>:<span class="number">23888</span></span>
<span class="line"><span class="keyword">server</span>.3=<span class="number">127.0</span>.0.1:<span class="number">32888</span>:<span class="number">33888</span></span>
</pre></td></tr></table></figure>

dataDir下的myid文件：
<figure class="highlight"><table><tr><td class="code"><pre><span class="line">1</span>
</pre></td></tr></table></figure>

> 更多参数参考 [ZK Administrator’s Guide](http://zookeeper.apache.org/doc/trunk/zookeeperAdmin.html)、[ZK 配置项详解](http://blog.csdn.net/lovingprince/article/details/6853753)、[ZK 配置文件](http://www.udpwork.com/item/2002.html) 或 [ZK 管理员指南](http://nileader.blog.51cto.com/1381108/1032157)。

## Java API

zk 官方的Java API是非常难用的，建议使用第三方基于官方API封装的工具包。

*   Netflix curator：[http://github.com/Netflix/curator](http://github.com/Netflix/curator)（强大）
*   sgroschupf zkclient：[http://github.com/sgroschupf/zkclient](http://github.com/sgroschupf/zkclient)（简单）
*   adyliu zkclient：[http://github.com/adyliu/zkclient](http://github.com/adyliu/zkclient)（极简）

看一下官方API的主要接口：
<figure class="highlight java"><table><tr><td class="code"><pre><span class="line"><span class="function"><span class="keyword">public</span> <span class="title">ZooKeeper</span><span class="params">(String connectString, <span class="keyword">int</span> sessionTimeout, Watcher watcher)</span> </span>
<span class="line">   <span class="keyword">throws</span> IOException</span></span>
</pre></td></tr></table></figure>

*   connectString：逗号分隔，如localhost:2181,127.0.0.1:2181，zk会选出一个建立连接
*   sessionTimeout：session超时时间
*   watcher：回调函数
> 该方法是非阻塞的，如果需要阻塞，可以在Watcher中自己处理。
<figure class="highlight java"><table><tr><td class="code"><pre><span class="line"><span class="function"><span class="keyword">public</span> String <span class="title">create</span><span class="params">(String path, <span class="keyword">byte</span> data[], List&lt;ACL&gt; acl, CreateMode createMode)</span></span>
<span class="line">   <span class="keyword">throws</span> KeeperException, InterruptedException</span>
<span class="line">```        </span>
<span class="line">- path：znode路径</span>
<span class="line">- data：znode上的数据</span>
<span class="line">- acl：权限信息, 如果不想指定权限, 可传入org.*.ZooDefs.Ids.OPEN_ACL_UNSAFE。</span>
<span class="line">- createMode：枚举类CreateMode，PERSISTENT / PERSISTENT_SEQUENTIAL / EPHEMERAL / EPHEMERAL_SEQUENTIAL</span>
<span class="line"></span>
<span class="line">```java</span>
<span class="line"><span class="keyword">public</span> List&lt;String&gt; <span class="title">getChildren</span><span class="params">(<span class="keyword">final</span> String path, Watcher watcher)</span></span>
<span class="line">   <span class="keyword">throws</span> KeeperException, InterruptedException</span></span>
</pre></td></tr></table></figure>

*   path：znode路径
*   watcher：回调函数
> 监听 path node 自身的删除事件，以及 children nodes 的创建/删除事件。
<figure class="highlight java"><table><tr><td class="code"><pre><span class="line"><span class="function"><span class="keyword">public</span> Stat <span class="title">exists</span><span class="params">(<span class="keyword">final</span> String path, Watcher watcher)</span></span>
<span class="line">   <span class="keyword">throws</span> KeeperException, InterruptedException</span></span>
</pre></td></tr></table></figure>
> 监听 path node 自身的创建/删除/数据更新事件，path 不存在返回 null。
<figure class="highlight java"><table><tr><td class="code"><pre><span class="line"><span class="keyword">public</span> <span class="keyword">byte</span>[] getData(<span class="keyword">final</span> String path, Watcher watcher, Stat stat)</span>
<span class="line">   <span class="keyword">throws</span> KeeperException, InterruptedException</span>
</pre></td></tr></table></figure>
> 监听 path node 的删除/数据更新事件, 注意, 不监听 path node 的创建事件。stat 是传出参数，返回当前节点状态。
<figure class="highlight java"><table><tr><td class="code"><pre><span class="line"><span class="function"><span class="keyword">public</span> Stat <span class="title">setData</span><span class="params">(<span class="keyword">final</span> String path, <span class="keyword">byte</span> data[], <span class="keyword">int</span> version)</span></span>
<span class="line">   <span class="keyword">throws</span> KeeperException, InterruptedException</span></span>
</pre></td></tr></table></figure>
> version 参数指定要更新数据的当前版本, 就是stats中的 version 值，如果和现有版本不匹配, 更新操作将失败。指定 version 为-1则忽略版本检查。
<figure class="highlight java"><table><tr><td class="code"><pre><span class="line"><span class="function"><span class="keyword">public</span> <span class="keyword">void</span> <span class="title">delete</span><span class="params">(<span class="keyword">final</span> String path, <span class="keyword">int</span> version)</span></span>
<span class="line">   <span class="keyword">throws</span> InterruptedException, KeeperException</span></span>
</pre></td></tr></table></figure>

总结：

> getChildren， getData， exists 方法可指定是否监听相应的事件；而create，delete，setData 方法则会触发相应的事件。

## 权限设置
<figure class="highlight java"><table><tr><td class="code"><pre><span class="line"><span class="comment">// new一个acl</span></span>
<span class="line">List&lt;ACL&gt; acls = <span class="keyword">new</span> ArrayList&lt;ACL&gt;();</span>
<span class="line"><span class="comment">// 添加第一个id，采用用户名密码形式</span></span>
<span class="line">Id id1 = <span class="keyword">new</span> Id(<span class="string">"digest"</span>, DigestAuthenticationProvider.generateDigest(<span class="string">"admin:admin"</span>));</span>
<span class="line">ACL acl1 = <span class="keyword">new</span> ACL(ZooDefs.Perms.ALL, id1);</span>
<span class="line">acls.add(acl1);</span>
<span class="line"><span class="comment">// 添加第二个id，所有用户可读权限</span></span>
<span class="line">Id id2 = <span class="keyword">new</span> Id(<span class="string">"world"</span>, <span class="string">"anyone"</span>);</span>
<span class="line">ACL acl2 = <span class="keyword">new</span> ACL(ZooDefs.Perms.READ, id2);</span>
<span class="line">acls.add(acl2);</span>
<span class="line"></span>
<span class="line"><span class="comment">// zk用admin认证，创建/buru ZNode。</span></span>
<span class="line"><span class="keyword">final</span> ZooKeeper zk = <span class="keyword">new</span> ZooKeeper(<span class="string">"localhost:2181,127.0.0.1:2181"</span>, <span class="number">2000</span>, <span class="keyword">null</span>);</span>
<span class="line">zk.addAuthInfo(<span class="string">"digest"</span>, <span class="string">"admin:admin"</span>.getBytes());</span>
<span class="line"></span>
<span class="line">Stat exists = zk.exists(<span class="string">"/buru"</span>, <span class="keyword">true</span>);</span>
<span class="line"><span class="keyword">if</span> (exists != <span class="keyword">null</span>)</span>
<span class="line">   zk.setData(<span class="string">"/buru"</span>, <span class="string">"2323"</span>.getBytes(), -<span class="number">1</span>);</span>
<span class="line"><span class="keyword">else</span></span>
<span class="line">   zk.create(<span class="string">"/buru"</span>, <span class="string">"data112"</span>.getBytes(), acls, CreateMode.PERSISTENT);</span>
</pre></td></tr></table></figure>

更多内容参考文章， [ZK 权限配置](http://nettm.iteye.com/blog/1721778)、[ZK ACL使用](http://www.cnblogs.com/wangxiaowei/p/3315137.html)、[ZK 权限控制](http://nileader.blog.51cto.com/1381108/795525) 或 [说说Zookeeper中的ACL](http://www.wuzesheng.com/?p=2438)。

## 管理工具

很可惜，没有顺手的，试试下面几个吧！

*   [ZooInspector](http://issues.apache.org/jira/secure/attachment/12436620/ZooInspector.zip)*   [ZooInspector 改进版](http://github.com/nettm/ZooInspector)
*   [node-zk-browser](http://github.com/killme2008/node-zk-browser)
*   [Node_Zookeeper_Admin](http://git.oschina.net/gznofeng/Node_Zookeeper_Admin)
*   [taokeeper](http://jm-blog.aliapp.com/?p=1450)
*   [zookeepercontroller](http://github.com/ryuubaishi/zookeepercontroller)