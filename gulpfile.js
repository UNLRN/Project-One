const gulp = require('gulp');
const gutil = require('gulp-util');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const autoprefixer = require('gulp-autoprefixer');
const cssbeautify = require('gulp-cssbeautify');
const nodemon = require('gulp-nodemon');

gulp.task('styles', function () {
	gulp.src('./public/stylesheets/sass/app.sass')
	.pipe(sass())
	.pipe(autoprefixer({
		browsers: ['last 2 versions'],
		cascade: false
	}))
	.pipe(cssbeautify({
		indent: '    ',
		autosemicolon: true
	}))
	.pipe(gulp.dest('./public/stylesheets/css'))
	.pipe(browserSync.reload({stream: true}))
	.on('error', gutil.log);
});

gulp.task('nodemon', function(done){
	let running = false;

	return nodemon({
		script: './bin/www',
		watch: ['./app.js']
	}).on('start', function() {
		if (!running) {
			done();
		}
		running = true;
	}).on('restart', function() {
		setTimeout(function() {
			reload();
		}, 500);
	});
});

gulp.task('browser-sync', ['nodemon'], function() {
	browserSync.init(null, {
		proxy: 'http://localhost:3000',
		port: 4000
	});
});

gulp.task('serve', ['browser-sync'], function() {
	gulp.watch('./public/stylesheets/sass/**/*.*', ['styles']);
	gulp.watch('./public/javascripts/**/*.*').on('change', reload);
	gulp.watch('./routes/**/*.*').on('change', reload);
	gulp.watch('./views/**/*.*').on('change', reload);
	gulp.watch('./app.js').on('change', reload);
});

// gulp.task('serve', function () {
// 	browserSync.init({
// 		server: {
// 			baseDir: './'
// 		}
// 	});

// 	gulp.watch('./sass/*.sass', ['styles']);
// 	gulp.watch('./assets/javascript/*.js').on('change', browserSync.reload)
// 	gulp.watch('./**/*.html').on('change', browserSync.reload);
// });

gulp.task('default', ['styles', 'serve']);