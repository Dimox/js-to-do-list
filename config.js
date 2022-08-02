export const PRODUCTION = process.env.NODE_ENV == 'production';

export const PATHS = {
  build: {
    html: './',
    scripts: 'assets/js/',
    styles: 'assets/css/',
    svg: 'assets/img/',
  },
  src: {
    html: 'src/html/*.html',
    scripts: 'src/js/main.js',
    styles: 'src/scss/styles.scss',
    svg: 'src/svg/*.svg',
  },
  watch: {
    html: ['src/html/*.html', 'src/html/**/*.html'],
    scripts: 'src/js/**/*.js',
    styles: 'src/scss/**/*.scss',
    svg: 'src/svg/*.svg',
  },
};
