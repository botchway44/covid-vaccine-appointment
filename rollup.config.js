import sass from 'rollup-plugin-sass';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import { string } from 'rollup-plugin-string';
import babel from '@rollup/plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import { nodeResolve } from '@rollup/plugin-node-resolve';

import sourceMaps from 'rollup-plugin-sourcemaps';



import pkg from './config/widget.package.json';

const banner =
  `/**
 * ${pkg.name}@${pkg.version}
 * ${pkg.repository.url}
 * @author ${pkg.author} (@botchway44)
 * @license ${pkg.license}
 */
`;

const commonPlugins = [
  sass(),
  string({
    include: ['src/widget/assets/**/*.svg']
  }),
];

const umdOutOptions = {
  format: 'umd',
  name: 'dialogFlowChatWidget',
  globals: {
    "@googlemaps/js-api-loader": 'jsApiLoader',
    // "google.maps": "google",
  },
  banner: banner
};

export default [
  {
    input: 'src/widget/index.ts',
    output: {
      file: pkg.module,
      format: 'es',
      banner: banner,
    },
    plugins: [

      typescript({
        target: 'es2017'
      }),
      ...commonPlugins,

      resolve(),

      nodeResolve(),

      // Resolve source maps to the original source
      sourceMaps(),

    ],
    external: [
      'tslib'
    ]
  },

  {
    input: 'src/widget/index.ts',
    output: [
      {
        file: 'dist/dialogflowcx-chat-widget.js',
        ...umdOutOptions,
      },
      {
        file: 'dist/dialogflowcx-chat-widget.min.js',
        sourcemap: true,
        ...umdOutOptions,
        plugins: [
          terser()
        ]
      },
    ],
    plugins: [


      typescript({
        target: 'esnext'
      }),

      babel({
        extensions: ['.ts', '.js'],
        presets: [
          [
            '@babel/preset-env', {
              targets: 'supports custom-elementsv1 and supports shadowdomv1'
            }
          ],
        ],
        babelHelpers: 'bundled'
      }),
      ...commonPlugins,

      // Allow node_modules resolution, so you can use 'external' to control
      // which external modules to include in the bundle
      // https://github.com/rollup/rollup-plugin-node-resolve#usage
      resolve(),

      nodeResolve(),
      // Resolve source maps to the original source
      sourceMaps(),
    ],
    external: [
      // "@googlemaps/js-api-loader",
      'uuid'
    ]
  },

];
