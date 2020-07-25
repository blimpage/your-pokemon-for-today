var gulp = require('gulp');

var del    = require('del'); // For deletin' files
var fs     = require('fs'); // For filesystem access
var newer  = require('gulp-newer'); // For only regenerating files when necessary
var rename = require('gulp-rename'); // For renaming files in the middle of a gulp pipeline
var hasha  = require('hasha'); // For hashing files to give them cacheable filenames

// For HTML templating
var nunjucksRender = require('gulp-nunjucks-render');
var data           = require('gulp-data');
var htmlmin        = require('gulp-htmlmin');

// For minifying/concatenating scripts and styles
var uglifyJS   = require('gulp-uglify');
var concat     = require('gulp-concat');

// For dem styles
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS     = require('gulp-clean-css');

// For images
var gm          = require('gulp-gm'); // GraphicsMagick
var imagemin    = require('gulp-imagemin');

var paths = {
  scripts: ['js/vendor/*.js', 'js/*.js'],
  styles: ['scss/vendor/*.scss', 'scss/pokemon.scss'],
  styles_extra: ['scss/_base.scss'], // Styles that aren't directly compiled, but should still trigger a rebuild
  sugimori_images: 'images/sugimori/',
  kc_images: 'images/kc/',
  favicon: 'images/favicon.png',
  all_other_images: ['images/!(favicon)*.*', 'images/!(sugimori|kc)/**/*'],
  data: 'data/',
  templates: 'templates/',
  fonts: 'fonts/*',
  htaccess: '.htaccess',
  build: 'build/',
  build_rando: 'build/tomorrow/',
};

var build_date = function() {
  var date = new Date();
  return date.toDateString();
}

var app_version = function() {
  return JSON.parse(fs.readFileSync('package.json')).version;
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

const file_hash = (filepath) => (
  hasha
    .fromFileSync(filepath, { algorithm: "md5" })
    .slice(0, 8)
)

const image_destination_filename = (source_filepath) => {
  const hash = file_hash(source_filepath)
  const [_, basename, extension] = source_filepath.match(/.+\/(.+)\.(.+)$/)
  return `${basename}-${hash}.${extension}`
}

parse_json_data = function() {
  var json_data = JSON.parse(fs.readFileSync(paths.data + 'all_pokemon.json'));

  for (pokemon_id in json_data) {
    var this_pokemon = json_data[pokemon_id];

    // The Pokedex number for each Pokemon is stored in an unpadded
    // stringified form (e.g. "1", "42", "307").
    // For display purposes we need the dex number in a three-digit padded
    // form (e.g. "001", "042", "307"), so let's adjust that for each Pokemon.
    this_pokemon.dex_number = padded_number(this_pokemon.dex_number);

    // There are a lot of Pokemon who are Normal/Flying type, and very very few
    // Pokemon who have Flying as their primary type. Those Normal/Flying Pokemon
    // should be shown as Flying-type imo, so we get to see that beautiful purple!
    if (this_pokemon.type_1 == "normal" && this_pokemon.type_2 == "flying") {
      this_pokemon.type_1 = "flying";
    }
  }

  return json_data;
}

var parse_sugimori_data = function() {
  // Get the filenames of all sugimori images
  var filenames = fs.readdirSync('images/sugimori')
    .filter(function(filename) { return /^\d/.test(filename) }); // Filter out any filenames that don't start with a number

  // Convert our array of filenames into an object, with the format:
  // {
  //   '26-alola': { thumb_filepath: '/images/sugimori/26-alola.png' },
  //   '34': { thumb_filepath: '/images/sugimori/34.jpg' },
  // }
  var sugimori_data = {};
  filenames.forEach(function(filename) {
    const source_filepath = `images/sugimori/${filename}`
    const destination_filename = image_destination_filename(source_filepath)
    const pokemon_id = filename.match(/(.+)\.\w+$/)[1]
    sugimori_data[pokemon_id] = {
      source_image_filepath: source_filepath,
      thumb_filepath: `/images/sugimori/${destination_filename}`,
    }
  });

  return sugimori_data;
};

var parse_kc_data = function() {
  // Get the filenames of all KC images
  var filenames = fs.readdirSync('images/kc')
    .filter(function(filename) { return /^\d/.test(filename) }); // Filter out any filenames that don't start with a number

  // Convert our array of filenames into an object, with the format:
  // {
  //   '34': {
  //     has_kc_image: true,
  //     full_filepath: '/images/kc/34-abcd1234.jpg',
  //     thumb_filepath: '/images/kc/thumbs/34-abcd1234.jpg'
  //   },
  // }
  var kc_data = {};
  filenames.forEach(function(filename) {
    const source_filepath = `images/kc/${filename}`
    const destination_filename = image_destination_filename(source_filepath)
    const pokemon_id = filename.match(/(.+)\.\w+$/)[1]
    kc_data[pokemon_id] = {
      has_kc_image: true,
      full_filepath: `/images/kc/${destination_filename}`,
      thumb_filepath: `/images/kc/thumbs/${destination_filename}`,
    };
  });

  return kc_data;
};

var compile_data = function() {
  var all_pokemon_data = parse_json_data();

  var sugimori_data = parse_sugimori_data();

  var kc_data = parse_kc_data();

  var all_data = {};

  for (pokemon_id in all_pokemon_data) {
    all_data[pokemon_id] = Object.assign(
      { pokemon_id: pokemon_id },
      all_pokemon_data[pokemon_id],
      sugimori_data[pokemon_id],
      kc_data[pokemon_id],
    );
  }

  var all_data_as_array = Object.values(all_data).sort(function(a, b) {
    return parseInt(a.dex_number) - parseInt(b.dex_number);
  })

  return all_data_as_array;
};

var randomizer_data = function() {
  var all_data = compile_data();

  var non_kc_data = all_data.filter(function(pokemon) {
    return !pokemon.has_kc_image;
  });

  return non_kc_data;
}

var stats = function() {
  var all_data = compile_data();

  var stats = {
    done: 0,
    remaining: 0
  };

  for (var pokemon of all_data) {
    if (pokemon.has_kc_image) {
      stats.done += 1;
    } else {
      stats.remaining += 1;
    }
  }

  return stats;
}


gulp.task('clean', function() {
  // Delete dat build directory
  return del([paths.build]);
});

gulp.task('render_index', function() {
  nunjucksRender.nunjucks.configure([paths.templates]);

  return gulp.src(paths.templates + 'index.njk')
    .pipe(data({
      pokemons: compile_data(),
      stats: stats(),
      build_date: build_date(),
      app_version: app_version(),
      render_names_for_non_kc: false,
    }))
    .pipe(nunjucksRender())
    .pipe(htmlmin({collapseWhitespace: true, removeAttributeQuotes: true}))
    .pipe(gulp.dest(paths.build));
});

gulp.task('render_rando', function() {
  nunjucksRender.nunjucks.configure([paths.templates]);

  return gulp.src(paths.templates + 'tomorrow/index.njk')
    .pipe(data({
      pokemons: randomizer_data(),
      stats: stats(),
      build_date: build_date(),
      app_version: app_version(),
      render_names_for_non_kc: true,
    }))
    .pipe(nunjucksRender())
    .pipe(htmlmin({collapseWhitespace: true, removeAttributeQuotes: true}))
    .pipe(gulp.dest(paths.build_rando));
});

gulp.task('scripts', function() {
  // Minify and copy all JavaScript
  const outputDirectory = `${paths.build}js`
  const outputFileName = `scripts-${app_version()}.min.js`
  const fullPathToOutputFile = `${outputDirectory}/${outputFileName}`

  return gulp.src(paths.scripts)
    .pipe(newer(fullPathToOutputFile))
    .pipe(uglifyJS())
    .pipe(concat(outputFileName))
    .pipe(gulp.dest(outputDirectory));
});

gulp.task('styles', function() {
  // Minify and copy all styles
  const outputDirectory = `${paths.build}css`
  const outputFileName = `style-${app_version()}.min.css`
  const fullPathToOutputFile = `${outputDirectory}/${outputFileName}`

  return gulp.src(paths.styles)
    .pipe(newer({ dest: fullPathToOutputFile, extra: paths.styles_extra }))
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(concat(outputFileName))
    .pipe(gulp.dest(outputDirectory));
});

gulp.task('generate_thumbs', function() {
  // Generate thumbs for all KC images
  return gulp.src(`${paths.kc_images}*`)
    .pipe(
      newer({
        dest: `${paths.build}images/kc/thumbs`,
        map: (relative_path) => {
          const source_filepath = `${paths.kc_images}${relative_path}`
          return image_destination_filename(source_filepath)
        },
      })
    )
    .pipe(gm(function(gmfile) {
      // Most images have a white background, but some have different colours.
      // Test for the special cases and set their background colour appropriately.
      var backgroundColour = "#FFFFFF";
      if (/\/(93\.jpg|756\.png|687\.png)$/.test(gmfile.source)) {
        backgroundColour = "#000000";
      }

      return gmfile
        .fuzz(5)
        .trim()
        .resize(145, 145)
        .gravity('Center')
        .background(backgroundColour)
        .extent(245, 155)
    }))
    .pipe(imagemin())
    .pipe(rename((path_info) => {
      const source_filepath = `${paths.kc_images}${path_info.basename}${path_info.extname}`
      const destination_filename = image_destination_filename(source_filepath)
      const [_, new_basename] = destination_filename.match(/(.+)\..+$/)

      return {
        ...path_info,
        basename: new_basename,
      }
    }))
    .pipe(gulp.dest(paths.build + 'images/kc/thumbs'));
});

gulp.task('silhouette', function(callback) {
  var sugimori_data = parse_sugimori_data();
  var kc_data = parse_kc_data();
  var images_to_silhouette = [];

  // Select Sugimori images for which there is no corresponding KC image
  for (pokemon_id in sugimori_data) {
    if (kc_data[pokemon_id] === undefined) {
      images_to_silhouette.push(sugimori_data[pokemon_id].source_image_filepath);
    }
  }

  // No images to silhouette? Return early!
  if (images_to_silhouette.length === 0) return callback();

  return gulp.src(images_to_silhouette)
    .pipe(
      newer({
        dest: `${paths.build}images/sugimori`,
        map: (relative_path) => {
          const source_filepath = `${paths.sugimori_images}${relative_path}`
          return image_destination_filename(source_filepath)
        },
      })
    )
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
    .pipe(imagemin())
    .pipe(rename((path_info) => {
      const source_filepath = `${paths.sugimori_images}${path_info.basename}${path_info.extname}`
      const destination_filename = image_destination_filename(source_filepath)
      const [_, new_basename] = destination_filename.match(/(.+)\..+$/)

      return {
        ...path_info,
        basename: new_basename,
      }
    }))
    .pipe(gulp.dest(paths.build + 'images/sugimori'));
});

gulp.task('optimize_kc_images', function() {
  // Optimize and copy all KC images
  return gulp.src(`${paths.kc_images}*`)
    .pipe(
      newer({
        dest: `${paths.build}images/kc`,
        map: (relative_path) => {
          const source_filepath = `${paths.kc_images}${relative_path}`
          return image_destination_filename(source_filepath)
        },
      })
    )
    .pipe(imagemin())
    .pipe(rename((path_info) => {
      const source_filepath = `${paths.kc_images}${path_info.basename}${path_info.extname}`
      const destination_filename = image_destination_filename(source_filepath)
      const [_, new_basename] = destination_filename.match(/(.+)\..+$/)

      return {
        ...path_info,
        basename: new_basename,
      }
    }))
    .pipe(gulp.dest(`${paths.build}images/kc`));
});

gulp.task('copy_favicon', function() {
  // Optimize and copy our beautiful favicon
  return gulp.src(paths.favicon)
    .pipe(newer(paths.build))
    .pipe(imagemin())
    .pipe(gulp.dest(paths.build));
});

gulp.task('optimize_site_images', function() {
  // Optimize and copy all other site images
  return gulp.src(paths.all_other_images)
    .pipe(newer(paths.build + 'images'))
    .pipe(imagemin())
    .pipe(gulp.dest(paths.build + 'images'));
});

gulp.task('copy_fonts', function() {
  // Copy all fonts into the build folder
  return gulp.src(paths.fonts)
    .pipe(newer(paths.build + 'fonts'))
    .pipe(gulp.dest(paths.build + 'fonts'));
});

gulp.task('copy_htaccess', function() {
  // Copy our .htaccess file
  return gulp.src(paths.htaccess)
    .pipe(newer(paths.build))
    .pipe(gulp.dest(paths.build));
});

// The default task (called when you run `gulp` from cli)
gulp.task('default',
  gulp.parallel(
    'render_index',
    'render_rando',
    'scripts',
    'styles',
    'generate_thumbs',
    'silhouette',
    'optimize_kc_images',
    'optimize_site_images',
    'copy_favicon',
    'copy_fonts',
    'copy_htaccess',
  )
);
