const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");
const webpack = require("webpack-stream");
const htmlmin = require("gulp-htmlmin");
const browserSync = require("browser-sync").create();

// HTML
gulp.task("html", function () {
  return gulp.src("src/index.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream());
});

// Sass
gulp.task("sass", function () {
  return gulp.src("./src/sass/**/*.scss")
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());
});

// JS
gulp.task("js", function () {
  return gulp.src("./src/js/**/*.js")
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.stream());
});

// Bundle
gulp.task("bundle", function () {
  return gulp.src('./src/js/index.js')
    .pipe(webpack({
      mode: "production",
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
    }))
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.stream());
});

// Images
gulp.task("images", function () {
  return gulp.src('src/images/*', { encoding: false })
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
    .pipe(browserSync.stream());
});

// Server + Watch
gulp.task("serve", function () {
  browserSync.init({ server: { baseDir: "./dist" } });
  gulp.watch('./src/sass/**/*.scss', gulp.series("sass"));
  gulp.watch('./src/js/**/*.js', gulp.series("js", "bundle"));
  gulp.watch('./src/images/**/*', gulp.series("images"));
  gulp.watch('./src/index.html', gulp.series("html"));
});

// Build + Default
gulp.task("build", gulp.parallel('html', 'sass', 'js', 'images', 'bundle'));
gulp.task("default", gulp.series("build", "serve"));