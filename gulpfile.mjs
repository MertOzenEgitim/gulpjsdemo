import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import imagemin from 'gulp-imagemin';
import webpack from 'webpack-stream';
import webpackLib from 'webpack';
import htmlmin from 'gulp-htmlmin';
import browserSyncLib from 'browser-sync';

const sass = gulpSass(dartSass);
const browserSync = browserSyncLib.create();

// HTML
export const processHTML = () =>
  gulp.src('src/index.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());

// Sass
export const compileSass = () =>
  gulp.src('./src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());

// JS
export const processJS = () =>
  gulp.src('./src/js/**/*.js')
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.stream());

// Bundle
export const bundle = () =>
  gulp.src('./src/js/index.js')
    .pipe(webpack({
      mode: 'production',
      output: { filename: 'bundle.js' },
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: { loader: 'babel-loader' }
          }
        ]
      }
    }, webpackLib))
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.stream());

// Images
export const optimizeImages = () =>
  gulp.src('src/images/*', { encoding: false })
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
    .pipe(browserSync.stream());

// Watch & Serve
export const serve = () => {
  browserSync.init({ server: { baseDir: './dist' } });
  gulp.watch('./src/sass/**/*.scss', compileSass);
  gulp.watch('./src/js/**/*.js', gulp.series(processJS, bundle));
  gulp.watch('./src/images/**/*', optimizeImages);
  gulp.watch('./src/index.html', processHTML);
};

export const build = gulp.parallel(processHTML, compileSass, processJS, optimizeImages, bundle);
export default gulp.series(build, serve);