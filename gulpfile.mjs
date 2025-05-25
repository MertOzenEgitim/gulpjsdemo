import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import imagemin from 'gulp-imagemin';

const sass = gulpSass(dartSass);

export const compileSass = () =>
  gulp.src('./src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'));

export const processJS = () =>
  gulp.src('./src/js/**/*.js')
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));

export const optimizeImages = () =>
  gulp.src('src/images/*', { encoding: false })
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'));

export const watchFiles = () => {
  gulp.watch('./src/sass/**/*.scss', compileSass);
  gulp.watch('./src/js/**/*.js', processJS);
  gulp.watch('./src/images/**/*', optimizeImages);
};

export const build = gulp.parallel(compileSass, processJS, optimizeImages);
export default gulp.series(build, watchFiles);