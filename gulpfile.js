var gulp = require('gulp');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var less = require('gulp-less');
gulp.task('default',['javascript','html', 'images', 'less', 'css']);

gulp.task('watch', function() {
    var watcher = ['client/partials/*.html', 'client/javascript/*.*', 'client/javascript/**/*.js', 'client/less/*.less'];
    watch(watcher, function() {
        gulp.start('default');
    });
})

gulp.task('javascript', function() {
    gulp.src(
        [
            'client/javascript/config.js',
            'client/javascript/crafty.min.js',
            'client/javascript/**/*.js',
            'client/javascript/binding.js',
            'client/javascript/script.js',
            'client/material/js/material.min.js',
            'client/material/js/ripples.min.js'
        ])
        .pipe(concat({path: 'script.js'}))
        .pipe(gulp.dest('./build/client/javascript'));
});

gulp.task('images', function() {
    gulp.src('client/img/*.*')
        .pipe(gulp.dest('./build/client/img'));
});

gulp.task('less', function() {
    gulp.src('client/less/*.less')
        .pipe(less())
        .pipe(gulp.dest('client/css'));
});

gulp.task('css', function() {
    gulp.src(
        ['client/css/*.*',
            'client/material/css/material-wfont.min.css',
            'client/material/css/material.min.css',
            'client/material/css/ripples.min.css'
    ]).pipe(concat({path: 'bundle.css'}))
        .pipe(gulp.dest('./build/client/css'));
});

gulp.task('html', function() {
    gulp.src([
        'client/partials/header.html',
        'client/partials/nav.html',
        'client/partials/charSelect.html',
        'client/partials/board.html',
        'client/partials/footer.html'
    ])
        .pipe(concat({path: 'index.html'}))
        .pipe(gulp.dest('./build/client'));
});