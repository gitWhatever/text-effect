// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

const env = process.env.NODE_ENV;
const config = {
  input: 'src/index.js',
  plugins: [resolve(), babel({
    exclude: 'node_modules/**', // 只编译我们的源代码
  })],
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**', // 只编译我们的源代码
  },
};
if (env === 'cjs') {
  config.output = {
    file: 'lib/index.js',
    format: env,
    indent: false,
  };
}
if (env === 'dev' || env === 'pro') {
  config.output = {
    file: 'dist/index.js',
    format: 'umd',
    name: 'TextEffect',
    indent: false,
  };
}

if (env === 'pro') {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false,
      },
    })
  )
}

export default config;
