'use strict';
const clc = require('cli-color');
require('dotenv').config({path: __dirname + '/../../.env'})

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    fs = require('fs'),
    msg = require('gulp-msg'),
    yaml = require('js-yaml'),
    csso = require('gulp-csso'),
    minify = require('gulp-minify'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    include = require('gulp-include'),
    imagemin = require('gulp-imagemin'),
    svgmin = require('gulp-svgmin'),
    gulpif = require('gulp-if'),
    rename = require('gulp-rename');

var config = loadConfig();
var isDev = false;

const env = process.env.APP_ENV;
if (env !== 'prod') {
    isDev = true;
    console.info(clc.green.bold('Env: Development'));
} else {
    isDev = false;
    console.info(clc.red.blink.bold('Env: Production'));
}

function loadConfig() {
    var ymlFile = fs.readFileSync('config.yml', 'utf8');
    return yaml.load(ymlFile);
}

/** STYLES **/
gulp.task('sass', function () {
    let isSuccess = true;
    return gulp.src([
        config.PATH.src + '/scss/styles.scss'
    ])
    .pipe(gulpif(isDev, sourcemaps.init()))
    .pipe(sass().on('error', function(error) {
        msg.Error('Sass error.');
        sass.logError(error);
    })).on('end', ()=> {
        if( isSuccess )
            msg.Success(clc.green('Sass success.'));
    })
    .pipe(concat('styles.css'))
    .pipe(autoprefixer({
        browsers: ['last 3 versions'],
        grid: true,
        cascade: false
    }))
    .pipe(gulpif(!isDev, csso()))
    .pipe(gulpif(!isDev, rename({
        suffix: '.min'
    })))
    .pipe(gulpif(isDev, sourcemaps.write('./').on('error', function(error) {
        msg.Error(clc.orange('Sourcemap CSS error.'));
        rename.logError(error);
    }).on('end', ()=> {
        if (isSuccess)
            msg.Success(clc.green('Sourcemap CSS success.'));
    })))

    .pipe(gulp.dest(config.PATH.web + '/css'))
    .pipe(connect.reload());
});

/** SCRIPTS **/
gulp.task('vendor', function () {
    let isSuccess = true;
    return gulp.src([
        config.PATH.src + '/js/vendor.js'
    ])
    .pipe(include().on('error', function(error) {
        msg.Error(clc.orange('Vendor-JS error.'));
        gulp.dest.logError(error);
    }).on('end', ()=> {
        if (isSuccess)
            msg.Success(clc.green('Vendor-JS success.'));
    }))

    .pipe(gulpif(!isDev, minify({
        ext:{
            min:'.min.js'
        }}).on('error', function(error) {
        msg.Error(clc.red('Minify vendor-JS error.'));
        minify.logError(error);
    }).on('end', ()=> {
        if (isSuccess)
            msg.Success(clc.green('Minify vendor-JS succes.'));
    })))
    //.pipe(gulpif(!isDev, rename({suffix: '.min'})))
    .on('error', console.log)
    .pipe(gulpif(isDev, sourcemaps.init()))
    .pipe(gulpif(isDev, sourcemaps.write('./').on('error', function(error) {
        msg.Error(clc.orange('Sourcemap vendor-JS error.'));
        gulp.dest.logError(error);
    }).on('end', ()=> {
        if (isSuccess)
            msg.Success(clc.green('Sourcemap vendor-JS success.'));
    })))
    .pipe(gulp.dest(config.PATH.web + '/js'))
    .pipe(connect.reload());
});

gulp.task('app', function () {
    let isSuccess = true;
    return gulp.src([
        config.PATH.src + '/js/app.js'
    ])
        .pipe(include().on('error', function(error) {
            msg.Error(clc.orange('App-JS error.'));
            gulp.dest.logError(error);
        }).on('end', ()=> {
            if (isSuccess)
                msg.Success(clc.green('App-JS success.'));
        }))

        .pipe(gulpif(!isDev, minify({
            ext:{
                min:'.min.js'
            }}).on('error', function(error) {
            msg.Error(clc.red('Minify app-JS error.'));
            minify.logError(error);
        }).on('end', ()=> {
            if (isSuccess)
                msg.Success(clc.green('Minify app-JS success.'));
        })))
        //.pipe(gulpif(!isDev, rename({suffix: '.min'})))
        .on('error', console.log)
        .pipe(gulpif(isDev, sourcemaps.init()))
        .pipe(gulpif(isDev, sourcemaps.write('./').on('error', function(error) {
            msg.Error(clc.orange('Sourcemap app-JS error.'));
            gulp.dest.logError(error);
        }).on('end', ()=> {
            if (isSuccess)
                msg.Success(clc.green('Sourcemap app-JS success.'));
        })))
        .pipe(gulp.dest(config.PATH.web + '/js'))
        .pipe(connect.reload());
});

/** SVG **/
gulp.task('miniSVG', function () {
    let isSuccess = true;
    return gulp.src(config.PATH.src + '/img/**/*.svg')
        .pipe(svgmin())
        .pipe(gulp.dest(config.PATH.web + '/img').on('error', function(error) {
            msg.Error(clc.orange('SVG not copied.'));
            gulp.dest.logError(error);
        }).on('end', ()=> {
            if (isSuccess)
                msg.Success(clc.green('SVG copied'));
        }))
});

/** IMAGES **/
gulp.task('images', function () {
    let isSuccess = true;
    return gulp.src(config.PATH.src + '/img/**/*.{png,jpg,gif}')
        .pipe(gulpif(!isDev, imagemin([
            imagemin.optipng({optimizationLevel: 3}),
            imagemin.jpegtran({progressive: true}),
        ]).on('error', function(error) {
            msg.Error(clc.orange('Images didn`t minimize.'));
            gulp.dest.logError(error);
        }).on('end', ()=> {
            if (isSuccess)
                msg.Success(clc.green('Images minimzied'));
        })))
        .pipe(gulp.dest(config.PATH.web + '/img').on('error', function(error) {
            msg.Error(clc.orange('Images didn`t copied.'));
            gulp.dest.logError(error);
        }).on('end', ()=> {
            if (isSuccess)
                msg.Success(clc.green('Images copied'));
        }))
});

/** FONTS **/
gulp.task('fonts', function () {
    let isSuccess = true;
    return gulp.src(config.PATH.src + '/fonts/**/*')
        .pipe(gulp.dest(config.PATH.web + '/fonts/').on('error', function(error) {
            msg.Error(clc.orange('Fonts didn`t copied.'));
            gulp.dest.logError(error);
        }).on('end', ()=> {
            if (isSuccess)
                msg.Success(clc.green('Fonts copied'));
        }));
});

/** WATCH **/
gulp.task('watch', ['sass', 'vendor', 'app'], function () {
    gulp.watch(config.PATH.src + '/scss/**/*.scss', ['sass']);
    gulp.watch(config.PATH.src + '/js/**/*.js', ['vendor', 'app']);
    gulpif(isDev, gulp.watch(config.PATH.src + '/img/**/*.{png,jpg,gif}', ['images']));
    gulpif(isDev, gulp.watch(config.PATH.src + '/img/**/*.svg', ['miniSVG']));
});

gulp.task('deploy', ['sass', 'vendor', 'app', 'images', 'miniSVG', 'fonts']);
