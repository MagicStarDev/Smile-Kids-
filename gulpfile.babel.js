import gulp from 'gulp';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import eslint from 'gulp-eslint';
import exorcist from 'exorcist';
import browserSync from 'browser-sync';
import watchify from 'watchify';
import babelify from 'babelify';
import uglify from 'gulp-uglify';
import sass from 'gulp-sass';
import concat from 'gulp-concat';
import ifElse from 'gulp-if-else';
import cssnano from 'gulp-cssnano';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import sassLint from 'gulp-sass-lint';

watchify.args.debug = true;
// Allows us to serve files from our local systems
// Also refreshing our browser if there are changes
const sync = browserSync.create();

// Input file.
// 'src/app.js' is the entry file
watchify.args.debug = true;
var bundler = browserify('src/app.js', watchify.args);

// Babel transform
bundler.transform(babelify.configure({
	sourceMapRelative: 'src'
}));

// On updates compile
bundler.on('update', bundle);

function bundle() {
	return bundler.bundle()
		.on('error', function(error) {
			console.error('\nError: ', error.message, '\n');
			this.emit('end');
		})
		.pipe(exorcist('public/assets/js/bundle.js.map'))
	    .pipe(source('bundle.js'))
	    .pipe(buffer())
	    // PRODUCTION ------------------------------------
	    // When ready for website comment out below and 
	    .pipe(ifElse(process.env.NODE_ENV === 'production', uglify))
	    // uncomment out below
	    .pipe(gulp.dest('public/assets/js'));
}

// Sass
gulp.task('sass', function() {
	return gulp.src('src/sass/**/*.scss')
		.pipe(sassLint())
	    .pipe(sassLint.format())
	    .pipe(sassLint.failOnError())
		.pipe(sourcemaps.init())
		.pipe(sass()) //Using gulp-sass
		.pipe(concat('combined.css'))
		// PRODUCTION ------------------------------------
		// When ready for website comment out below and 
		.pipe(ifElse(process.env.NODE_ENV === 'production', cssnano))
		// uncomment out below
		// .pipe(cssnano())
		// PRODUCTION ------------------------------------
		.pipe(sourcemaps.write())
		.pipe(autoprefixer({
			browsers: ['last 2 versions', 'ie >= 9', 'and_chr >= 2.3']
		}))
		.pipe(gulp.dest('public/assets/stylesheets'));
})

gulp.task('default', ['transpile']);

// Track little bugs = lint
gulp.task('transpile', ['lint'], () => bundle());

gulp.task('lint', () => {
    return gulp.src(['src/**/*.js', 'gulpfile.babel.js'])
      .pipe(eslint())
      .pipe(eslint.format())
});

gulp.task('serve', ['transpile'], () => sync.init({ server: 'public' }))
gulp.task('js-watch', ['transpile'], () => sync.reload());

gulp.task('watch', ['serve'], () => {
  gulp.watch('src/**/*', ['js-watch', 'sass'])
  gulp.watch('public/assets/stylesheets/stylesheets.css', sync.reload)
  gulp.watch('public/index.html', sync.reload)
})



