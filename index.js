import { createReadStream, createWriteStream, existsSync, statSync, writeFileSync } from 'fs';
import { pipeline } from 'stream';
import glob from 'tiny-glob';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import zlib from 'zlib';

const pipe = promisify(pipeline);

const files = fileURLToPath(new URL('./files', import.meta.url).href);

/** @type {import('.').default} */
export default function adapter(opts = {}) {
	const { out = 'build', preCompress = false, serverFile } = opts;

	return {
		name: '@thomasdmgs/svelte-kit-adapter-express',
		/** @type {import('@sveltejs/kit').Builder} */
		// @ts-ignore
		async adapt(builder) {
			builder.rimraf(out);

			builder.log.minor('Copying assets');
			builder.writeClient(`${out}/client`);
			builder.writeServer(`${out}/server`);
			builder.writeStatic(`${out}/static`);
			builder.writePrerendered(`${out}/prerendered`);

			writeFileSync(`${out}/manifest.js`, `export const manifest = ${builder.generateManifest({
				relativePath: './server'
			})};\n`);

			builder.copy(files, out, {
				replace: {
					SERVER: './server/index.js', MANIFEST: './manifest.js'
				}
			});

			if (preCompress) {
				builder.log.minor('Compressing assets');
				await compress(`${out}/client`);
				await compress(`${out}/static`);
				await compress(`${out}/prerendered`);
			}
		}
	};
}

/**
 * @param {string} directory
 */
async function compress(directory) {
	if (!existsSync(directory)) {
		return;
	}

	const files = await glob('**/*.{html,js,json,css,svg,xml,wasm}', {
		cwd: directory, dot: true, absolute: true, filesOnly: true
	});

	await Promise.all(files.map((file) => Promise.all([compressFile(file, 'gz'), compressFile(file, 'br')])));
}

/**
 * @param {string} file
 * @param {'gz' | 'br'} format
 */
async function compressFile(file, format = 'gz') {
	const compress = format === 'br' ? zlib.createBrotliCompress({
		params: {
			[zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
			[zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
			[zlib.constants.BROTLI_PARAM_SIZE_HINT]: statSync(file).size
		}
	}) : zlib.createGzip({ level: zlib.constants.Z_BEST_COMPRESSION });

	const source = createReadStream(file);
	const destination = createWriteStream(`${file}.${format}`);

	await pipe(source, compress, destination);
}
