var gulp = require("gulp");
var ts = require("gulp-typescript");
var nodemon = require('gulp-nodemon');
var tsProject = ts.createProject("tsconfig.json");
var exec = require('child_process').exec
var restart = require('gulp-restart');

gulp.task('build', function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("./dist"))
});

gulp.task('watch', ['build'], () => {
    gulp.watch(['src/**/*.ts'], ['build']);
    gulp.start('run');
});

gulp.task('run', ['build'], () => {
    nodemon({
        delay: 10,
        script: 'dist/index.js',
        ext: 'ts',
        // exec: 'node --inspect-brk',
        // exec: 'node inspect',
        watch: 'src',
    })
});