import { Adapter } from '@sveltejs/kit';

interface AdapterOptions {
	out?: string;
	preCompress?: boolean;
	serverFile?: string;
}

export default function adapter(options?: AdapterOptions): Adapter;
