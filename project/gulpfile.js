var gulp = require('gulp'),
    del = require('del'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    react = require('gulp-react'),
    bower = require('gulp-main-bower-files');
    concat = require('gulp-concat');

var paths = {
    html: './index.html',
    scripts: ['js/markdown.js', 'js/*.jsx', 'js/*.js'],
    styles: 'style/*.css',
    examples: ['example/posts.json'],
    built: ['build/index.html', 'build/app.js']
};

gulp.task('example', function () {
  return gulp.src(paths.examples).pipe(gulp.dest('build/'));
});

gulp.task('scripts', function () {
  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
    .pipe(react())
    .pipe(uglify())
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/'));
});

gulp.task('html', function () {
  return gulp.src(paths.html).pipe(gulp.dest('build/'));
});

gulp.task('clean', function () {
  del.sync('build');
});

gulp.task('deploy', function () {
  return gulp.src(paths.built).pipe(gulp.dest('../'));
});

gulp.task('build', ['clean', 'example', 'scripts', 'html']);

gulp.task('default', ['build']);
