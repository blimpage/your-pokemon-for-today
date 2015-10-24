var gulp = require('gulp');

var del = require('del'); // For deletin' files
var gutil = require('gulp-util'); // For error logging

// For minifying/concatenating scripts and styles
var uglifyJS = require('gulp-uglify');
var uglifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');

// For images
var gm = require('gulp-gm'); // GraphicsMagick
var imagemin = require('gulp-imagemin');

var paths = {
  scripts: ['js/vendor/*.js', 'js/*.js'],
  styles: ['css/vendor/*.css', 'css/*.css'],
  images: 'images/**/*',
  kc_images: 'images/kc/*'
};


gulp.task('clean', function() {
  // Delete dat build directory
  return del(['build']);
});

gulp.task('scripts', ['clean'], function() {
  // Minify and copy all JavaScript
  return gulp.src(paths.scripts)
      .pipe(uglifyJS().on('error', gutil.log))
      .pipe(concat('scripts.min.js'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('styles', ['clean'], function() {
  // Minify and copy all JavaScript
  return gulp.src(paths.styles)
      .pipe(uglifyCSS().on('error', gutil.log))
      .pipe(concat('style.min.css'))
    .pipe(gulp.dest('build/css'));
});

gulp.task('generate_thumbs', ['clean'], function() {
  // Generate thumbs for all KC images
  return gulp.src(paths.kc_images)
    .pipe(gm(function(gmfile) {
      return gmfile
        .fuzz(5)
        .trim()
        .resize(160, 160)
        .gravity('Center')
        .extent(200, 200)
    }))
    .pipe(imagemin({optimizationLevel: 4}))
    .pipe(gulp.dest('build/images/kc/thumbs'));
});

gulp.task('optimize_images', ['clean'], function(){
  // Optimize and copy all images
  return gulp.src(paths.images)
    .pipe(imagemin({optimizationLevel: 4}))
    .pipe(gulp.dest('build/images'));
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.styles, ['styles']);
  gulp.watch([paths.images], ['generate_thumbs', 'optimize_images'])
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', [
  'watch',
  'scripts',
  'styles',
  'generate_thumbs',
  'optimize_images'
]);
