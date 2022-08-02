import gulp from 'gulp';
import html from './gulp-tasks/html';
import styles from './gulp-tasks/styles';
import scripts from './gulp-tasks/scripts';
import svg from './gulp-tasks/svg';
import watch from './gulp-tasks/watch';
import server from './gulp-tasks/server';
import githubPages from './gulp-tasks/github-pages';
import { default as build, delBuild } from './gulp-tasks/build';

gulp.task('development', gulp.parallel(html, styles, scripts, svg));
gulp.task('production', gulp.series('development', delBuild, build));
gulp.task('default', gulp.parallel('development', watch, server));
gulp.task('githubPages', gulp.series(delBuild, build, githubPages));
