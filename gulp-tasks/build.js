import gulp from 'gulp';
import del from 'del';

export function delBuild() {
  return del('build');
}

export default function build() {
  return gulp.src(['assets/**/*', './*.html'], { base: '.' }).pipe(gulp.dest('build'));
}
