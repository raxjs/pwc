const commonjs = require('@rollup/plugin-commonjs');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const livereload = require('rollup-plugin-livereload');
const css = require('rollup-plugin-css-only');
const pwc = require('rollup-plugin-pwc').default;
const sourcemaps = require('rollup-plugin-sourcemaps');
const replace = require('@rollup/plugin-replace');

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
    sourcemaps(),
    nodeResolve(),
    commonjs(),
    replace({
      'process.env.NODE_ENV': production ? '"production"' : '"development"',
    }),
    !production && serve(),
    // !production && livereload('public'),

  ],
  watch: {
    clearScreen: false,
  },
};
