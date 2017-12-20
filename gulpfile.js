var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var es = require('event-stream');

gulp.task('minifyLibs',function(){
  return gulp.src('public/javascripts/infra/*.js')
  .pipe(concat('libs.min.js'))
  .pipe(uglify().on('error', function(e){
      console.log(e);
   }))
  .pipe(gulp.dest('public/javascripts'));
});
gulp.task('watch', function(){
  return gulp.watch('public/javascripts/infra/*.js',['minifyLibs']);
});
