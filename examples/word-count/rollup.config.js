const commonjs = require('@rollup/plugin-commonjs');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const livereload = require('rollup-plugin-livereload');
const css = require('rollup-plugin-css-only');
const pwc = require('rollup-plugin-pwc');


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

module.exports = {
  input: 'src/index.pwc',
  // external: ['pwc'],
  output: {
    file: 'public/dist/index.js',
    format: 'umd',
    name: 'app',
    sourcemap: 'inline',
  },
  plugins: [
    pwc({ include: /\.pwc$/ }),
    css({ output: 'index.css' }),
    nodeResolve(),
    commonjs(),
    !production && serve(),
    // !production && livereload('public'),

  ],
  watch: {
    clearScreen: false,
  },
};
