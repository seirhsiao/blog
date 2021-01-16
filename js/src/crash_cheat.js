/* 离开当前页面时修改网页标题，回到当前页面时恢复原来标题 */
<!-- 崩溃欺骗 -->
window.onload = function() {
  var OriginTitile = document.title;
  var titleTime;
  document.addEventListener('visibilitychange', function() {
    if(document.hidden) {
      $('[rel="icon"]').attr('href', "../../images/failure.png");
      $('[rel="shortcut icon"]').attr('href', "../../images/failure.png");
      document.title = '(●—●)喔哟，崩溃啦！';
      //document.title = '╭(°A°`)╮ 页面崩溃啦 ~';
      clearTimeout(titleTime);
    } else {
      $('[rel="icon"]').attr('href', "../../images/favicon-32x32-next.ico");
      $('[rel="shortcut icon"]').attr('href', "../../images/favicon-32x32.ico");
      document.title = '(/≧▽≦/)咦！页面又好了！';
      //document.title = '(ฅ>ω<*ฅ) 噫又好了~' + OriginTitle;
      titleTime = setTimeout(function() {
        document.title = OriginTitile;
      }, 2000);
    }
  });
};
