var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var del = require('del');

var paths = {
  scripts: ['js/vendor/*.js', 'js/*.js'],
  images: 'images/**/*'
};

gulp.task('clean', function() {
  // You can use multiple globbing patterns as you would with `gulp.src`
  return del(['build']);
});

gulp.task('scripts', ['clean'], function() {
  // Minify and copy all JavaScript (except vendor scripts)
  return gulp.src(paths.scripts)
      .pipe(uglify().on('error', gutil.log))
      .pipe(concat('scripts.js'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  // gulp.watch(paths.images, ['images']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'scripts']);
