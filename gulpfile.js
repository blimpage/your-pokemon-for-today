var gulp = require('gulp');

var del = require('del'); // For deletin' files
var gutil = require('gulp-util'); // For error logging

// For scripts
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

// For images
var gm = require('gulp-gm'); // GraphicsMagick
var imagemin = require('gulp-imagemin');

var paths = {
  scripts: ['js/vendor/*.js', 'js/*.js'],
  kc_images: 'images/kc/*.png',
  sugimori_images: 'images/sugimori/*.jpg'
};


gulp.task('clean', function() {
  // Delete dat build directory
  return del(['build']);
});

gulp.task('scripts', ['clean'], function() {
  // Minify and copy all JavaScript
  return gulp.src(paths.scripts)
      .pipe(uglify().on('error', gutil.log))
      .pipe(concat('scripts.js'))
    .pipe(gulp.dest('build/js'));
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
  return gulp.src([paths.kc_images, paths.sugimori_images])
    .pipe(imagemin({optimizationLevel: 4}))
    .pipe(gulp.dest('build/images'));
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.kc_images, ['generate_thumbs']);
  gulp.watch([paths.kc_images, paths.sugimori_images], ['optimize_images'])
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'scripts', 'generate_thumbs', 'optimize_images']);
