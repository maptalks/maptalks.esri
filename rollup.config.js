const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const terser = require('rollup-plugin-terser').terser;
const pkg = require('./package.json');

const production = process.env.BUILD === 'production';

const banner = `/*!\n * ${pkg.name} v${pkg.version}\n * LICENSE : ${pkg.license}\n * (c) 2016-${new Date().getFullYear()} maptalks.org\n */`;

const plugins = [
    nodeResolve({
    }),
    commonjs(),
];

if (production) {
    plugins.push(terser({
        compress: {
            pure_getters: true
        },
        output: {
            ecma: 2017,
            // keep_quoted_props: true,
            beautify: true,
            comments: '/^!/'
        }
    }));
}

module.exports = [
    {
        input: 'src/index.js',
        external: ['maptalks'],
        plugins: plugins,
        output: [
            {
                globals: {
                    'maptalks': 'maptalks'
                },
                extend: true,
                'sourcemap': production ? false : 'inner',
                'format': 'es',
                'banner': banner,
                'file': pkg.module
            },
            {
                globals: {
                    'maptalks': 'maptalks'
                },
                extend: true,
                'name': 'maptalks.esri',
                'sourcemap': production ? false : 'inner',
                'format': 'umd',
                'banner': banner,
                'file': pkg.main
            }
        ]
    }
];
