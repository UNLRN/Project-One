const gulp = require('gulp');
const gutil = require('gulp-util');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const cssbeautify = require('gulp-cssbeautify');

gulp.task('styles', function () {
	gulp.src('./assets/sass/app.sass')
	.pipe(sass())
	.pipe(autoprefixer({
		browsers: ['last 2 versions'],
		cascade: false
	}))
	.pipe(cssbeautify({
		indent: '    ',
		autosemicolon: true
	}))
	.pipe(gulp.dest('./assets/css'))
	.pipe(browserSync.reload({stream: true}))
	.on('error', gutil.log);
});

gulp.task('serve', function () {
	browserSync.init({
		server: {
			baseDir: './'
		}
	});

	gulp.watch('./assets/sass/**/*.sass', ['styles']);
	gulp.watch('./assets/javascript/**/*.js').on('change', browserSync.reload);
	gulp.watch('./**/*.html').on('change', browserSync.reload);
});

gulp.task('default', ['styles', 'serve']);