const gulp=require("gulp");
const sass=require("gulp-sass")(require("sass"));
const concat=require("gulp-concat");
const uglify=require("gulp-uglify");
const imagemin=require("gulp-imagemin");
const webpack=require("webpack-stream");

// gulp.task("hello",function(done){
//     console.log("Gulp çalıştı.");
//     done();
// });

// gulp.task("default",gulp.series("hello"));

// gulp.task("clear",function(done){
//     console.log("dist clear");
//     done();
// });

// gulp.task("scss",function(done){
//     console.log("scss converting");
//     done();
// });

// gulp.task("js",function(done){
//     console.log("js converting");
//     done();
// });

// gulp.task("build",gulp.parallel('scss','js'));
// gulp.task("default",gulp.series('clear','build'))


gulp.task("sass",function(){
    return gulp.src("./src/sass/**/*.scss")
    .pipe(sass().on('error',sass.logError))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task("js",function(){
    return gulp.src("./src/js/**/*.js")
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
});

gulp.task("images",function(){
    return gulp.src('src/images/*',{encoding:false})
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
});

gulp.task("watch",function(){
    gulp.watch('./src/sass/**/*.scss',gulp.series("sass"));
    gulp.watch('./src/js/**/*.js',gulp.series("js"));
    gulp.watch('./src/images/**/*',gulp.series("images"));
});

gulp.task("bundle",function(){
    return gulp.src('./src/js/index.js')
    .pipe(webpack({
        mode:"production",
        output:{filename:'bundle.js'},
        module:{
            rules:[
                {
                    test:/\.js$/,
                    exclude:/node_modules/,
                    use:{loader:'babel-loader'}
                }
            ]
        }
    }))
    .pipe(gulp.dest('./dist/js'));
})

gulp.task("build",gulp.parallel('sass','js','images','bundle'))
gulp.task("default",gulp.series("build","watch"));