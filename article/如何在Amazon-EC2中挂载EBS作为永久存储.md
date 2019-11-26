title: 如何在Amazon EC2中挂载EBS作为永久存储
tags:
  - ebs
  - ec2
  - cloud
date: 2014-01-06 11:26:38
---

如何在Amazon AWS上申请EC2不再多说，很多前辈给出了教程，本文只说如何挂载那免费的30G EBS。我申请的一年的免费的32位Red Hat Enterprise Linux，详细参数：

<figure class="highlight scala"><table><tr><td class="code"><pre><span class="line"><span class="type">Red</span> <span class="type">Hat</span> <span class="type">Enterprise</span> <span class="type">Linux</span> <span class="number">6.4</span> - ami-<span class="number">80</span>bbf3d2 (<span class="number">64</span>-bit) / ami-<span class="number">9</span>cbbf3ce (<span class="number">32</span>-bit)</span>
<span class="line"><span class="type">Red</span> <span class="type">Hat</span> <span class="type">Enterprise</span> <span class="type">Linux</span> version <span class="number">6.4</span>, <span class="type">EBS</span>-boot.</span>
<span class="line"><span class="type">Root</span> device <span class="class"><span class="keyword">type</span>:</span> ebs <span class="type">Virtualization</span> <span class="class"><span class="keyword">type</span>:</span> paravirtual</span>
</pre></td></tr></table></figure>
<a id="more"></a>

首先登陆[『AWS管理控制台』](http://console.aws.amazon.com/console/home)，进入[『EC2』](http://console.aws.amazon.com/ec2/v2/home)。

左侧树依次点击『ELASTIC BLOCK STORE』-『Volumes』，点击『Create Volume』创建一个新的volume。

> *   按照[AWS 免费套餐条款](http://aws.amazon.com/cn/free)，每月有30 GB 的 EBS 可用。但也没必要最大额，够用即可。
> *   Availability Zone要与你的主机实例在同一个区域，查看『INSTANCES』-『instances』列表中的Availability Zone选项。

创建完毕后，在左侧列表中选中右键Attach Volume，在Instances列表中选中你的Instance。在Device中输入设备名，如：**/dev/sdf**。

接下来用putty登陆进你的云主机，不会不知道怎么做吧。

<figure class="highlight groovy"><table><tr><td class="code"><pre><span class="line">login <span class="string">as:</span> ec2-user</span>
<span class="line">Authenticating with <span class="keyword">public</span> key <span class="string">"imported-openssh-key"</span></span>
<span class="line">Last <span class="string">login:</span> Thu Jan  <span class="number">2</span> <span class="number">21</span>:<span class="number">10</span>:<span class="number">51</span> <span class="number">2014</span> from <span class="number">219.133</span>.173.33</span>
<span class="line"></span>
<span class="line">[ec2-user<span class="annotation">@ip</span>-<span class="number">172</span>-<span class="number">32</span>-<span class="number">11</span>-<span class="number">222</span> ~]$ df -h</span>
<span class="line">Filesystem            Size  Used Avail Use% Mounted on</span>
<span class="line"><span class="regexp">/dev/</span>xvde1            <span class="number">6.0</span>G  <span class="number">1.7</span>G  <span class="number">4.2</span>G  <span class="number">29</span>% /</span>
<span class="line">none                  <span class="number">298</span>M     <span class="number">0</span>  <span class="number">298</span>M   <span class="number">0</span>% <span class="regexp">/dev/</span>shm</span>
</pre></td></tr></table></figure>

使用_df -h_看到确实没有新建的volume，这是正常的，因尚未挂载。

<figure class="highlight prolog"><table><tr><td class="code"><pre><span class="line">[<span class="atom">ec2</span>-<span class="atom">user</span>@<span class="atom">ip</span>-<span class="number">172</span>-<span class="number">32</span>-<span class="number">11</span>-<span class="number">222</span> /]$ <span class="atom">df</span> -<span class="name">T</span></span>
<span class="line"><span class="name">Filesystem</span>    <span class="name">Type</span>   <span class="number">1</span><span class="name">K</span>-<span class="atom">blocks</span>      <span class="name">Used</span> <span class="name">Available</span> <span class="name">Use</span><span class="comment">% Mounted on</span></span>
<span class="line">/<span class="atom">dev</span>/<span class="atom">xvde1</span>    <span class="atom">ext4</span>     <span class="number">6193088</span>   <span class="number">1892740</span>   <span class="number">4237736</span>  <span class="number">31</span><span class="comment">% /</span></span>
<span class="line"><span class="atom">none</span>         <span class="atom">tmpfs</span>      <span class="number">305112</span>         <span class="number">0</span>    <span class="number">305112</span>   <span class="number">0</span><span class="comment">% /dev/shm</span></span>
</pre></td></tr></table></figure>

用_df -T_查看当前系统的文件格式，为ext4。

<figure class="highlight applescript"><table><tr><td class="code"><pre><span class="line">[ec2-user@ip-<span class="number">172</span>-<span class="number">32</span>-<span class="number">11</span>-<span class="number">222</span> /]$  mkfs.ext4 /dev/sdf</span>
<span class="line">mke2fs <span class="number">1.41</span>.12 (<span class="number">17</span>-May-<span class="number">2010</span>)</span>
<span class="line">Could <span class="keyword">not</span> stat /dev/sdf <span class="comment">--- No such file or directory</span></span>
<span class="line"></span>
<span class="line">The device apparently <span class="keyword">does</span> <span class="keyword">not</span> exist; did you specify <span class="keyword">it</span> correctly?</span>
</pre></td></tr></table></figure>

尝试根据当前文件系统来格式化新加的volume，报错没有文件，找不到设备？
可是我新创建的volume明明就是/dev/sdf啊，这是为什么？

<figure class="highlight ocaml"><table><tr><td class="code"><pre><span class="line">[ec2-user@ip-<span class="number">172</span>-<span class="number">32</span>-<span class="number">11</span>-<span class="number">222</span> /]$ sudo fdisk -l</span>
<span class="line"></span>
<span class="line"><span class="type">Disk</span> /dev/xvde1: <span class="number">6442</span> <span class="type">MB</span>, <span class="number">6442450944</span> <span class="built_in">bytes</span></span>
<span class="line"><span class="number">255</span> heads, <span class="number">63</span> sectors/track, <span class="number">783</span> cylinders</span>
<span class="line"><span class="type">Units</span> = cylinders <span class="keyword">of</span> <span class="number">16065</span> * <span class="number">512</span> = <span class="number">8225280</span> <span class="built_in">bytes</span></span>
<span class="line"><span class="type">Sector</span> size (logical/physical): <span class="number">512</span> <span class="built_in">bytes</span> / <span class="number">512</span> <span class="built_in">bytes</span></span>
<span class="line"><span class="type">I</span>/<span class="type">O</span> size (minimum/optimal): <span class="number">512</span> <span class="built_in">bytes</span> / <span class="number">512</span> <span class="built_in">bytes</span></span>
<span class="line"><span class="type">Disk</span> identifier: <span class="number">0x00000000</span></span>
<span class="line"></span>
<span class="line"><span class="type">Disk</span> /dev/xvdj: <span class="number">10.7</span> <span class="type">GB</span>, <span class="number">10737418240</span> <span class="built_in">bytes</span></span>
<span class="line"><span class="number">255</span> heads, <span class="number">63</span> sectors/track, <span class="number">1305</span> cylinders</span>
<span class="line"><span class="type">Units</span> = cylinders <span class="keyword">of</span> <span class="number">16065</span> * <span class="number">512</span> = <span class="number">8225280</span> <span class="built_in">bytes</span></span>
<span class="line"><span class="type">Sector</span> size (logical/physical): <span class="number">512</span> <span class="built_in">bytes</span> / <span class="number">512</span> <span class="built_in">bytes</span></span>
<span class="line"><span class="type">I</span>/<span class="type">O</span> size (minimum/optimal): <span class="number">512</span> <span class="built_in">bytes</span> / <span class="number">512</span> <span class="built_in">bytes</span></span>
<span class="line"><span class="type">Disk</span> identifier: <span class="number">0x00000000</span></span>
</pre></td></tr></table></figure>

用_fdisk -l_命令看下设备名，居然名字是**/dev/xvdj**。

<figure class="highlight vhdl"><table><tr><td class="code"><pre><span class="line">[ec2-user@ip-<span class="number">172</span>-<span class="number">32</span>-<span class="number">11</span>-<span class="number">222</span> /]$ sudo  mkfs.ext4 /dev/xvdj</span>
<span class="line">mke2fs <span class="number">1.41</span>.<span class="number">12</span> (<span class="number">17</span>-May-<span class="number">2010</span>)</span>
<span class="line">Filesystem <span class="keyword">label</span>=</span>
<span class="line">OS <span class="keyword">type</span>: Linux</span>
<span class="line"><span class="keyword">Block</span> size=<span class="number">4096</span> (log=<span class="number">2</span>)</span>
<span class="line">Fragment size=<span class="number">4096</span> (log=<span class="number">2</span>)</span>
<span class="line">Stride=<span class="number">0</span> blocks, Stripe width=<span class="number">0</span> blocks</span>
<span class="line"><span class="number">655360</span> inodes, <span class="number">2621440</span> blocks</span>
<span class="line"><span class="number">131072</span> blocks (<span class="number">5.00</span>%) reserved <span class="keyword">for</span> the super user</span>
<span class="line">First data <span class="keyword">block</span>=<span class="number">0</span></span>
<span class="line">Maximum filesystem blocks=<span class="number">2684354560</span></span>
<span class="line"><span class="number">80</span> <span class="keyword">block</span> groups</span>
<span class="line"><span class="number">32768</span> blocks per <span class="keyword">group</span>, <span class="number">32768</span> fragments per <span class="keyword">group</span></span>
<span class="line"><span class="number">8192</span> inodes per <span class="keyword">group</span></span>
<span class="line">Superblock backups stored <span class="keyword">on</span> blocks:</span>
<span class="line">        <span class="number">32768</span>, <span class="number">98304</span>, <span class="number">163840</span>, <span class="number">229376</span>, <span class="number">294912</span>, <span class="number">819200</span>, <span class="number">884736</span>, <span class="number">1605632</span></span>
<span class="line"></span>
<span class="line">Writing inode tables: done</span>
<span class="line">Creating journal (<span class="number">32768</span> blocks): done</span>
<span class="line">Writing superblocks <span class="keyword">and</span> filesystem accounting information: done</span>
<span class="line"></span>
<span class="line">This filesystem will be automatically checked every <span class="number">21</span> mounts <span class="keyword">or</span></span>
<span class="line"><span class="number">180</span> days, whichever comes first.  <span class="keyword">Use</span> tune2fs -c <span class="keyword">or</span> -i <span class="keyword">to</span> override.</span>
</pre></td></tr></table></figure>

格式化。下面创建挂载点，将新增的volumn挂在上。

<figure class="highlight groovy"><table><tr><td class="code"><pre><span class="line">[ec2-user<span class="annotation">@ip</span>-<span class="number">172</span>-<span class="number">32</span>-<span class="number">11</span>-<span class="number">222</span> <span class="regexp">/]$ sudo mkdir /</span>mnt/ebs</span>
<span class="line">[ec2-user<span class="annotation">@ip</span>-<span class="number">172</span>-<span class="number">32</span>-<span class="number">11</span>-<span class="number">222</span> <span class="regexp">/]$ sudo mount /</span>dev<span class="regexp">/xvdj  /</span>mnt/ebs</span>
<span class="line">[ec2-user<span class="annotation">@ip</span>-<span class="number">172</span>-<span class="number">32</span>-<span class="number">11</span>-<span class="number">222</span> /]$ df -h</span>
<span class="line">Filesystem            Size  Used Avail Use% Mounted on</span>
<span class="line"><span class="regexp">/dev/</span>xvde1            <span class="number">6.0</span>G  <span class="number">1.9</span>G  <span class="number">4.1</span>G  <span class="number">31</span>% /</span>
<span class="line">none                  <span class="number">298</span>M     <span class="number">0</span>  <span class="number">298</span>M   <span class="number">0</span>% <span class="regexp">/dev/</span>shm</span>
<span class="line"><span class="regexp">/dev/</span>xvdj             <span class="number">9.9</span>G  <span class="number">151</span>M  <span class="number">9.2</span>G   <span class="number">2</span>% <span class="regexp">/mnt/</span>ebs</span>
</pre></td></tr></table></figure>

# 参考文献

[amazon ec2 - boto and attaching a ebs to ec2](http://stackoverflow.com/questions/13788619/boto-and-attaching-a-ebs-to-ec2-now-what)
[How to convert Amazon instance store EC2 to EBS based EC2](http://blog.sina.com.cn/s/blog_3d4a28be0101jc0h.html)
[调整amazon EC2云主机的EBS启动磁盘大小 ](http://blog.sina.com.cn/s/blog_704836f40101anhf.html)
[在EC2中使用EBS作为永久存储](http://www.storyday.com/html/y2011/2959_in-ec2-using-ebs-as-a-permanent-storage.html)
[在EC2中使用EBS作为永久存储](http://www.vmzj.com/212.html)
[linux查看硬盘使用情况命令](http://www.cnblogs.com/hopeworld/archive/2009/05/25/1488617.html)