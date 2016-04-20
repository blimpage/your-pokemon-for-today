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
var spritesmith = require('gulp.spritesmith');

var paths = {
  scripts: ['js/vendor/*.js', 'js/*.js'],
  styles: ['scss/vendor/*.scss', 'scss/pokemon.scss'],
  sugimori_images: 'images/sugimori/',
  kc_images: 'images/kc/*',
  non_pokemon_images: ['images/*.*', 'images/!(sugimori|kc)/**/*'],
  data: 'data/',
  templates: 'templates/',
  build: 'build/'
};

var config = {
  spriteset_size: 50
};

var all_pokemon_data = JSON.parse(fs.readFileSync(paths.data + 'all_pokemon.json'));

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
    kc_data[just_the_number] = { filename: filename };
  });

  return kc_data;
};

var spriteset_data = function() {
  var total_pokemon_count = Object.keys(all_pokemon_data).length;
  var last_spriteset =  Math.floor(total_pokemon_count / config.spriteset_size);

  var spriteset_data = {};

  for (pokemon in all_pokemon_data) {
    var dex_number = parseInt(pokemon),
        spriteset = Math.ceil(dex_number / config.spriteset_size) - 1,
        images_in_set = spriteset < last_spriteset ? config.spriteset_size : total_pokemon_count - (last_spriteset * config.spriteset_size),
        y_offset = ((dex_number - 1) % config.spriteset_size) * (1 / (images_in_set - 1) * 100);

    spriteset_data[pokemon] = {
      spriteset: spriteset,
      y_offset: y_offset
    };
  }

  return spriteset_data;
};

var compile_data = function() {
  var kc_data = parse_kc_data();
  var sprite_data = spriteset_data();
  var all_data = {};

  for (key in all_pokemon_data) {
    all_data[key] = Object.assign({}, all_pokemon_data[key], kc_data[key], sprite_data[key]);
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
    .pipe(data({ pokemons: compile_data() }))
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
        .extent(200, 200)
    }))
    .pipe(imagemin({optimizationLevel: 4}))
    .pipe(gulp.dest(paths.build + 'images/kc/thumbs'));
});

gulp.task('optimize_kc_images', function(){
  // Optimize and copy all KC images
  return gulp.src(paths.kc_images)
    .pipe(newer(paths.build + 'images/kc'))
    .pipe(imagemin({optimizationLevel: 4}))
    .pipe(gulp.dest(paths.build + 'images/kc'));
});

gulp.task('optimize_site_images', function(){
  // Optimize and copy all non-KC and non-Sugimori images
  return gulp.src(paths.non_pokemon_images)
    .pipe(imagemin({optimizationLevel: 4}))
    .pipe(gulp.dest(paths.build + 'images'));
});

gulp.task('generate_sprites', function () {
  // Generate spritesheets for the fallback Sugimori images.
  // We're using spritesmith, which generates one spritesheet each time we call it.
  // However we want to generate a few batches of spritesheets, so we need to call it multiple times.

  // First we need a list of all of our files.
  var src_files = fs.readdirSync(paths.sugimori_images)
    .filter(function(filename) {
      // Remove any files that aren't JPGs (e.g. .DS_Store)
      return filename.match(/(\.jpg)$/);
    }).map(function(filename) {
      // Append the source path to the start of each filename
      return paths.sugimori_images + filename;
    });

  // Then we need to split them into sets, based on our desired set size.
  var spritesets = {};

  for (i = 0; i < (src_files.length / config.spriteset_size); i++) {
    // The Array.slice() method creates a subset starting from the first index,
    // and stopping one short of the second index. So our arguments will be:
    var first = config.spriteset_size * i;
    var last = config.spriteset_size * (i + 1);

    // Add this subset to our list of spritesets
    spritesets[i] = src_files.slice(first, last);
  }

  // Generate a spritesheet for each set we've defined!
  for (set in spritesets) {
    gulp.src(spritesets[set])
      .pipe(spritesmith({
        algorithm:     'top-down',
        algorithmOpts: { sort: false },
        engine:        'gmsmith',
        imgName:       'sugimori_' + set + '.jpg',
        cssName:       'we_wont_even_output_this',
        imgOpts:       { quality: 80 }
      }))
        .img // So that we're only outputting the images, not the CSS
          .pipe(gulp.dest(paths.build + 'images/sugimori'));
  }
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', [
  'render_index',
  'scripts',
  'styles',
  'generate_thumbs',
  'optimize_kc_images',
  'optimize_site_images',
  'generate_sprites'
]);
