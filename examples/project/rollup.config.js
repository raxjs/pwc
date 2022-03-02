import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import css from 'rollup-plugin-css-only';
import pwc from 'rollup-plugin-pwc';

const production = !process.env.ROLLUP_WATCH;

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require('child_process').spawn('npm', ['run', 'serve', '--', '--dev'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true,
      });

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    },
  };
}

export default {
  input: 'src/index.pwc',
  output: {
    file: 'public/build/index.js',
    format: 'iife',
    name: 'app',
  },
  plugins: [
    pwc({ emitCSS: true }),
    css({ output: 'index.css' }),
    resolve({
      browser: true,
      dedupe: ['pwc'],
    }),
    commonjs(),
    !production && serve(),
    !production && livereload('public'),

  ],
  watch: {
    clearScreen: false,
  },
};
