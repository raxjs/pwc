import { rollup } from 'rollup';
import { join } from 'path';
import { gzipSize } from 'gzip-size';
import getBuildConfig from './rollup/config.build';
import type { DistTaskOptions } from './type';

const PWC_CORE_DIR = join(process.cwd(), 'packages/pwc');
const PWC_CORE_INPUT = join(PWC_CORE_DIR, 'src/index.ts');
const PWC_CORE_OUTPUT_DIR = join(PWC_CORE_DIR, 'dist');

/**
 * dist/
 * pwc.js
 * pwc.min.js
 *
 * es(esm + single file compile to es5)/
 *
 * esnext(esm + single file only compile ts)/
 */

function main() {
  // dist unminified
  buildDist({
    input: PWC_CORE_INPUT,
    output: join(PWC_CORE_OUTPUT_DIR, 'pwc.js'),
  });
  // dist minified
  buildDist({
    input: PWC_CORE_INPUT,
    output: join(PWC_CORE_OUTPUT_DIR, 'pwc.min.js'),
    minify: true,
  });
  // esm
  buildESM();
  // esnext
  buildESNext();
}

async function buildDist(options: DistTaskOptions) {
  let bundle;
  let buildFailed = false;
  try {
    // create a bundle
    bundle = await rollup(getBuildConfig(options));
  } catch (error) {
    buildFailed = true;
    // do some error reporting
    console.error(error);
  }
  if (bundle) {
    await bundle.write({
      file: options.output,
    });
    // closes the bundle
    await bundle.close();
  }
}

async function buildESM() {}

async function buildESNext() {}

main();
