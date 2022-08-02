import gulp from 'gulp';
import posthtmlInclude from 'posthtml-include';
import posthtmlExpressions from 'posthtml-expressions';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import posthtml from 'gulp-posthtml';
import changedInPlace from 'gulp-changed-in-place';
import version from 'gulp-version-number';
import gulpif from 'gulp-if';
import htmlmin from 'gulp-html-minifier';

import { PRODUCTION } from '../config';
import { PATHS } from '../config';

export default function html() {
  const posthtmlPlugins = [
    posthtmlInclude({ root: 'src/html/' }),
    posthtmlExpressions({ locals: { homepage: false } }),
  ];
  const posthtmlOptions = {};
  return gulp
    .src(PATHS.src.html)
    .pipe(plumber({ errorHandler: notify.onError('Ошибка: <%= error.message %>') }))
    .pipe(posthtml(posthtmlPlugins, posthtmlOptions))
    .pipe(changedInPlace({ firstPass: true }))
    .pipe(
      version({
        value: '%TS%',
        append: {
          key: 'v',
          to: ['css', 'js'],
        },
      })
    )
    .pipe(
      gulpif(
        PRODUCTION,
        htmlmin({
          collapseWhitespace: true,
          removeComments: true,
          maxLineLength: 5000,
          minifyJS: true,
        })
      )
    )
    .pipe(gulp.dest(PATHS.build.html));
}
