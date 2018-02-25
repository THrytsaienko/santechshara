var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync').create();
var del = require('del');
var rename = require('gulp-rename');
var gcmq = require('gulp-group-css-media-queries');
var svgSprite = require('gulp-svg-sprite');
var processors = [
    autoprefixer({
        browsers: ['last 10 version']
    })
];


// Basic configuration example
var config = {
    shape: {
        dimension: { // Set maximum dimensions
            maxWidth: 40,
            maxHeight: 40
        },
        spacing: { // Add padding
            padding: 5
        }
    },
    mode: {
        symbol: true // Activate the «symbol» mode
    }
};



gulp.task('sprites', function () {
    return gulp.src('src/assets/svg/*.svg')
        .pipe(svgSprite(config))
        .pipe(gulp.dest('docs/assets/svg'));
});

gulp.task('html', function () {
    return gulp.src('src/*.html')
        .pipe(gulp.dest('docs'))
});

gulp.task('css', function () {
    return gulp.src('src/assets/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(rename('style.css'))
        .pipe(gcmq())
        .pipe(gulp.dest('docs/assets'))
        .pipe(browserSync.stream())
});

gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: "./docs"
        }
    });
});

var reload = function (done) {
    browserSync.reload();
    done();
}

gulp.task('watch', function () {
    gulp.watch('src/**/*.html', gulp.series('html', reload));
    gulp.watch('src/assets/sass/**/*.scss', gulp.series('css'));
});

gulp.task('copy', function () {
    return gulp.src([
            'src/**/*.{jpg,png,jpeg,gif,ttf}'
        ])
        .pipe(gulp.dest('docs'))
});

gulp.task('clean', function () {
    return del('docs');
});

gulp.task('build', gulp.parallel('css', 'html', 'sprites', 'copy'));
gulp.task('start', gulp.parallel('watch', 'serve'));

gulp.task('default', gulp.series('clean', 'build', 'start'));