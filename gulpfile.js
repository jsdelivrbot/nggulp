const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const es = require('event-stream');
const browserSync = require('browser-sync').create();
//src of all js, css dependencies
const scripts = require('./scripts');
const styles = require('./styles');
//src assets
const srcHtml = './src/html/**/*.html';
const srcImg = './src/img/**/*.*';
const srcCss = './src/css/**/*.*';
const srcJs = './src/js/**/*.js';
//path to distributed folder
const pathHtml = './dist/';
const pathImg = './dist/img';
const pathCss = './dist/css';
const pathJs = './dist/js';
//js, css dependencies files after concat
const jsLibsFile = 'libs.js';
const cssLibsFile = 'libs.css';

var devMode = false;
//concat css dependencies
gulp.task('concatCssLibs',function(){
  gulp.src(styles)
      .pipe(concat(cssLibsFile))
      .pipe(gulp.dest(pathCss))
      .pipe(browserSync.reload({
        stream: true
      }))
})
//concat js dependencies
gulp.task('concatJsLibs',function(){
  gulp.src(scripts)
      .pipe(concat(jsLibsFile))
      .pipe(gulp.dest(pathJs))
      .pipe(browserSync.reload({
        stream: true
      }))
})
//copy html
gulp.task('copyHtml',function(){
  gulp.src(srcHtml)
      .pipe(gulp.dest(pathHtml))
      .pipe(browserSync.reload({
        stream: true
      }))
})
//copy images
gulp.task('copyImg',function(){
  gulp.src(srcImg)
      .pipe(gulp.dest(pathImg))
      .pipe(browserSync.reload({
        stream: true
      }))
})
//copy css
gulp.task('copyCss',function(){
  gulp.src(srcCss)
      .pipe(gulp.dest(pathCss))
      .pipe(browserSync.reload({
        stream: true
      }))
})
//copy js
gulp.task('copyJs',function(){
  gulp.src(srcJs)
      .pipe(gulp.dest(pathJs))
      .pipe(browserSync.reload({
        stream: true
      }))
})
gulp.task('build',function(){
  gulp.start(['concatCssLibs','concatJsLibs','copyHtml','copyImg','copyCss','copyJs'])
});
//automatic reload on browser
gulp.task('browser-sync',function(){
  browserSync.init(null,{
    open: false,
    server:{
      baseDir: 'dist'
    }
  })
});
//run this at the begining
gulp.task('start',function(){
  devMode = true;
  gulp.start(['build','browser-sync']);
  gulp.watch([srcCss],['concatCssLibs','copyCss']);
  gulp.watch([srcJs],['concatJsLibs','copyJs']);
  gulp.watch([srcHtml],['copyHtml']);
  gulp.watch([srcImg],['copyImg']);
});

gulp.task('minify',function(){
  return gulp.src('src/js/**/*.js')
  .pipe(concat('app.min.js'))
  .pipe(uglify().on('error', function(e){
      console.log(e);
   }))
  .pipe(gulp.dest('./dist/js'));
});
