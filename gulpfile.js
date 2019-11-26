/* Refrences:
1. http://notes.iissnan.com/2016/publishing-github-pages-with-travis-ci
2. https://github.com/chrisjlee/hexo-theme-zurb-foundation/blob/e82f45a82bbaaee063bcb1298cd9793575afb142/gulpfile.js
3. https://github.com/gulpjs/gulp/blob/master/docs/recipes/delete-files-folder.md
4. https://hexo.io/api/
5. https://github.com/iissnan/theme-next-docs/blob/master/.travis.yml
*/
var gulp        = require('gulp');
var debug       = require('gulp-debug');
var cleancss    = require('gulp-clean-css'); //css压缩组件
var uglify      = require('gulp-uglify');    //js压缩组件
var htmlmin     = require('gulp-htmlmin');   //html压缩组件
var htmlclean   = require('gulp-htmlclean'); //html清理组件
var imagemin    = require('gulp-imagemin');  //图片压缩组件
var changed     = require('gulp-changed');   //文件更改校验组件
var gulpif      = require('gulp-if')         //任务 帮助调用组件
var plumber     = require('gulp-plumber');   //容错组件（发生错误不跳出任务，并报出错误内容）
var runSequence = require('run-sequence');   //异步执行组件
var isScriptAll = true;  //是否处理所有文件，(true|处理所有文件)(false|只处理有更改的文件)
var isDebug     = true;  //是否调试显示 编译通过的文件
var del         = require('del');
var Hexo        = require('hexo');
var hexo        = new Hexo(process.cwd(), {}); // 初始化一个hexo对象

gulp.task('clean', function() {
    return del(['public/**/*']);
});

// generate html with 'hexo generate'
var hexo = new Hexo(process.cwd(), {});
gulp.task('generate', function(cb) {
    hexo.init().then(function() {
        return hexo.call('generate', {
            watch: false
        });
    }).then(function() {
        return hexo.exit();
    }).then(function() {
        return cb()
    }).catch(function(err) {
        console.log(err);
        hexo.exit(err);
        return cb(err);
    })
})

// 压缩public目录下的css文件
gulp.task('minify-css', function () {
    var option = {
        rebase: false,
        //advanced: true,               //类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
        compatibility: 'ie7',         //保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
        //keepBreaks: true,             //类型：Boolean 默认：false [是否保留换行]
        //keepSpecialComments: '*'      //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
    }
    return gulp.src(['./public/**/*.css','!./public/**/*.min.css'])  //排除的css
        .pipe(gulpif(!isScriptAll, changed('./public')))
        .pipe(gulpif(isDebug,debug({title: 'Compress CSS:'})))
        .pipe(plumber())
        .pipe(cleancss(option))
        .pipe(gulp.dest('./public'));
});

// 压缩public目录下的js文件
gulp.task('minify-js', function () {
    var option = {
        // preserveComments: 'all',//保留所有注释
        mangle: true,           //类型：Boolean 默认：true 是否修改变量名
        compress: true          //类型：Boolean 默认：true 是否完全压缩
    }
    return gulp.src(['./public/**/*.js','!./public/**/*.min.js'])  //排除的js
        .pipe(gulpif(!isScriptAll, changed('./public')))
        .pipe(gulpif(isDebug,debug({title: 'Compress JS:'})))
        .pipe(plumber())
        .pipe(uglify(option))                //调用压缩组件方法uglify(),对合并的文件进行压缩
        .pipe(gulp.dest('./public'));         //输出到目标目录
});

// 压缩public目录下的html文件
gulp.task('minify-html', function () {
    var cleanOptions = {
        protect: /<\!--%fooTemplate\b.*?%-->/g,             //忽略处理
        unprotect: /<script [^>]*\btype="text\/x-handlebars-template"[\s\S]+?<\/script>/ig //特殊处理
    }
    var minOption = {
        collapseWhitespace: true,           //压缩HTML
        collapseBooleanAttributes: true,    //省略布尔属性的值  <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,        //删除所有空格作属性值    <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,   //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        removeComments: true,               //清除HTML注释
        minifyJS: true,                     //压缩页面JS
        minifyCSS: true,                    //压缩页面CSS
        minifyURLs: true                    //替换页面URL
    };
    return gulp.src('./public/**/*.html')
        .pipe(gulpif(isDebug,debug({title: 'Compress HTML:'})))
        .pipe(plumber())
        .pipe(htmlclean(cleanOptions))
        .pipe(htmlmin(minOption))
        .pipe(gulp.dest('./public'));
});

// 压缩 public/uploads 目录内图片
gulp.task('minify-images', function() {
    var option = {
        optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
        progressive: true,    //类型：Boolean 默认：false 无损压缩jpg图片
        interlaced: false,    //类型：Boolean 默认：false 隔行扫描gif进行渲染
        multipass: false      //类型：Boolean 默认：false 多次优化svg直到完全优化
    }
    return gulp.src(['./public/images/**/*.*','./public/uploads/**/*.*'])
        .pipe(gulpif(!isScriptAll, changed('./public/uploads')))
        .pipe(gulpif(isDebug,debug({title: 'Compress Images:'})))
        .pipe(plumber())
        .pipe(imagemin(option))
        .pipe(gulp.dest('./public/images'));
});

// 用run-sequence并发执行，同时处理html，css，js，img
gulp.task('compress', function(cb) {
    runSequence.options.ignoreUndefinedTasks = true;
    runSequence(['minify-html', 'minify-js', 'minify-css', 'minify-images'],cb);
});

// 执行顺序： 清除public目录 -> 产生原始博客内容 -> 执行压缩混淆 -> 部署到服务器
gulp.task('build', function(cb) {
    runSequence.options.ignoreUndefinedTasks = true;
    runSequence('clean', 'generate', 'compress', 'deploy', cb);
});

// 默认任务
gulp.task('default',
  gulp.series('clean','generate',
    gulp.parallel('minify-html', 'minify-js', 'minify-css', 'minify-images')
  )
);
//Gulp4最大的一个改变就是gulp.task函数现在只支持两个参数，分别是任务名和运行任务的函数
// gulp.series：将按顺序运行任务
// gulp.parallel：将并行运行任务