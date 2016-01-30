var gulp = require('gulp'),
    browserSync = require('browser-sync');

// use default task to launch Browsersync and watch JS files
gulp.task('serve', [], function () {

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./www"
        },
        files:["./www/css/**/*.css"]
    });
    gulp.watch("www/js/**/*.js").on('change', browserSync.reload);
    gulp.watch("www/templates/**/*.html").on('change', browserSync.reload);
});