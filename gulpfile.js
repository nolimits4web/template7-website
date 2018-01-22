(function(){
    'use strict';
    var gulp = require('gulp'),
        connect = require('gulp-connect'),
        open = require('gulp-open'),
        less = require('gulp-less'),
        jade = require('gulp-jade'),
        path = require('path'),
        fs = require('fs'),
        paths = {
            root: './',
            css: './css',
            js: './js',
            src: './src',
            jade: './src/jade',
            less: './src/less',
        },
        pages = [
            {
                src: './src/jade/index/index.jade',
                dest: './'
            }
        ],
        styles = [
            {
                src: './src/less/main.less',
                dest: './css/'
            }
        ];

    /* ==================================================================
    Build
    ================================================================== */
    gulp.task('less', function (cb) {
        var cbs = 0;
        styles.forEach(function (style) {
            gulp.src([style.src])
                .pipe(less({
                    paths: [ path.join(__dirname, 'less', 'includes') ]
                }))
                .pipe(gulp.dest(style.dest))
                .pipe(connect.reload())
                .on('end', function () {
                    cbs ++;
                    if (cbs === styles.length) cb();
                });
        });
    });
    gulp.task('jade', function (cb) {
        var cbs = 0;
        pages.forEach(function (page) {
            gulp.src([page.src])
                .pipe(jade({
                    pretty: true,
                }))
                .pipe(gulp.dest(page.dest))
                .pipe(connect.reload())
                .on('end', function () {
                    cbs ++;
                    if (cbs === pages.length) cb();
                });
        });
    });

    gulp.task('build', ['jade', 'less'], function (cb) {
        cb();
    });

    /* =================================
    Watch
    ================================= */
    gulp.task('watch', function () {
        gulp.watch(paths.less + '**/*.*', [ 'less' ]);
        gulp.watch(paths.jade + '**/**/*.*', [ 'jade' ]);
    });

    gulp.task('connect', function () {
        return connect.server({
            root: [ paths.root ],
            livereload: true,
            port:'3000'
        });
    });
    gulp.task('open', function () {
        return gulp.src('./index.html').pipe(open({ uri: 'http://localhost:3000/index.html'}));
    });

    gulp.task('server', [ 'watch', 'connect', 'open' ]);

    gulp.task('default', [ 'server' ]);

    gulp.task('test', [ 'build' ]);
})();