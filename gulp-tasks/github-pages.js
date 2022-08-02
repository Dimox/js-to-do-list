import gulp from 'gulp';
import ghPages from 'gulp-gh-pages';

export default function githubPages() {
  return gulp.src('./build/**/*').pipe(ghPages());
}
