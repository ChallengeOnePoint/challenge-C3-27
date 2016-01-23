var gulp 								= require('gulp'),
		path 								= require('path'),
		htmlmin 						= require('gulp-htmlmin'),
		less 								= require('gulp-less'),
		autoprefixer				= require('gulp-autoprefixer'),
		minifyCSS						= require('gulp-minify-css'),
		concat							= require('gulp-concat'),
		gutil								= require('gulp-util'),
		uglify							= require('gulp-uglify'),
    browserSync         = require('browser-sync').create(), // Server browserSync
		// livereload					= require('gulp-livereload'),
		plumber							= require('gulp-plumber'),
		resolveDependencies	= require('gulp-resolve-dependencies'),
    iconfont            = require('gulp-iconfont'), // custom font from svg
    iconfontCss         = require('gulp-iconfont-css'), // custom font from svg
    del                 = require('del'),  // delete file and folder
    zip                 = require("gulp-zip"); // make a zip


// Get the actual day and month
var dateObj = new Date();
var month = dateObj.getUTCMonth() + 1; //months from 1-12
var day = dateObj.getUTCDate();
var newdate = '-'+day+'-'+month;

// Variables à modifier
var zipname = 'osco';


// Tache principal, actualise dist/ et lance le serveur et watch
gulp.task('build', ['html', 'less', 'onecss', 'js', 'plugins-js', 'plugins-css', 'image', 'fonts', 'connect', 'watch'], function() {
  console.log('Build OK');
  console.log('Serveur lancé...');
});

// Actualise dist sans lancer le serveur
gulp.task('update', ['html', 'less', 'onecss', 'cleancss', 'js', 'plugins-js', 'plugins-css', 'image', 'fonts'], function() {
  console.log('Update OK');
});

// Création de la custom font en fonction des SVG
gulp.task('iconfont', ['glyphicons'], function() {
  console.log('icon.css généré dans dist/css');
});

// Export le fichier dist après l'avoir actualisé
gulp.task('export', ['update', 'zip'], function() {
  console.log('Zip crée à retrouver à la racine du projet');
});

// Connect le server
gulp.task('connect', function() {
  browserSync.init({
      server: __dirname+"/front/dist"
  });
});

// Custom font with SVG
gulp.task('glyphicons', function() {
  return gulp.src('./front/glyphicons/**/*.svg') // où sont vos svg
    .pipe(iconfontCss({
      fontName: 'icons', // nom de la fonte, doit être identique au nom du plugin iconfont
      targetPath: '../css/icons.css', // emplacement de la css finale
      fontPath: '../fonts/' // emplacement des fontes finales
    }))
    .pipe(iconfont({
      fontName: 'icons' // identique au nom de iconfontCss
    }))
    .pipe( gulp.dest('./front/dist/fonts/') )
})

// Met le html dans dist
gulp.task('html', function () {
  return gulp.src('./front/*.html')
  	.pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(__dirname+'/front/dist'))
    .pipe(browserSync.stream());
});

// Process le less et le minifie
gulp.task('less', function () {
  return gulp.src('./front/css/style.less')
  	.pipe(plumber())
  	.pipe(plumber( function (error) {
        gutil.log(gutil.colors.red(error.message));
        gutil.beep();
        this.emit('end');
    }))
    .pipe(less())
		.pipe(autoprefixer({
		  browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1', 'IE 9'],
		  cascade: false
		}))
  	.pipe(minifyCSS())
  	.pipe(concat('style-less.css'))
  	.pipe(gulp.dest('./front/dist/css'));
});

// En présence de CSS dans le dossier /css
// gulp.task('css', function () {
//   return gulp.src('./front/css/**/*.css')
//     .pipe(plumber())
//     .pipe(plumber( function (error) {
//         gutil.log(gutil.colors.red(error.message));
//         gutil.beep();
//         this.emit('end');
//     }))
//     .pipe(concat('style-css.css'))
//     .pipe(minifyCSS())
//     .pipe(gulp.dest('./front/dist/css'));
// });

// Concatène tous les fichiers CSS de /dist en style.css et le minifie
gulp.task('onecss', ['less'], function () {
  del.sync(['./front/dist/css/style.css']);
  return gulp.src('./front/dist/css/*.css')
    .pipe(concat('style.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./front/dist/css'))
    .pipe(browserSync.stream());
});

// Clean le dossier dist pour ne laisser que style.css
gulp.task('cleancss', ['less', 'onecss'], function() {
  del.sync(['./front/dist/css/*', '!./front/dist/css/style.css']);
});

// Concatène et minifie le JS en fonction des dependences puis le met dans dist/js
gulp.task('js', function(){
  return gulp.src(['js/main.js'])
    .pipe(resolveDependencies({ pattern: /\* @requires [\s-]*(.*?\.js)/g })).on('error', function(err) {
				console.log(err.message);
    	})
    .pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./front/dist/js'))
    .pipe(browserSync.stream());
});

// En cas de présence de CSS pour des plugins
gulp.task('plugins-css', function () {
  return gulp.src('./front/plugins/*.css')
    .pipe(minifyCSS())
    .pipe(concat('plugins.css'))
    .pipe(gulp.dest('./front/dist/plugins'))
    .pipe(browserSync.stream());
});

// En cas de présence de JS pour des plugins
gulp.task('plugins-js', function () {
  return gulp.src('./front/plugins/*.js')
    .pipe(resolveDependencies({ pattern: /\* @requires [\s-]*(.*?\.js)/g })).on('error', function(err) {
        console.log(err.message);
      })
    .pipe(uglify())
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest('./front/dist/plugins'));
});

// Met les images dans dist/img
gulp.task('image', function () {
  return gulp.src('./front/img/**/*.{gif,jpg,png,svg}')
    .pipe(gulp.dest('./front/dist/img'));
});

// Met les fonts dans dist/fonts
gulp.task('fonts', function () {
  return gulp.src('./front/fonts/**/*.{ttf,woff,eof,svg}')
    .pipe(gulp.dest('./front/dist/fonts'));
});

// Export ZIP du dossier dist après update
gulp.task('zip', ['update'], function () {
  del.sync(['./'+zipname+newdate+'.zip']);
  return gulp.src([
    'dist/**/*'
  ])
  .pipe(zip(zipname+newdate+'.zip'))
  .pipe(gulp.dest('./'));
});

gulp.task('watch', function () {
	gulp.watch('front/*.html', ['html']);
  gulp.watch('front/css/**/*.less', ['less', 'onecss']);
  // gulp.watch('css/*.css', ['css', 'onecss']);
  gulp.watch('front/plugins/**/*.css', ['plugins-css']);
  gulp.watch('front/plugins/**/*.js', ['plugins-js']);
	gulp.watch('front/js/**/*.js', ['js']);
	gulp.watch('front/img/**/*.{gif,jpg,png,svg}', ['image']);
  gulp.watch('front/fonts/**/*.{ttf,woff,eof,svg}', ['fonts']);
  gulp.watch('front/glyphicons/**/*.svg', ['glyphicons']);
});