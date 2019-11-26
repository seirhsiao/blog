1.将下面代码粘贴在页面的 </head> 之前
<script>(function(i,s,o,g,r,a,m){i["DaoVoiceObject"]=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;a.charset="utf-8";m.parentNode.insertBefore(a,m)})(window,document,"script",('https:' == document.location.protocol ? 'https:' : 'http:') + "//widget.daovoice.io/widget/ee67ebfb.js","daovoice")</script>
2.调用下面的 JavaScript 与注册用户沟通
daovoice('init', {
  app_id: "ee67ebfb",
  user_id: "NO_89757", // 必填: 该用户在您系统上的唯一ID
  email: "daovoice@example.com", // 选填:  该用户在您系统上的主邮箱
  name: "道客船长", // 选填: 用户名
  signed_up: 1449821660 // 选填: 用户的注册时间，用Unix时间戳表示
});
daovoice('update');
3.调用下面的 JavaScript 与匿名访客沟通
daovoice('init', {
  app_id: "ee67ebfb"
});
daovoice('update');



{% if theme.daovoice %}
  <script>
  (function(i,s,o,g,r,a,m){i["DaoVoiceObject"]=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;a.charset="utf-8";m.parentNode.insertBefore(a,m)})(window,document,"script",('https:' == document.location.protocol ? 'https:' : 'http:') + "//widget.daovoice.io/widget/ee67ebfb.js","daovoice")
  daovoice('init', {
      app_id: "{{theme.daovoice_app_id}}"
    });
  daovoice('update');
  </script>
{% endif %}
