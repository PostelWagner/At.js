var gulp = require('gulp'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    umd = require('gulp-umd'),
    uglify = require('gulp-uglify'),
    rename = require("gulp-rename"),
    cssmin = require('gulp-cssmin'),
    jasmine = require('gulp-jasmine-phantom'),
    util = require('gulp-util');

var name = 'jquery.atwho';

gulp.task('coffee', function() {
    gulp.src('src/*.coffee')
        .pipe(coffee({bare: true}).on('error', util.log))
        .pipe(gulp.dest('./build/js'));

    gulp.src('spec/**/*.coffee')
        .pipe(coffee({bare: true}).on('error', util.log))
        .pipe(gulp.dest('spec/build'))
});

gulp.task('concat', function() {
    fileList = [
        //'build/js/noConflict.js',
        'build/js/default.js',
        'build/js/app.js',
        'build/js/controller.js',
        'build/js/textareaController.js',
        'build/js/editableController.js',
        'build/js/model.js',
        'build/js/view.js',
        'build/js/api.js'
    ]
    gulp.src(fileList)
        .pipe(concat(name + ".js"))
        .pipe(gulp.dest('build'));
});

gulp.task('umd', function() {
  gulp.src('build/' + name + ".js")
    .pipe(umd({template: "umd.template.js"}))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('compress', function() {
    gulp.src('dist/js/' + name + '.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/js'));

    gulp.src('src/jquery.atwho.css').pipe(gulp.dest('dist/css'))
    gulp.src('dist/css/' + name + '.css')
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/css'));
});


gulp.task('jasmine', function () {
    gulp.src('spec/build/javascripts/*.spec.js')
        .pipe(jasmine({
            integration: true,
            specHtml: "specRunner.html"
            /* TODO: have to add css to spec
            vendor: [
                'bower_components/jquery/dist/jquery.js',
                'bower_components/Caret.js/dist/jquery.caret.js',
                'dist/js/jquery.atwho.js',
                'node_modules/jasmine-jquery/lib/*.js',
                'node_modules/jasmine-ajax/lib/*.js',
                'spec/helpers/*.js',
                'spec/build/spec_helper.js'
            ],
            */
        }));
});

gulp.task('compile', ['coffee', 'umd', 'concat']);
gulp.task('test', ['compile', 'jasmine']);
gulp.task('default', ['compile', 'compress']);
