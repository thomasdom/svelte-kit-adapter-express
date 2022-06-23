import './shims';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// @ts-ignore
import { getRequest, setResponse } from '@sveltejs/kit/node';
import express, { RequestHandler } from 'express';
// @ts-ignore
import { manifest } from 'MANIFEST';
// @ts-ignore
import { Server } from 'SERVER';

const server = new Server(manifest);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function serve(path: string, type: 'client' | 'static' | 'prerendered') {
	return (
		fs.existsSync(path) &&
		express.static(path, {
			etag: true,
			maxAge: type === 'client' ? 315360000 : 0,
			immutable: type === 'client',
			index: false
		})
	);
}

const ssr: RequestHandler = async (req, res) => {
	let request;

	try {
		request = await getRequest(`https://${req.headers.host}`, req);
	} catch (err) {
		res.statusCode = err.status || 400;
		res.end(err.reason || 'Invalid request body');
		return;
	}

	setResponse(
		res,
		await server.respond(request, {
			getClientAddress: () => req.socket?.remoteAddress
		})
	);
};

export const handler = [
	serve(path.join(__dirname, '/client'), 'client'),
	serve(path.join(__dirname, '/static'), 'static'),
	serve(path.join(__dirname, '/prerendered'), 'prerendered'),
	ssr
];
