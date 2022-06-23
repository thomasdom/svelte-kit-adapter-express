import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default [
	{
		input: {
			index: 'src/index.ts',
			handler: 'src/handler.ts'
		},
		output: {
			dir: 'files',
			format: 'esm'
		},
		plugins: [typescript(), nodeResolve(), commonjs(), json()],
		external: ['SERVER', 'MANIFEST', ...require('module').builtinModules]
	}
];
