import gulp from 'gulp';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import gulpif from 'gulp-if';
import sourcemaps from 'gulp-sourcemaps';
import dartsass from 'sass';
import gulpsass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import cssmin from 'gulp-clean-css';

import { PRODUCTION } from '../config';
import { PATHS } from '../config';

const sass = gulpsass(dartsass);

export default function styles() {
  return gulp
    .src(PATHS.src.styles)
    .pipe(plumber({ errorHandler: notify.onError('Ошибка: <%= error.message %>') }))
    .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
    .pipe(sass({ includePaths: ['node_modules'] }))
    .pipe(autoprefixer())
    .pipe(gulpif(PRODUCTION, cssmin()))
    .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
    .pipe(gulp.dest(PATHS.build.styles));
}
