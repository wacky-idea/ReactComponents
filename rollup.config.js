const packageConfig = require('./package.json')
const typescript = require('@rollup/plugin-typescript')
const postcss = require('rollup-plugin-postcss')

const copyright = `/*! ${packageConfig.name} v${packageConfig.version} | (c) ${new Date().getFullYear()} ${packageConfig.author} | Released under the ${packageConfig.license} License */`;

/**
 * @type {import('rollup').RollupOptions}
 */
module.exports = {
  input: packageConfig.typings,
  output: [
    {
      file: packageConfig.main,
      format: 'cjs',
      sourcemap: false,
      banner: copyright,
    },
    {
      file: packageConfig.module,
      format: 'esm',
      sourcemap: false,
      banner: copyright,
    },
    {
      file: packageConfig['umd:main'],
      format: 'umd',
      sourcemap: false,
      banner: copyright,
      // umd global attr name
      name: "ReactComponents",
      minifyInternalExports: true,
    }
  ],
  plugins: [
    postcss({
      extensions: ['.less'],
      // 压缩 css
      minimize: true
    }),
    typescript({
      compilerOptions: {
        lib: ["es5", "es6", "dom"],
        target: "es2015"
      },
      declaration: true,
      declarationDir: './',
    })
  ]
};
