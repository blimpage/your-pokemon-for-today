var gulp = require('gulp');
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
      .pipe(uglify())
      .pipe(concat('scripts.js'))
    .pipe(gulp.dest('build/js'));
    console.log('scripts 4eva');
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts']);
