var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

var original= [
    'app/lib/pep.min.js',
    'app/lib/babylon.js',
    'app/lib/crypto-js.js',
    'app/lib/babylon.objFileLoader.js'
]

gulp.task('default',function(){
    gulp.src(original)
        .pipe(concat('vender.js'))
        .pipe(uglify().on('error', function(e){
            console.log(e);
        }))
        .pipe(gulp.dest('app/lib'))
});