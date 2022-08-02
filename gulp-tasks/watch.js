import gulp from 'gulp';
import styles from './styles';
import html from './html';
import scripts from './scripts';
import { default as svg, cleanSvg } from './svg';

export default function watch() {
  gulp.watch(['src/html/*.html', 'src/html/parts/*.html'], html);
  gulp.watch('src/js/**/*.js', scripts);
  gulp.watch(['src/scss/*.scss', 'src/scss/**/*.scss'], styles);
  gulp.watch('src/svg/*.svg', gulp.series(cleanSvg, svg, html));
}
