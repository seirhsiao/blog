title: mongoDB 3.0 安全权限访问控制
tags:
  - mongodb
date: 2015-03-17 10:53:36
---

MongoDB3.0权限，啥都不说了，谷歌百度出来的全是错的。先安装好盲沟，简单的没法说。

首先，不使用 _—auth_ 参数，启动 mongoDB：

<figure class="highlight bash"><table><tr><td class="code"><pre><span class="line">mongodb-linux-i686-<span class="number">3.0</span>.<span class="number">0</span>/bin/mongod <span class="operator">-f</span> mongodb-linux-i686-<span class="number">3.0</span>.<span class="number">0</span>/mongodb.conf</span>
</pre></td></tr></table></figure>
> 此时你 _show dbs_ 会看到只有一个local数据库，那个所谓的admin是不存在的。

mongoDB 没有炒鸡无敌用户root，只有能管理用户的用户 [userAdminAnyDatabase](http://docs.mongodb.org/manual/reference/built-in-roles/#userAdminAnyDatabase)。

打开 **mongo shell**：

<figure class="highlight gradle"><table><tr><td class="code"><pre><span class="line">mongodb-linux-i686-<span class="number">3.0</span>.<span class="number">0</span><span class="regexp">/bin/m</span>ongo</span>
</pre></td></tr></table></figure>

添加管理用户：

<figure class="highlight stata"><table><tr><td class="code"><pre><span class="line"><span class="keyword">use</span> admin</span>
<span class="line"><span class="keyword">db</span>.createUser(</span>
<span class="line">  &#123;</span>
<span class="line">    user: <span class="string">"buru"</span>,</span>
<span class="line">    <span class="keyword">pwd</span>: <span class="string">"12345678"</span>,</span>
<span class="line">    roles: [ &#123; role: <span class="string">"userAdminAnyDatabase"</span>, <span class="keyword">db</span>: <span class="string">"admin"</span> &#125; ]</span>
<span class="line">  &#125;</span>
<span class="line">)</span>
</pre></td></tr></table></figure>
<a id="more"></a>
> roles 中的 db 参数是必须的，不然会报错：_Error: couldn’t add user: Missing expected field “db”_。另外，有很多文章记录的是使用 [db.addUser(…)](http://docs.mongodb.org/v2.2/reference/method/db.addUser) 方法，这个方法是旧版的，3.0中已经不存在，详见：[http://docs.mongodb.org/manual/reference/method/js-user-management](http://docs.mongodb.org/manual/reference/method/js-user-management)。

切换到admin下，查看刚才创建的用户：

<figure class="highlight stylus"><table><tr><td class="code"><pre><span class="line">show users</span>
<span class="line">或</span>
<span class="line">db<span class="class">.system</span><span class="class">.users</span><span class="class">.find</span>()</span>
</pre></td></tr></table></figure>
<figure class="highlight json"><table><tr><td class="code"><pre><span class="line">&#123; "<span class="attribute">_id</span>" : <span class="value"><span class="string">"admin.buru"</span></span>, "<span class="attribute">user</span>" : <span class="value"><span class="string">"buru"</span></span>, "<span class="attribute">db</span>" : <span class="value"><span class="string">"admin"</span></span>, "<span class="attribute">credentials</span>" : <span class="value">&#123; "<span class="attribute">SCRAM-SHA-1</span>" : <span class="value">&#123; "<span class="attribute">iterationCount</span>" : <span class="value"><span class="number">10000</span></span>, "<span class="attribute">salt</span>" : <span class="value"><span class="string">"gwVwuA/dXvxgSHavEnlyvA=="</span></span>, "<span class="attribute">storedKey</span>" : <span class="value"><span class="string">"l2QEVTEujpkCuqDEKqfIWbSv4ms="</span></span>, "<span class="attribute">serverKey</span>" : <span class="value"><span class="string">"M1ofNKXg2sNCsFrBJbX4pXbSgvg="</span> </span>&#125; </span>&#125;</span>, "<span class="attribute">roles</span>" : <span class="value">[ &#123; "<span class="attribute">role</span>" : <span class="value"><span class="string">"userAdminAnyDatabase"</span></span>, "<span class="attribute">db</span>" : <span class="value"><span class="string">"admin"</span> </span>&#125; ] </span>&#125;</span>
</pre></td></tr></table></figure>
> 怎么关闭 mongoDB？千万不要 kill -9 pid，可以 kill -2 pid 或 db.shutdownServer()

下面使用 _—auth_ 参 数，重新启动 mongoDB：

<figure class="highlight applescript"><table><tr><td class="code"><pre><span class="line">mongodb-linux-i686-<span class="number">3.0</span>.0/bin/mongod <span class="comment">--auth -f mongodb-linux-i686-3.0.0/mongodb.conf</span></span>
</pre></td></tr></table></figure>

再次打开 **mongo shell**：

<figure class="highlight stylus"><table><tr><td class="code"><pre><span class="line">mongodb-linux-i686-<span class="number">3.0</span>.<span class="number">0</span>/bin/mongo</span>
<span class="line">use admin</span>
<span class="line">db.<span class="function"><span class="title">auth</span><span class="params">(<span class="string">"buru"</span>,<span class="string">"12345678"</span>)</span></span> #认证，返回<span class="number">1</span>表示成功</span>
<span class="line">或</span>
<span class="line">mongodb-linux-i686-<span class="number">3.0</span>.<span class="number">0</span>/bin/mongo -u buru -<span class="tag">p</span> <span class="number">12345678</span> --authenticationDatabase admin</span>
</pre></td></tr></table></figure>

此时

<figure class="highlight nginx"><table><tr><td class="code"><pre><span class="line"><span class="title">show</span> collections</span>
</pre></td></tr></table></figure>

报错
<figure class="highlight stata"><table><tr><td class="code"><pre><span class="line">2015-03-17T10:15:56.011+0800 <span class="keyword">E</span> <span class="keyword">QUERY</span>    <span class="keyword">Error</span>: listCollections failed: &#123;</span>
<span class="line">  <span class="string">"ok"</span> : 0,</span>
<span class="line">  <span class="string">"errmsg"</span> : <span class="string">"not authorized on admin to execute command &#123; listCollections: 1.0 &#125;"</span>,</span>
<span class="line">  <span class="string">"code"</span> : 13</span>
<span class="line">&#125;</span>
<span class="line">  at <span class="keyword">Error</span> (&lt;anonymous&gt;)</span>
<span class="line">  at <span class="keyword">DB</span>._getCollectionInfosCommand (src/mongo/<span class="keyword">shell</span>/<span class="keyword">db</span>.js:643:15)</span>
<span class="line">  at <span class="keyword">DB</span>.getCollectionInfos (src/mongo/<span class="keyword">shell</span>/<span class="keyword">db</span>.js:655:20)</span>
<span class="line">  at <span class="keyword">DB</span>.getCollectionNames (src/mongo/<span class="keyword">shell</span>/<span class="keyword">db</span>.js:666:17)</span>
<span class="line">  at shellHelper.show (src/mongo/<span class="keyword">shell</span>/utils.js:625:12)</span>
<span class="line">  at shellHelper (src/mongo/<span class="keyword">shell</span>/utils.js:524:36)</span>
<span class="line">  at (shellhelp2):1:1 at src/mongo/<span class="keyword">shell</span>/<span class="keyword">db</span>.js:643</span>
</pre></td></tr></table></figure>

因为，用户buru只有用户管理的权限。

下面创建用户，用户都跟着库走，创建的用户都是

<figure class="highlight stata"><table><tr><td class="code"><pre><span class="line"><span class="keyword">use</span> tianhe</span>
<span class="line"><span class="keyword">db</span>.createUser(</span>
<span class="line"> &#123;</span>
<span class="line">   user: <span class="string">"bao"</span>,</span>
<span class="line">   <span class="keyword">pwd</span>: <span class="string">"12345678"</span>,</span>
<span class="line">   roles: [</span>
<span class="line">      &#123; role: <span class="string">"readWrite"</span>, <span class="keyword">db</span>: <span class="string">"tianhe"</span> &#125;,</span>
<span class="line">      &#123; role: <span class="string">"read"</span>, <span class="keyword">db</span>: <span class="string">"tianhe2"</span> &#125;</span>
<span class="line">   ]</span>
<span class="line"> &#125;</span>
<span class="line">)</span>
</pre></td></tr></table></figure>

查看刚刚创建的用户。

<figure class="highlight nsis"><table><tr><td class="code"><pre><span class="line"><span class="literal">show</span> users</span>
<span class="line"></span>
<span class="line">&#123;</span>
<span class="line">  <span class="string">"_id"</span> : <span class="string">"tianhe.bao"</span>,</span>
<span class="line">  <span class="string">"user"</span> : <span class="string">"bao"</span>,</span>
<span class="line">  <span class="string">"db"</span> : <span class="string">"tianhe"</span>,</span>
<span class="line">  <span class="string">"roles"</span> : [</span>
<span class="line">    &#123;</span>
<span class="line">      <span class="string">"role"</span> : <span class="string">"readWrite"</span>,</span>
<span class="line">      <span class="string">"db"</span> : <span class="string">"tianhe"</span></span>
<span class="line">    &#125;,</span>
<span class="line">    &#123;</span>
<span class="line">      <span class="string">"role"</span> : <span class="string">"read"</span>,</span>
<span class="line">      <span class="string">"db"</span> : <span class="string">"tianhe2"</span></span>
<span class="line">    &#125;</span>
<span class="line">  ]</span>
<span class="line">&#125;</span>
</pre></td></tr></table></figure>

查看整个mongoDB全部的用户：

<figure class="highlight perl"><table><tr><td class="code"><pre><span class="line"><span class="keyword">use</span> admin</span>
<span class="line">db.<span class="keyword">system</span>.users.find()</span>
<span class="line"></span>
<span class="line">&#123; <span class="string">"_id"</span> : <span class="string">"admin.buru"</span>, <span class="string">"user"</span> : <span class="string">"buru"</span>, <span class="string">"db"</span> : <span class="string">"admin"</span>, <span class="string">"credentials"</span> : &#123; <span class="string">"SCRAM-SHA-1"</span> : &#123; <span class="string">"iterationCount"</span> : <span class="number">10000</span>, <span class="string">"salt"</span> : <span class="string">"gwVwuA/dXvxgSHavEnlyvA=="</span>, <span class="string">"storedKey"</span> : <span class="string">"l2QEVTEujpkCuqDEKqfIWbSv4ms="</span>, <span class="string">"serverKey"</span> : <span class="string">"M1ofNKXg2sNCsFrBJbX4pXbSgvg="</span> &#125; &#125;, <span class="string">"roles"</span> : [ &#123; <span class="string">"role"</span> : <span class="string">"userAdminAnyDatabase"</span>, <span class="string">"db"</span> : <span class="string">"admin"</span> &#125; ] &#125;</span>
<span class="line">&#123; <span class="string">"_id"</span> : <span class="string">"tianhe.bao"</span>, <span class="string">"user"</span> : <span class="string">"bao"</span>, <span class="string">"db"</span> : <span class="string">"tianhe"</span>, <span class="string">"credentials"</span> : &#123; <span class="string">"SCRAM-SHA-1"</span> : &#123; <span class="string">"iterationCount"</span> : <span class="number">10000</span>, <span class="string">"salt"</span> : <span class="string">"//xy1V1fbqEHC1gzQqZHGQ=="</span>, <span class="string">"storedKey"</span> : <span class="string">"ZS/o54zzl/FdcXLQJ98KdAVTfF0="</span>, <span class="string">"serverKey"</span> : <span class="string">"iIpNYz2Gk8KhyK3zgz6muBt0PI4="</span> &#125; &#125;, <span class="string">"roles"</span> : [ &#123; <span class="string">"role"</span> : <span class="string">"readWrite"</span>, <span class="string">"db"</span> : <span class="string">"tianhe"</span> &#125;, &#123; <span class="string">"role"</span> : <span class="string">"read"</span>, <span class="string">"db"</span> : <span class="string">"tianhe2"</span> &#125; ] &#125;</span>
</pre></td></tr></table></figure>

创建完毕，验证一下：
<figure class="highlight stata"><table><tr><td class="code"><pre><span class="line"><span class="keyword">use</span> buru</span>
<span class="line">show collections</span>
<span class="line"></span>
<span class="line">2015-03-17T10:30:06.461+0800 <span class="keyword">E</span> <span class="keyword">QUERY</span>    <span class="keyword">Error</span>: listCollections failed: &#123;</span>
<span class="line">  <span class="string">"ok"</span> : 0,</span>
<span class="line">  <span class="string">"errmsg"</span> : <span class="string">"not authorized on buru to execute command &#123; listCollections: 1.0 &#125;"</span>,</span>
<span class="line">  <span class="string">"code"</span> : 13</span>
<span class="line">&#125;</span>
<span class="line">  at <span class="keyword">Error</span> (&lt;anonymous&gt;)</span>
<span class="line">  at <span class="keyword">DB</span>._getCollectionInfosCommand (src/mongo/<span class="keyword">shell</span>/<span class="keyword">db</span>.js:643:15)</span>
<span class="line">  at <span class="keyword">DB</span>.getCollectionInfos (src/mongo/<span class="keyword">shell</span>/<span class="keyword">db</span>.js:655:20)</span>
<span class="line">  at <span class="keyword">DB</span>.getCollectionNames (src/mongo/<span class="keyword">shell</span>/<span class="keyword">db</span>.js:666:17)</span>
<span class="line">  at shellHelper.show (src/mongo/<span class="keyword">shell</span>/utils.js:625:12)</span>
<span class="line">  at shellHelper (src/mongo/<span class="keyword">shell</span>/utils.js:524:36)</span>
<span class="line">  at (shellhelp2):1:1 at src/mongo/<span class="keyword">shell</span>/<span class="keyword">db</span>.js:643</span>
<span class="line">`</span>
</pre></td></tr></table></figure>

显然没权限，先auth：

<figure class="highlight stylus"><table><tr><td class="code"><pre><span class="line">db.<span class="function"><span class="title">auth</span><span class="params">(<span class="string">"bao"</span>,<span class="string">"12345678"</span>)</span></span></span>
<span class="line"><span class="number">1</span></span>
<span class="line">show collections</span>
<span class="line">news</span>
<span class="line">system<span class="class">.indexes</span></span>
<span class="line">wahaha</span>
</pre></td></tr></table></figure>

完毕！

**参考：**
Mongo Shell：[http://docs.mongodb.org/v2.2/tutorial/getting-started-with-the-mongo-shell](http://docs.mongodb.org/v2.2/tutorial/getting-started-with-the-mongo-shell)
Enable Access Control：[http://docs.mongodb.org/manual/tutorial/enable-authentication](http://docs.mongodb.org/manual/tutorial/enable-authentication)
Add a User to a Database：[http://docs.mongodb.org/manual/tutorial/add-user-to-database](http://docs.mongodb.org/manual/tutorial/add-user-to-database)
User Methods：[http://docs.mongodb.org/manual/reference/method/js-user-management](http://docs.mongodb.org/manual/reference/method/js-user-management)
Role Methods：[http://docs.mongodb.org/manual/reference/method/js-role-management](http://docs.mongodb.org/manual/reference/method/js-role-management)