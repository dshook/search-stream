var gulp        = require('gulp');
var browserify  = require('browserify');
var del         = require('del');
var lint        = require('gulp-eslint');
var livereload  = require('gulp-livereload');
var sourcemaps  = require('gulp-sourcemaps');
var sequence    = require('gulp-sequence');
var vinylSource = require('vinyl-source-stream');
var vinylBuffer = require('vinyl-buffer');


//Catch build errors and emit end so watch doesn't bail
function handleError(err){
  console.log(err.toString());
  this.emit('end');
}

gulp.task('clean', function() {
  return del(['./dist/**/*']);
});


gulp.task('lint-client', function() {
  return gulp.src('./app/client/**/*.{js}')
    .pipe(lint())
    .pipe(lint.format());
});

// client code
gulp.task('browserify-client', function() {
  var bundleStream = browserify({
    entries: ['./test/index.js'],
    debug: true
  })
  .bundle();

  var bundle = function() {
    return bundleStream
      .on('error', handleError)
      .pipe(vinylSource('index.js'))
      .pipe(vinylBuffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write('./maps/'))
      .pipe(gulp.dest('./dist/'))
      .pipe(livereload());
  };

  return bundle();
});

/*
 * Top-level Tasks
 */

gulp.task('client', function() {
  return sequence([
    'lint-client',
    'clean',
    'browserify-client'
  ]);
});

gulp.task('watch', function() {
  livereload.listen();
  sequence('client');
  gulp.watch('./**/*.js', ['lint-client', 'browserify-client']);
});

gulp.task('default', ['client']);
