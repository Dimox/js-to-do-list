const browsersync = require('browser-sync').create();

export default function server(done) {
  browsersync.init({
    server: {
      baseDir: './',
    },
    notify: false,
    ghostMode: false,
    scrollProportionally: false,
    files: ['./*.html', 'assets/css/*.css', 'assets/js/*.js', 'src/svg/sprite.svg'],
  });
  done();
}
