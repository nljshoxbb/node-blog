'use strict';

var gulp        = require('gulp');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var nodemon     = require('gulp-nodemon');
var sourcemaps  = require('gulp-sourcemaps');
var ejs         = require('gulp-ejs');
var uglify      =require('gulp-uglify');
var cssmin      =require('gulp-minify-css');
var rename      = require('gulp-rename');
var del         = require('del');

//dev task start
//DONE can not compile the sass or less file
gulp.task('sass', function () {
  return gulp.src(['./public/sass/*.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass({errLogToConsole: true})
      .on('error', sass.logError))
    .pipe(prefix('last 2 versions', '> 1%', 'ie 8', 'Android 2'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/css'))
    .pipe(cssmin())
    // .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest('./public/dist/css'))
    .pipe(reload({stream: true}));
});

gulp.task('jsmin',function () {
  return gulp.src('./public/javascripts/**/*.js')
  .pipe(uglify())
  // .pipe(rename({suffix:'.min'}))
  .pipe(gulp.dest('./public/dist/js'))
  .pipe(reload({stream: true}));
})

gulp.task('browser-sync', ['nodemon'], function () {
  browserSync.init(null, {
    proxy: 'http://localhost:3000',
    files: ['public/**/*.*', 'app/views/**/*.*', 'submodule/**/*.*'],
    browser: 'google chrome',
    notify: false,
    port: 5000
  });
});

gulp.task('movesub', function () {
  return gulp.src(['./submodule/images/**/*.*'], {base: './submodule'})
    .pipe(gulp.dest('./public'))
});

gulp.task('nodemon', function (cb) {
  del(['./public/*.html']);

  var called = false;

  return nodemon({
    script: 'bin/www'
  }).on('start', function () {
    if (!called) {
      cb();
      called = true;
    }
  });
});
//dev task end

gulp.task('clean', function (cb) {
  del(['./dist/*'], cb)
});

gulp.task('copy', function () {
  return gulp.src([
    'public/css/**/*',
    'public/images/**/*',
    'public/js/**/*',
    'public/pageScripts/**/*'
  ], {base: './public'})
  .pipe(gulp.dest('./dist'))
});

//build task start
//DONE add build task
gulp.task('ejs', function () {
  return gulp.src(['app/views/**/*.ejs', '!views/layout/**/*.ejs', '!app/views/includes/**/*.ejs'])
    .pipe(ejs({pretty: true}))
    .pipe(gulp.dest('./dist'));
});
//build task end

gulp.task('dist', ['clean', 'copy', 'ejs']);

gulp.task('default', ['browser-sync','jsmin','sass', 'movesub'], function () {
  gulp.watch(['public/sass/**/*.*'], ['sass']);
});