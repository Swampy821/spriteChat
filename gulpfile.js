var gulp = require('gulp');
var concat = require('gulp-concat');
var watch = require('gulp-watch');

gulp.task('default',['javascript','html', 'images']);

gulp.task('watch', function() {
    var watcher = ['client/*.html', 'client/javascript/*.*', 'client/javascript/**/*.js'];
    watch(watcher, function() {
        gulp.start('default');
    });
})

gulp.task('javascript', function() {
    gulp.src(['client/javascript/*.js', 'client/javascript/**/*.js'])
        .pipe(concat({path: 'script.js'}))
        .pipe(gulp.dest('./build/client/javascript'));
});

gulp.task('images', function() {
    gulp.src('client/img/*.*')
        .pipe(gulp.dest('./build/client/img'));
});

gulp.task('html', function() {
    gulp.src([
        'client/*.html'
    ])
        .pipe(gulp.dest('./build/client'));
});