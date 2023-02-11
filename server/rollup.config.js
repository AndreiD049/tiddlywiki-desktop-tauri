import { defineConfig } from 'rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default defineConfig({
    input: './index.js',
    output: [
        {
            file: 'dist/index.cjs',
            format: 'commonjs',
        },
    ],
    external: ['tiddlywiki'],
    plugins: [nodeResolve({ preferBuiltins: true }), commonjs(), json()],
});
