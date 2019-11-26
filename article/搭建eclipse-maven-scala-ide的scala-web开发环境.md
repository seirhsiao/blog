title: 搭建eclipse+maven+scala-ide的scala web开发环境
tags:
  - eclipse
  - maven
  - scala-ide
  - scala
date: 2014-01-15 14:06:23
---

江湖传闻，scala开发的最佳利器乃 [JetBrains](http://www.jetbrains.com) 的神作 [IntelliJ IDEA](http://www.jetbrains.com/idea)，外加构建工具 [sbt](http://www.scala-sbt.org) 是也。

但因历史原因，项目组成员对 [Eclipse](http://www.eclipse.org/downloads)+[Maven](http://maven.apache.org)组合更为熟悉，为了快速实现项目原型，不增加不确定因素带来的风险，搭建一套 [Eclipse](http://www.eclipse.org/downloads)+[Maven](http://maven.apache.org)+[Scala-IDE](http://scala-ide.org) 的开发环境。

基本原则是，必须完全满足但不限于以下几点内容：

*   方便重构，方便调试，支持热部署。
*   可直接使用已有maven的本地和私服仓库。
*   可以无束缚的只用自己熟悉的语言编写代码。
*   可以快速混合编译scala+java代码，包括交叉引用的文件。

如果你有洁癖，可以自己下载[Eclipse](http://www.eclipse.org/downloads)，然后安装各种插件。但是可能会遇到插件依赖包版本冲突之类的问题，为了速度，我直接下载官方打包好的 [Scala-IDE](http://scala-ide.org/download/sdk.html)，有各种平台可供选择。

使用 [Git](http://git-scm.com) 管理项目源代码，需要安装 [EGit](http://www.eclipse.org/egit) 插件，Eclipse插件更新地址 [EGit Updates](http://download.eclipse.org/egit/updates)。

假设项目名称为 **feeling**，使用 JDK 1.7，Servlet 3.0，最终目录结构如下。
<figure class="highlight puppet"><table><tr><td class="code"><pre><span class="line">.</span>
<span class="line">├── .<span class="keyword">settings</span>                    <span class="comment">#eclipse工程目录</span></span>
<span class="line">├── .classpath                   <span class="comment">#eclipse classpath文件</span></span>
<span class="line">├── .<span class="literal">project</span>                     <span class="comment">#eclipse project文件</span></span>
<span class="line">├── src                          <span class="comment">#源代码</span></span>
<span class="line">|   ├── <span class="keyword">main</span>                     <span class="comment">#源代码主目录</span></span>
<span class="line">|   |   ├── java                 <span class="comment">#java代码</span></span>
<span class="line">|   |   ├── scala                <span class="comment">#scala代码</span></span>
<span class="line">|   |   ├── <span class="keyword">resources</span>            <span class="comment">#资源文件</span></span>
<span class="line">|   |   └── webapp               <span class="comment">#web主目录</span></span>
<span class="line">|   |       ├── <span class="constant">W</span>EB-<span class="constant">I</span>NF          <span class="comment">#WEB-INF目录</span></span>
<span class="line">|   |       |   └── web.xml      <span class="comment">#web.xml文件</span></span>
<span class="line">|   |       └── index.jsp        <span class="comment">#主页面</span></span>
<span class="line">|   └── test                     <span class="comment">#测试代码</span></span>
<span class="line">|       ├── java                 <span class="comment">#java测试代码</span></span>
<span class="line">|       ├── scala                <span class="comment">#scala测试代码</span></span>
<span class="line">|       └── <span class="keyword">resources</span>            <span class="comment">#测试资源文件</span></span>
<span class="line">├── .gitignore                   <span class="comment">#git忽略配置</span></span>
<span class="line">├── <span class="literal">target</span>                       <span class="comment">#编译输出目录</span></span>
<span class="line">├── <span class="constant">R</span>EADME.md                    <span class="comment">#markdown格式的说明文件</span></span>
<span class="line">└── pom.xml                      <span class="comment">#maven的pom文件</span></span>
</pre></td></tr></table></figure>

<a id="more"></a>

pom.xml文件
<figure class="highlight xml"><table><tr><td class="code"><pre><span class="line"><span class="tag">&lt;<span class="title">project</span> <span class="attribute">xmlns</span>=<span class="value">"http://maven.apache.org/POM/4.0.0"</span> <span class="attribute">xmlns:xsi</span>=<span class="value">"http://www.w3.org/2001/XMLSchema-instance"</span></span>
<span class="line">  <span class="attribute">xsi:schemaLocation</span>=<span class="value">"http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd"</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;<span class="title">modelVersion</span>&gt;</span>4.0.0<span class="tag">&lt;/<span class="title">modelVersion</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;<span class="title">groupId</span>&gt;</span>feeling<span class="tag">&lt;/<span class="title">groupId</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;<span class="title">artifactId</span>&gt;</span>feeling<span class="tag">&lt;/<span class="title">artifactId</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;<span class="title">version</span>&gt;</span>0.0.1<span class="tag">&lt;/<span class="title">version</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;<span class="title">packaging</span>&gt;</span>war<span class="tag">&lt;/<span class="title">packaging</span>&gt;</span></span>
<span class="line"></span>
<span class="line">  <span class="comment">&lt;!-- &lt;name&gt;$&#123;project.artifactId&#125;&lt;/name&gt; --&gt;</span></span>
<span class="line">  <span class="tag">&lt;<span class="title">name</span>&gt;</span>feeling<span class="tag">&lt;/<span class="title">name</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;<span class="title">description</span>&gt;</span>our wonderfully feeling application<span class="tag">&lt;/<span class="title">description</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;<span class="title">url</span>&gt;</span>http://feeling.com<span class="tag">&lt;/<span class="title">url</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;<span class="title">inceptionYear</span>&gt;</span>2014<span class="tag">&lt;/<span class="title">inceptionYear</span>&gt;</span></span>
<span class="line"></span>
<span class="line">  <span class="tag">&lt;<span class="title">organization</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;<span class="title">name</span>&gt;</span>feeling<span class="tag">&lt;/<span class="title">name</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;<span class="title">url</span>&gt;</span>http://feeling.com<span class="tag">&lt;/<span class="title">url</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;/<span class="title">organization</span>&gt;</span></span>
<span class="line"></span>
<span class="line">  <span class="tag">&lt;<span class="title">licenses</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;<span class="title">license</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">name</span>&gt;</span>The Apache Software License, Version 2.0<span class="tag">&lt;/<span class="title">name</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">url</span>&gt;</span>http://www.apache.org/licenses/LICENSE-2.0.txt<span class="tag">&lt;/<span class="title">url</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">distribution</span>&gt;</span>repo<span class="tag">&lt;/<span class="title">distribution</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;/<span class="title">license</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;/<span class="title">licenses</span>&gt;</span></span>
<span class="line"></span>
<span class="line">  <span class="tag">&lt;<span class="title">developers</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;<span class="title">developer</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">id</span>&gt;</span>bruce<span class="tag">&lt;/<span class="title">id</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">name</span>&gt;</span>bruce sha<span class="tag">&lt;/<span class="title">name</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">url</span>&gt;</span>http://bruce-sha.github.io<span class="tag">&lt;/<span class="title">url</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">email</span>&gt;</span>bu.ru@qq.com<span class="tag">&lt;/<span class="title">email</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;/<span class="title">developer</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;/<span class="title">developers</span>&gt;</span></span>
<span class="line"></span>
<span class="line">  <span class="tag">&lt;<span class="title">scm</span>&gt;</span></span>
<span class="line">  	<span class="tag">&lt;<span class="title">connection</span>&gt;</span>http://17.20.13.23/scm/git/feeling<span class="tag">&lt;/<span class="title">connection</span>&gt;</span></span>
<span class="line">  	<span class="tag">&lt;<span class="title">developerConnection</span>&gt;</span>http://17.20.13.23/scm/git/feeling<span class="tag">&lt;/<span class="title">developerConnection</span>&gt;</span></span>
<span class="line">  	<span class="tag">&lt;<span class="title">url</span>&gt;</span>http://17.20.13.23<span class="tag">&lt;/<span class="title">url</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;/<span class="title">scm</span>&gt;</span></span>
<span class="line"></span>
<span class="line">  <span class="tag">&lt;<span class="title">properties</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;<span class="title">scala.version</span>&gt;</span>2.10.3<span class="tag">&lt;/<span class="title">scala.version</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;<span class="title">maven.compiler.source</span>&gt;</span>1.7<span class="tag">&lt;/<span class="title">maven.compiler.source</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;<span class="title">maven.compiler.target</span>&gt;</span>1.7<span class="tag">&lt;/<span class="title">maven.compiler.target</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;<span class="title">encoding</span>&gt;</span>UTF-8<span class="tag">&lt;/<span class="title">encoding</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;/<span class="title">properties</span>&gt;</span></span>
<span class="line"></span>
<span class="line">  <span class="comment">&lt;!-- 个性化开发 --&gt;</span></span>
<span class="line">  <span class="tag">&lt;<span class="title">profiles</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;<span class="title">profile</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">id</span>&gt;</span>dev<span class="tag">&lt;/<span class="title">id</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">activation</span>&gt;</span></span>
<span class="line">        <span class="tag">&lt;<span class="title">activeByDefault</span>&gt;</span>true<span class="tag">&lt;/<span class="title">activeByDefault</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;/<span class="title">activation</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">properties</span>&gt;</span></span>
<span class="line">        <span class="tag">&lt;<span class="title">build.param</span>&gt;</span>this is dev<span class="tag">&lt;/<span class="title">build.param</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;/<span class="title">properties</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;/<span class="title">profile</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;<span class="title">profile</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">id</span>&gt;</span>release<span class="tag">&lt;/<span class="title">id</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">activation</span>&gt;</span></span>
<span class="line">        <span class="tag">&lt;<span class="title">activeByDefault</span>&gt;</span>false<span class="tag">&lt;/<span class="title">activeByDefault</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;/<span class="title">activation</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">properties</span>&gt;</span></span>
<span class="line">        <span class="tag">&lt;<span class="title">build.param</span>&gt;</span>this is relase<span class="tag">&lt;/<span class="title">build.param</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;/<span class="title">properties</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;/<span class="title">profile</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;/<span class="title">profiles</span>&gt;</span></span>
<span class="line"></span>
<span class="line">  <span class="tag">&lt;<span class="title">dependencies</span>&gt;</span></span>
<span class="line"></span>
<span class="line">    <span class="comment">&lt;!-- google --&gt;</span></span>
<span class="line">    <span class="tag">&lt;<span class="title">dependency</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">groupId</span>&gt;</span>com.google.guava<span class="tag">&lt;/<span class="title">groupId</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">artifactId</span>&gt;</span>guava<span class="tag">&lt;/<span class="title">artifactId</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">version</span>&gt;</span>15.0<span class="tag">&lt;/<span class="title">version</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;/<span class="title">dependency</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;<span class="title">dependency</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">groupId</span>&gt;</span>com.google.inject<span class="tag">&lt;/<span class="title">groupId</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">artifactId</span>&gt;</span>guice<span class="tag">&lt;/<span class="title">artifactId</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">version</span>&gt;</span>3.0<span class="tag">&lt;/<span class="title">version</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;/<span class="title">dependency</span>&gt;</span></span>
<span class="line"></span>
<span class="line">    <span class="comment">&lt;!-- servlet --&gt;</span></span>
<span class="line">    <span class="tag">&lt;<span class="title">dependency</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">groupId</span>&gt;</span>javax.servlet<span class="tag">&lt;/<span class="title">groupId</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">artifactId</span>&gt;</span>javax.servlet-api<span class="tag">&lt;/<span class="title">artifactId</span>&gt;</span></span>
<span class="line">      <span class="comment">&lt;!-- &lt;version&gt;2.5&lt;/version&gt; --&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">version</span>&gt;</span>3.0.1<span class="tag">&lt;/<span class="title">version</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">scope</span>&gt;</span>provided<span class="tag">&lt;/<span class="title">scope</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;/<span class="title">dependency</span>&gt;</span></span>
<span class="line"></span>
<span class="line">    <span class="comment">&lt;!-- &lt;dependency&gt; --&gt;</span></span>
<span class="line">    <span class="comment">&lt;!-- &lt;groupId&gt;javax.servlet&lt;/groupId&gt; --&gt;</span></span>
<span class="line">    <span class="comment">&lt;!-- &lt;artifactId&gt;jsp-api&lt;/artifactId&gt; --&gt;</span></span>
<span class="line">    <span class="comment">&lt;!-- &lt;version&gt;2.0&lt;/version&gt; --&gt;</span></span>
<span class="line">    <span class="comment">&lt;!-- &lt;scope&gt;provided&lt;/scope&gt; --&gt;</span></span>
<span class="line">    <span class="comment">&lt;!-- &lt;/dependency&gt; --&gt;</span></span>
<span class="line"></span>
<span class="line">    <span class="comment">&lt;!-- scala --&gt;</span></span>
<span class="line">    <span class="tag">&lt;<span class="title">dependency</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">groupId</span>&gt;</span>org.scala-lang<span class="tag">&lt;/<span class="title">groupId</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">artifactId</span>&gt;</span>scala-library<span class="tag">&lt;/<span class="title">artifactId</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">version</span>&gt;</span>$&#123;scala.version&#125;<span class="tag">&lt;/<span class="title">version</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;/<span class="title">dependency</span>&gt;</span></span>
<span class="line"></span>
<span class="line">    <span class="comment">&lt;!-- test --&gt;</span></span>
<span class="line">    <span class="tag">&lt;<span class="title">dependency</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">groupId</span>&gt;</span>junit<span class="tag">&lt;/<span class="title">groupId</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">artifactId</span>&gt;</span>junit<span class="tag">&lt;/<span class="title">artifactId</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">version</span>&gt;</span>4.11<span class="tag">&lt;/<span class="title">version</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">scope</span>&gt;</span>test<span class="tag">&lt;/<span class="title">scope</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;/<span class="title">dependency</span>&gt;</span></span>
<span class="line"></span>
<span class="line">    <span class="comment">&lt;!-- 其他包不再一一描述 --&gt;</span>    </span>
<span class="line">    <span class="comment">&lt;!-- log --&gt;</span></span>
<span class="line">    <span class="comment">&lt;!-- json --&gt;</span></span>
<span class="line">    <span class="comment">&lt;!-- mongodb --&gt;</span></span>
<span class="line">    <span class="comment">&lt;!-- quartz --&gt;</span></span>
<span class="line"></span>
<span class="line">  <span class="tag">&lt;/<span class="title">dependencies</span>&gt;</span></span>
<span class="line"></span>
<span class="line">  <span class="tag">&lt;<span class="title">build</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;<span class="title">finalName</span>&gt;</span>feeling<span class="tag">&lt;/<span class="title">finalName</span>&gt;</span></span>
<span class="line"></span>
<span class="line">    <span class="comment">&lt;!-- 必须要，资源文件中占位符被profile替换的关键配置 --&gt;</span></span>
<span class="line">    <span class="tag">&lt;<span class="title">resources</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">resource</span>&gt;</span></span>
<span class="line">        <span class="tag">&lt;<span class="title">directory</span>&gt;</span>src/main/resources<span class="tag">&lt;/<span class="title">directory</span>&gt;</span></span>
<span class="line">        <span class="tag">&lt;<span class="title">includes</span>&gt;</span></span>
<span class="line">          <span class="tag">&lt;<span class="title">include</span>&gt;</span>*.*<span class="tag">&lt;/<span class="title">include</span>&gt;</span></span>
<span class="line">        <span class="tag">&lt;/<span class="title">includes</span>&gt;</span></span>
<span class="line">        <span class="tag">&lt;<span class="title">filtering</span>&gt;</span>true<span class="tag">&lt;/<span class="title">filtering</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;/<span class="title">resource</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;/<span class="title">resources</span>&gt;</span></span>
<span class="line"></span>
<span class="line">    <span class="comment">&lt;!-- 必须干掉，否则不编译src/main/java下的代码 --&gt;</span></span>
<span class="line">    <span class="comment">&lt;!-- &lt;sourceDirectory&gt;src/main/scala&lt;/sourceDirectory&gt; --&gt;</span></span>
<span class="line">    <span class="comment">&lt;!-- &lt;testSourceDirectory&gt;src/test/scala&lt;/testSourceDirectory&gt; --&gt;</span></span>
<span class="line">    <span class="tag">&lt;<span class="title">plugins</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">plugin</span>&gt;</span></span>
<span class="line">        <span class="comment">&lt;!-- see http://davidb.github.com/scala-maven-plugin --&gt;</span></span>
<span class="line">        <span class="tag">&lt;<span class="title">groupId</span>&gt;</span>net.alchim31.maven<span class="tag">&lt;/<span class="title">groupId</span>&gt;</span></span>
<span class="line">        <span class="tag">&lt;<span class="title">artifactId</span>&gt;</span>scala-maven-plugin<span class="tag">&lt;/<span class="title">artifactId</span>&gt;</span></span>
<span class="line">        <span class="tag">&lt;<span class="title">version</span>&gt;</span>3.1.6<span class="tag">&lt;/<span class="title">version</span>&gt;</span></span>
<span class="line">        <span class="comment">&lt;!-- 必须要，否则不能混合编译交叉引用文件 --&gt;</span></span>
<span class="line">        <span class="tag">&lt;<span class="title">executions</span>&gt;</span></span>
<span class="line">          <span class="tag">&lt;<span class="title">execution</span>&gt;</span></span>
<span class="line">            <span class="tag">&lt;<span class="title">id</span>&gt;</span>scala-compile-first<span class="tag">&lt;/<span class="title">id</span>&gt;</span></span>
<span class="line">            <span class="tag">&lt;<span class="title">phase</span>&gt;</span>process-resources<span class="tag">&lt;/<span class="title">phase</span>&gt;</span></span>
<span class="line">            <span class="tag">&lt;<span class="title">goals</span>&gt;</span></span>
<span class="line">              <span class="tag">&lt;<span class="title">goal</span>&gt;</span>add-source<span class="tag">&lt;/<span class="title">goal</span>&gt;</span></span>
<span class="line">              <span class="tag">&lt;<span class="title">goal</span>&gt;</span>compile<span class="tag">&lt;/<span class="title">goal</span>&gt;</span></span>
<span class="line">            <span class="tag">&lt;/<span class="title">goals</span>&gt;</span></span>
<span class="line">          <span class="tag">&lt;/<span class="title">execution</span>&gt;</span></span>
<span class="line">          <span class="tag">&lt;<span class="title">execution</span>&gt;</span></span>
<span class="line">            <span class="tag">&lt;<span class="title">id</span>&gt;</span>scala-test-compile<span class="tag">&lt;/<span class="title">id</span>&gt;</span></span>
<span class="line">            <span class="tag">&lt;<span class="title">phase</span>&gt;</span>process-test-resources<span class="tag">&lt;/<span class="title">phase</span>&gt;</span></span>
<span class="line">            <span class="tag">&lt;<span class="title">goals</span>&gt;</span></span>
<span class="line">              <span class="tag">&lt;<span class="title">goal</span>&gt;</span>testCompile<span class="tag">&lt;/<span class="title">goal</span>&gt;</span></span>
<span class="line">            <span class="tag">&lt;/<span class="title">goals</span>&gt;</span></span>
<span class="line">          <span class="tag">&lt;/<span class="title">execution</span>&gt;</span></span>
<span class="line">        <span class="tag">&lt;/<span class="title">executions</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;/<span class="title">plugin</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">plugin</span>&gt;</span></span>
<span class="line">        <span class="tag">&lt;<span class="title">groupId</span>&gt;</span>org.apache.maven.plugins<span class="tag">&lt;/<span class="title">groupId</span>&gt;</span></span>
<span class="line">        <span class="tag">&lt;<span class="title">artifactId</span>&gt;</span>maven-surefire-plugin<span class="tag">&lt;/<span class="title">artifactId</span>&gt;</span></span>
<span class="line">        <span class="tag">&lt;<span class="title">version</span>&gt;</span>2.13<span class="tag">&lt;/<span class="title">version</span>&gt;</span></span>
<span class="line">        <span class="tag">&lt;<span class="title">configuration</span>&gt;</span></span>
<span class="line">          <span class="tag">&lt;<span class="title">useFile</span>&gt;</span>false<span class="tag">&lt;/<span class="title">useFile</span>&gt;</span></span>
<span class="line">          <span class="tag">&lt;<span class="title">disableXmlReport</span>&gt;</span>true<span class="tag">&lt;/<span class="title">disableXmlReport</span>&gt;</span></span>
<span class="line">          <span class="comment">&lt;!-- If you have classpath issue like NoDefClassError,... --&gt;</span></span>
<span class="line">          <span class="comment">&lt;!-- useManifestOnlyJar&gt;false&lt;/useManifestOnlyJar --&gt;</span></span>
<span class="line">          <span class="tag">&lt;<span class="title">includes</span>&gt;</span></span>
<span class="line">            <span class="tag">&lt;<span class="title">include</span>&gt;</span>**/*Test.*<span class="tag">&lt;/<span class="title">include</span>&gt;</span></span>
<span class="line">            <span class="tag">&lt;<span class="title">include</span>&gt;</span>**/*Suite.*<span class="tag">&lt;/<span class="title">include</span>&gt;</span></span>
<span class="line">          <span class="tag">&lt;/<span class="title">includes</span>&gt;</span></span>
<span class="line">        <span class="tag">&lt;/<span class="title">configuration</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;/<span class="title">plugin</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">plugin</span>&gt;</span></span>
<span class="line">        <span class="tag">&lt;<span class="title">groupId</span>&gt;</span>org.apache.maven.plugins<span class="tag">&lt;/<span class="title">groupId</span>&gt;</span></span>
<span class="line">        <span class="tag">&lt;<span class="title">artifactId</span>&gt;</span>maven-war-plugin<span class="tag">&lt;/<span class="title">artifactId</span>&gt;</span></span>
<span class="line">        <span class="tag">&lt;<span class="title">version</span>&gt;</span>2.4<span class="tag">&lt;/<span class="title">version</span>&gt;</span></span>
<span class="line">        <span class="tag">&lt;<span class="title">configuration</span>&gt;</span></span>
<span class="line">          <span class="comment">&lt;!-- 移除web.xml的依赖，Servlet 3.0可以不要web.xml文件 --&gt;</span></span>
<span class="line">          <span class="tag">&lt;<span class="title">failOnMissingWebXml</span>&gt;</span>false<span class="tag">&lt;/<span class="title">failOnMissingWebXml</span>&gt;</span></span>
<span class="line">        <span class="tag">&lt;/<span class="title">configuration</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;/<span class="title">plugin</span>&gt;</span></span>
<span class="line"></span>
<span class="line">      <span class="comment">&lt;!-- jetty6，不支持servlet3 --&gt;</span></span>
<span class="line">      <span class="comment">&lt;!-- &lt;plugin&gt; --&gt;</span></span>
<span class="line">      <span class="comment">&lt;!-- &lt;groupId&gt;org.mortbay.jetty&lt;/groupId&gt; --&gt;</span></span>
<span class="line">      <span class="comment">&lt;!-- &lt;artifactId&gt;maven-jetty-plugin&lt;/artifactId&gt; --&gt;</span></span>
<span class="line">      <span class="comment">&lt;!-- &lt;version&gt;6.1.26&lt;/version&gt; --&gt;</span></span>
<span class="line">      <span class="comment">&lt;!-- &lt;configuration&gt; --&gt;</span></span>
<span class="line">      <span class="comment">&lt;!-- &lt;scanIntervalSeconds&gt;10&lt;/scanIntervalSeconds&gt; --&gt;</span></span>
<span class="line">      <span class="comment">&lt;!-- &lt;stopKey&gt;foo&lt;/stopKey&gt; --&gt;</span></span>
<span class="line">      <span class="comment">&lt;!-- &lt;stopPort&gt;9999&lt;/stopPort&gt; --&gt;</span></span>
<span class="line">      <span class="comment">&lt;!-- &lt;/configuration&gt; --&gt;</span></span>
<span class="line">      <span class="comment">&lt;!-- &lt;executions&gt; --&gt;</span></span>
<span class="line">      <span class="comment">&lt;!-- &lt;execution&gt; --&gt;</span></span>
<span class="line">      <span class="comment">&lt;!-- &lt;id&gt;start-jetty&lt;/id&gt; --&gt;</span></span>
<span class="line">      <span class="comment">&lt;!-- &lt;phase&gt;pre-integration-test&lt;/phase&gt; --&gt;</span></span>
<span class="line">      <span class="comment">&lt;!-- &lt;goals&gt; --&gt;</span></span>
<span class="line">      <span class="comment">&lt;!-- &lt;goal&gt;run&lt;/goal&gt; --&gt;</span></span>
<span class="line">      <span class="comment">&lt;!-- &lt;/goals&gt; --&gt;</span></span>
<span class="line">      <span class="comment">&lt;!-- &lt;configuration&gt; --&gt;</span></span>
<span class="line">      <span class="comment">&lt;!-- &lt;scanIntervalSeconds&gt;0&lt;/scanIntervalSeconds&gt; --&gt;</span></span>
<span class="line">      <span class="comment">&lt;!-- &lt;daemon&gt;true&lt;/daemon&gt; --&gt;</span></span>
<span class="line">      <span class="comment">&lt;!-- &lt;/configuration&gt; --&gt;</span></span>
<span class="line">      <span class="comment">&lt;!-- &lt;/execution&gt; --&gt;</span></span>
<span class="line">      <span class="comment">&lt;!-- &lt;execution&gt; --&gt;</span></span>
<span class="line">      <span class="comment">&lt;!-- &lt;id&gt;stop-jetty&lt;/id&gt; --&gt;</span></span>
<span class="line">      <span class="comment">&lt;!-- &lt;phase&gt;post-integration-test&lt;/phase&gt; --&gt;</span></span>
<span class="line">      <span class="comment">&lt;!-- &lt;goals&gt; --&gt;</span></span>
<span class="line">      <span class="comment">&lt;!-- &lt;goal&gt;stop&lt;/goal&gt; --&gt;</span></span>
<span class="line">      <span class="comment">&lt;!-- &lt;/goals&gt; --&gt;</span></span>
<span class="line">      <span class="comment">&lt;!-- &lt;/execution&gt; --&gt;</span></span>
<span class="line">      <span class="comment">&lt;!-- &lt;/executions&gt; --&gt;</span></span>
<span class="line">      <span class="comment">&lt;!-- &lt;/plugin&gt; --&gt;</span></span>
<span class="line"></span>
<span class="line">      <span class="comment">&lt;!-- tomcat7:run 注意tomcat:run跑的是6，不支持servlet3 --&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">plugin</span>&gt;</span></span>
<span class="line">        <span class="comment">&lt;!-- http://tomcat.apache.org/maven-plugin-2.0/tomcat7-maven-plugin --&gt;</span></span>
<span class="line">        <span class="tag">&lt;<span class="title">groupId</span>&gt;</span>org.apache.tomcat.maven<span class="tag">&lt;/<span class="title">groupId</span>&gt;</span></span>
<span class="line">        <span class="tag">&lt;<span class="title">artifactId</span>&gt;</span>tomcat7-maven-plugin<span class="tag">&lt;/<span class="title">artifactId</span>&gt;</span></span>
<span class="line">        <span class="tag">&lt;<span class="title">version</span>&gt;</span>2.2<span class="tag">&lt;/<span class="title">version</span>&gt;</span></span>
<span class="line">        <span class="tag">&lt;<span class="title">configuration</span>&gt;</span></span>
<span class="line">          <span class="tag">&lt;<span class="title">path</span>&gt;</span>/<span class="tag">&lt;/<span class="title">path</span>&gt;</span></span>
<span class="line">          <span class="tag">&lt;<span class="title">port</span>&gt;</span>80<span class="tag">&lt;/<span class="title">port</span>&gt;</span></span>
<span class="line">        <span class="tag">&lt;/<span class="title">configuration</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;/<span class="title">plugin</span>&gt;</span></span>
<span class="line"></span>
<span class="line">      <span class="comment">&lt;!-- jetty:run --&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">plugin</span>&gt;</span></span>
<span class="line">        <span class="comment">&lt;!-- http://wiki.eclipse.org/Jetty/Feature/Jetty_Maven_Plugin --&gt;</span></span>
<span class="line">        <span class="tag">&lt;<span class="title">groupId</span>&gt;</span>org.mortbay.jetty<span class="tag">&lt;/<span class="title">groupId</span>&gt;</span></span>
<span class="line">        <span class="comment">&lt;!-- &lt;artifactId&gt;maven-jetty-plugin&lt;/artifactId&gt; 这是jetty6 不支持servlet3 --&gt;</span></span>
<span class="line">        <span class="tag">&lt;<span class="title">artifactId</span>&gt;</span>jetty-maven-plugin<span class="tag">&lt;/<span class="title">artifactId</span>&gt;</span></span>
<span class="line">        <span class="tag">&lt;<span class="title">version</span>&gt;</span>8.1.13.v20130916<span class="tag">&lt;/<span class="title">version</span>&gt;</span></span>
<span class="line">        <span class="tag">&lt;<span class="title">configuration</span>&gt;</span></span>
<span class="line">          <span class="tag">&lt;<span class="title">stopPort</span>&gt;</span>9966<span class="tag">&lt;/<span class="title">stopPort</span>&gt;</span></span>
<span class="line">          <span class="tag">&lt;<span class="title">stopKey</span>&gt;</span>foo<span class="tag">&lt;/<span class="title">stopKey</span>&gt;</span></span>
<span class="line">          <span class="tag">&lt;<span class="title">scanIntervalSeconds</span>&gt;</span>0<span class="tag">&lt;/<span class="title">scanIntervalSeconds</span>&gt;</span></span>
<span class="line">          <span class="tag">&lt;<span class="title">connectors</span>&gt;</span></span>
<span class="line">            <span class="tag">&lt;<span class="title">connector</span> <span class="attribute">implementation</span>=<span class="value">"org.eclipse.jetty.server.nio.SelectChannelConnector"</span>&gt;</span></span>
<span class="line">              <span class="tag">&lt;<span class="title">port</span>&gt;</span>80<span class="tag">&lt;/<span class="title">port</span>&gt;</span></span>
<span class="line">              <span class="tag">&lt;<span class="title">maxIdleTime</span>&gt;</span>60000<span class="tag">&lt;/<span class="title">maxIdleTime</span>&gt;</span></span>
<span class="line">            <span class="tag">&lt;/<span class="title">connector</span>&gt;</span></span>
<span class="line">          <span class="tag">&lt;/<span class="title">connectors</span>&gt;</span></span>
<span class="line">          <span class="tag">&lt;<span class="title">webAppConfig</span>&gt;</span></span>
<span class="line">            <span class="tag">&lt;<span class="title">contextPath</span>&gt;</span>/<span class="tag">&lt;/<span class="title">contextPath</span>&gt;</span></span>
<span class="line">          <span class="tag">&lt;/<span class="title">webAppConfig</span>&gt;</span></span>
<span class="line">        <span class="tag">&lt;/<span class="title">configuration</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;/<span class="title">plugin</span>&gt;</span></span>
<span class="line"></span>
<span class="line">    <span class="tag">&lt;/<span class="title">plugins</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;/<span class="title">build</span>&gt;</span></span>
<span class="line"><span class="tag">&lt;/<span class="title">project</span>&gt;</span></span>
</pre></td></tr></table></figure>

web.xml

<figure class="highlight xml"><table><tr><td class="code"><pre><span class="line"><span class="pi">&lt;?xml version="1.0" encoding="UTF-8"?&gt;</span></span>
<span class="line"><span class="comment">&lt;!-- &lt;web-app --&gt;</span></span>
<span class="line"><span class="comment">&lt;!-- xmlns="http://java.sun.com/xml/ns/javaee" --&gt;</span></span>
<span class="line"><span class="comment">&lt;!-- xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" --&gt;</span></span>
<span class="line"><span class="comment">&lt;!-- xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd" --&gt;</span></span>
<span class="line"><span class="comment">&lt;!-- version="2.5" --&gt;</span></span>
<span class="line"><span class="comment">&lt;!-- &gt; --&gt;</span></span>
<span class="line"><span class="tag">&lt;<span class="title">web-app</span> <span class="attribute">xmlns:xsi</span>=<span class="value">"http://www.w3.org/2001/XMLSchema-instance"</span></span>
<span class="line">  <span class="attribute">xmlns</span>=<span class="value">"http://java.sun.com/xml/ns/javaee"</span></span>
<span class="line">  <span class="attribute">xsi:schemaLocation</span>=<span class="value">"http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd"</span></span>
<span class="line">  <span class="attribute">id</span>=<span class="value">"WebApp_ID"</span> <span class="attribute">version</span>=<span class="value">"3.0"</span>&gt;</span></span>
<span class="line"></span>
<span class="line">  <span class="tag">&lt;<span class="title">display-name</span>&gt;</span>feeling<span class="tag">&lt;/<span class="title">display-name</span>&gt;</span></span>
<span class="line"></span>
<span class="line">  <span class="comment">&lt;!--   &lt;servlet&gt; --&gt;</span></span>
<span class="line">  <span class="comment">&lt;!--   &lt;servlet-name&gt;feeling&lt;/servlet-name&gt; --&gt;</span></span>
<span class="line">  <span class="comment">&lt;!--   &lt;servlet-class&gt;feelings.service.FeelingService&lt;/servlet-class&gt; --&gt;</span></span>
<span class="line">  <span class="comment">&lt;!--   &lt;/servlet&gt; --&gt;</span></span>
<span class="line"></span>
<span class="line">  <span class="comment">&lt;!--   &lt;servlet-mapping&gt; --&gt;</span></span>
<span class="line">  <span class="comment">&lt;!--   &lt;servlet-name&gt;feeling&lt;/servlet-name&gt; --&gt;</span></span>
<span class="line">  <span class="comment">&lt;!--   &lt;url-pattern&gt;/feeling&lt;/url-pattern&gt; --&gt;</span></span>
<span class="line">  <span class="comment">&lt;!--   &lt;/servlet-mapping&gt; --&gt;</span></span>
<span class="line">  </span>
<span class="line">  <span class="tag">&lt;<span class="title">welcome-file-list</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;<span class="title">welcome-file</span>&gt;</span>index.html<span class="tag">&lt;/<span class="title">welcome-file</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;<span class="title">welcome-file</span>&gt;</span>index.htm<span class="tag">&lt;/<span class="title">welcome-file</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;<span class="title">welcome-file</span>&gt;</span>index.jsp<span class="tag">&lt;/<span class="title">welcome-file</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;<span class="title">welcome-file</span>&gt;</span>default.html<span class="tag">&lt;/<span class="title">welcome-file</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;<span class="title">welcome-file</span>&gt;</span>default.htm<span class="tag">&lt;/<span class="title">welcome-file</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;<span class="title">welcome-file</span>&gt;</span>default.jsp<span class="tag">&lt;/<span class="title">welcome-file</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;/<span class="title">welcome-file-list</span>&gt;</span></span>
<span class="line">  </span>
<span class="line"><span class="tag">&lt;/<span class="title">web-app</span>&gt;</span></span>
</pre></td></tr></table></figure>

.project文件：
<figure class="highlight xml"><table><tr><td class="code"><pre><span class="line"><span class="pi">&lt;?xml version="1.0" encoding="UTF-8"?&gt;</span></span>
<span class="line"><span class="tag">&lt;<span class="title">projectDescription</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;<span class="title">name</span>&gt;</span>feeling<span class="tag">&lt;/<span class="title">name</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;<span class="title">comment</span>&gt;</span><span class="tag">&lt;/<span class="title">comment</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;<span class="title">projects</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;/<span class="title">projects</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;<span class="title">buildSpec</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;<span class="title">buildCommand</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">name</span>&gt;</span>org.scala-ide.sdt.core.scalabuilder<span class="tag">&lt;/<span class="title">name</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">arguments</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;/<span class="title">arguments</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;/<span class="title">buildCommand</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;<span class="title">buildCommand</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">name</span>&gt;</span>org.eclipse.m2e.core.maven2Builder<span class="tag">&lt;/<span class="title">name</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">arguments</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;/<span class="title">arguments</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;/<span class="title">buildCommand</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;/<span class="title">buildSpec</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;<span class="title">natures</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;<span class="title">nature</span>&gt;</span>org.scala-ide.sdt.core.scalanature<span class="tag">&lt;/<span class="title">nature</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;<span class="title">nature</span>&gt;</span>org.eclipse.jdt.core.javanature<span class="tag">&lt;/<span class="title">nature</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;<span class="title">nature</span>&gt;</span>org.eclipse.m2e.core.maven2Nature<span class="tag">&lt;/<span class="title">nature</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;/<span class="title">natures</span>&gt;</span></span>
<span class="line"><span class="tag">&lt;/<span class="title">projectDescription</span>&gt;</span></span>
</pre></td></tr></table></figure>

.classpath文件：
<figure class="highlight xml"><table><tr><td class="code"><pre><span class="line"><span class="pi">&lt;?xml version="1.0" encoding="UTF-8"?&gt;</span></span>
<span class="line"><span class="tag">&lt;<span class="title">classpath</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;<span class="title">classpathentry</span> <span class="attribute">kind</span>=<span class="value">"src"</span> <span class="attribute">output</span>=<span class="value">"target/classes"</span> <span class="attribute">path</span>=<span class="value">"src/main/java"</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;<span class="title">attributes</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">attribute</span> <span class="attribute">name</span>=<span class="value">"optional"</span> <span class="attribute">value</span>=<span class="value">"true"</span>/&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">attribute</span> <span class="attribute">name</span>=<span class="value">"maven.pomderived"</span> <span class="attribute">value</span>=<span class="value">"true"</span>/&gt;</span></span>
<span class="line">    <span class="tag">&lt;/<span class="title">attributes</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;/<span class="title">classpathentry</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;<span class="title">classpathentry</span> <span class="attribute">kind</span>=<span class="value">"src"</span> <span class="attribute">output</span>=<span class="value">"target/classes"</span> <span class="attribute">path</span>=<span class="value">"src/main/scala"</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;<span class="title">attributes</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">attribute</span> <span class="attribute">name</span>=<span class="value">"optional"</span> <span class="attribute">value</span>=<span class="value">"true"</span>/&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">attribute</span> <span class="attribute">name</span>=<span class="value">"maven.pomderived"</span> <span class="attribute">value</span>=<span class="value">"true"</span>/&gt;</span></span>
<span class="line">    <span class="tag">&lt;/<span class="title">attributes</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;/<span class="title">classpathentry</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;<span class="title">classpathentry</span> <span class="attribute">including</span>=<span class="value">"**/*.java"</span> <span class="attribute">kind</span>=<span class="value">"src"</span> <span class="attribute">path</span>=<span class="value">"src/main/resources"</span>/&gt;</span></span>
<span class="line">  <span class="tag">&lt;<span class="title">classpathentry</span> <span class="attribute">kind</span>=<span class="value">"src"</span> <span class="attribute">output</span>=<span class="value">"target/test-classes"</span> <span class="attribute">path</span>=<span class="value">"src/test/java"</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;<span class="title">attributes</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">attribute</span> <span class="attribute">name</span>=<span class="value">"optional"</span> <span class="attribute">value</span>=<span class="value">"true"</span>/&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">attribute</span> <span class="attribute">name</span>=<span class="value">"maven.pomderived"</span> <span class="attribute">value</span>=<span class="value">"true"</span>/&gt;</span></span>
<span class="line">    <span class="tag">&lt;/<span class="title">attributes</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;/<span class="title">classpathentry</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;<span class="title">classpathentry</span> <span class="attribute">kind</span>=<span class="value">"src"</span> <span class="attribute">output</span>=<span class="value">"target/test-classes"</span> <span class="attribute">path</span>=<span class="value">"src/test/scala"</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;<span class="title">attributes</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">attribute</span> <span class="attribute">name</span>=<span class="value">"optional"</span> <span class="attribute">value</span>=<span class="value">"true"</span>/&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">attribute</span> <span class="attribute">name</span>=<span class="value">"maven.pomderived"</span> <span class="attribute">value</span>=<span class="value">"true"</span>/&gt;</span></span>
<span class="line">    <span class="tag">&lt;/<span class="title">attributes</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;/<span class="title">classpathentry</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;<span class="title">classpathentry</span> <span class="attribute">including</span>=<span class="value">"**/*.java"</span> <span class="attribute">kind</span>=<span class="value">"src"</span> <span class="attribute">path</span>=<span class="value">"src/test/resources"</span>/&gt;</span></span>
<span class="line">  <span class="tag">&lt;<span class="title">classpathentry</span> <span class="attribute">kind</span>=<span class="value">"con"</span> <span class="attribute">path</span>=<span class="value">"org.scala-ide.sdt.launching.SCALA_CONTAINER"</span>/&gt;</span></span>
<span class="line">  <span class="tag">&lt;<span class="title">classpathentry</span> <span class="attribute">kind</span>=<span class="value">"con"</span> <span class="attribute">path</span>=<span class="value">"org.eclipse.jdt.launching.JRE_CONTAINER/org.eclipse.jdt.internal.debug.ui.launcher.StandardVMType/JavaSE-1.7"</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;<span class="title">attributes</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">attribute</span> <span class="attribute">name</span>=<span class="value">"maven.pomderived"</span> <span class="attribute">value</span>=<span class="value">"true"</span>/&gt;</span></span>
<span class="line">    <span class="tag">&lt;/<span class="title">attributes</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;/<span class="title">classpathentry</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;<span class="title">classpathentry</span> <span class="attribute">kind</span>=<span class="value">"con"</span> <span class="attribute">path</span>=<span class="value">"org.eclipse.m2e.MAVEN2_CLASSPATH_CONTAINER"</span>&gt;</span></span>
<span class="line">    <span class="tag">&lt;<span class="title">attributes</span>&gt;</span></span>
<span class="line">      <span class="tag">&lt;<span class="title">attribute</span> <span class="attribute">name</span>=<span class="value">"maven.pomderived"</span> <span class="attribute">value</span>=<span class="value">"true"</span>/&gt;</span></span>
<span class="line">    <span class="tag">&lt;/<span class="title">attributes</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;/<span class="title">classpathentry</span>&gt;</span></span>
<span class="line">  <span class="tag">&lt;<span class="title">classpathentry</span> <span class="attribute">kind</span>=<span class="value">"output"</span> <span class="attribute">path</span>=<span class="value">"target/classes"</span>/&gt;</span></span>
<span class="line"><span class="tag">&lt;/<span class="title">classpath</span>&gt;</span></span>
</pre></td></tr></table></figure>