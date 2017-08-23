var gulp = require('gulp');

var del    = require('del'); // For deletin' files
var gutil  = require('gulp-util'); // For error logging
var fs     = require('fs'); // For filesystem access
var rename = require('gulp-rename'); // For renaming files
var newer  = require('gulp-newer'); // For only regenerating files when necessary

// For HTML templating
var nunjucksRender = require('gulp-nunjucks-render');
var data           = require('gulp-data');

// For minifying/concatenating scripts and styles
var uglifyJS   = require('gulp-uglify');
var uglifyJSON = require('gulp-jsonminify');
var concat     = require('gulp-concat');

// For dem styles
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var uglifyCSS    = require('gulp-minify-css');

// For images
var gm          = require('gulp-gm'); // GraphicsMagick
var imagemin    = require('gulp-imagemin');

var paths = {
  scripts: ['js/vendor/*.js', 'js/*.js'],
  styles: ['scss/vendor/*.scss', 'scss/pokemon.scss'],
  sugimori_images: 'images/sugimori/',
  kc_images: 'images/kc/*',
  non_pokemon_images: ['images/*.*', 'images/!(sugimori|kc)/**/*'],
  data: 'data/',
  templates: 'templates/',
  fonts: 'fonts/*',
  build: 'build/'
};

var all_pokemon_data = JSON.parse(fs.readFileSync(paths.data + 'all_pokemon.json'));

var build_date = function() {
  var date = new Date();
  return date.toDateString();
}

var padded_number = function(number) {
  var stringed_number = Number(number).toString();

  switch (stringed_number.length) {
    case 1:
      return '00' + stringed_number;
    case 2:
      return '0' + stringed_number;
    case 3:
      return stringed_number;
    default:
      throw new Error(stringed_number + ' is not a 1-3 digit number!');
  }
};

var parse_kc_data = function() {
  // Get the filenames of all KC images
  var filenames = fs.readdirSync('images/kc')
    .filter(function(filename) { return /^\d/.test(filename) }); // Filter out any filenames that don't start with a number

  // Convert our array of filenames into an object, with the format:
  // {
  //  '1'  : { filename: '1.png' }
  //  '34' : { filename: '34.jpg' }
  //  '151': { filename: '151.png' }
  // }
  var kc_data = {};
  filenames.forEach(function(filename) {
    var just_the_number = filename.match(/(\d+)/)[1];
    kc_data[just_the_number] = {
      filename: filename,
      dex_number: padded_number(just_the_number)
    };
  });

  return kc_data;
};

var compile_data = function() {
  var kc_data = parse_kc_data();

  var all_data = {};

  for (key in all_pokemon_data) {
    all_data[key] = Object.assign(
      { sugimori_filename: `images/sugimori/${key}.png`},
      all_pokemon_data[key],
      kc_data[key]
    );
  }

  return all_data;
};


gulp.task('clean', function() {
  // Delete dat build directory
  return del([paths.build]);
});

gulp.task('render_index', function() {
  nunjucksRender.nunjucks.configure([paths.templates]);

  return gulp.src(paths.templates + 'index.njk')
    .pipe(data({ pokemons: compile_data(), build_date: build_date() }))
    .pipe(nunjucksRender())
    .pipe(gulp.dest(paths.build));
});

gulp.task('scripts', function() {
  // Minify and copy all JavaScript
  return gulp.src(paths.scripts)
    .pipe(uglifyJS().on('error', gutil.log))
    .pipe(concat('scripts.min.js'))
    .pipe(gulp.dest(paths.build + 'js'));
});

gulp.task('styles', function() {
  // Minify and copy all JavaScript
  return gulp.src(paths.styles)
    .pipe(sass().on('error', sass.logError))
    .pipe(uglifyCSS().on('error', gutil.log))
    .pipe(autoprefixer({
      browsers: ['last 5 versions'],
      cascade: false
    }))
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest(paths.build + 'css'));
});

gulp.task('generate_thumbs', function() {
  // Generate thumbs for all KC images
  return gulp.src(paths.kc_images)
    .pipe(newer(paths.build + 'images/kc/thumbs'))
    .pipe(gm(function(gmfile) {
      return gmfile
        .fuzz(5)
        .trim()
        .resize(145, 145)
        .gravity('Center')
        .extent(245, 155)
    }))
    .pipe(imagemin({optimizationLevel: 4}))
    .pipe(gulp.dest(paths.build + 'images/kc/thumbs'));
});

gulp.task('silhouette', function() {
  return gulp.src(paths.sugimori_images + '*.png')
    .pipe(newer(paths.build + 'images/sugimori'))
    .pipe(gm(function(gmfile) {
      return gmfile
        .threshold('100%')
        .fill('#aaaaaa')
        .opaque('#000000')
        .resize(145, 145)
        .trim()
        .gravity('Center')
        .extent(245, 155)
    }))
    .pipe(gulp.dest(paths.build + 'images/sugimori'));
});

gulp.task('optimize_kc_images', function() {
  // Optimize and copy all KC images
  return gulp.src(paths.kc_images)
    .pipe(newer(paths.build + 'images/kc'))
    .pipe(imagemin({optimizationLevel: 4}))
    .pipe(gulp.dest(paths.build + 'images/kc'));
});

gulp.task('optimize_site_images', function() {
  // Optimize and copy all non-KC and non-Sugimori images
  return gulp.src(paths.non_pokemon_images)
    .pipe(imagemin({optimizationLevel: 4}))
    .pipe(gulp.dest(paths.build + 'images'));
});

gulp.task('copy_fonts', function() {
  // Copy all fonts into the build folder
  return gulp.src(paths.fonts)
    .pipe(gulp.dest(paths.build + 'fonts'));
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', [
  'render_index',
  'scripts',
  'styles',
  'generate_thumbs',
  'silhouette',
  'optimize_kc_images',
  'optimize_site_images',
  'copy_fonts'
]);
