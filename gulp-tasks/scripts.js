import gulp from 'gulp';
import logger from 'gulplog';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import changedInPlace from 'gulp-changed-in-place';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import webpackConfig from '../webpack.config.js';

import { PATHS } from '../config';

export default function scripts(done) {
  let firstBuildReady = false;

  function webpackDone(error, stats) {
    firstBuildReady = true;

    if (error) {
      // hard error, see https://webpack.github.io/docs/node.js-api.html#error-handling
      return; // emit('error', err) in webpack-stream
    }

    /*
     * https://webpack.js.org/api/node/#stats-object
     * https://webpack.js.org/configuration/stats/
     */
    logger[stats.hasErrors() ? 'error' : 'info'](
      stats.toString({
        chunks: false, // Makes the build much quieter
        modules: false,
        colors: true, // Shows colors in the console
      })
    );
  }

  return gulp
    .src(PATHS.src.scripts)
    .pipe(plumber({ errorHandler: notify.onError('Ошибка при сборке js') }))
    .pipe(changedInPlace({ firstPass: true }))
    .pipe(webpackStream(webpackConfig, webpack, webpackDone))
    .pipe(gulp.dest(PATHS.build.scripts))
    .on('data', () => {
      if (firstBuildReady) {
        done();
      }
    });
}
