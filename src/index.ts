import { handler } from './handler';
import compression from 'compression';
import express from 'express';

export const host = process.env.HOST || '0.0.0.0';
export const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const server = express();

server.use(
	compression({ threshold: 0 }),
	handler
);

server.listen(port, host, () => {
	console.log(`Listening on ${host}':'${port}`);
});

export { server };