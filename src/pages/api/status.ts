import type { APIRoute } from 'astro';
import { writeFile } from 'fs/promises';

export const POST: APIRoute = async ({ request }) => {
	try {
		// Parse the JSON body of the request
		const body = await request.json();
		const log = body.log;

		if (!log) {
			return new Response(JSON.stringify({ code: 1, message: 'Missing "log" in request body' }), { status: 400 });
		}

		const filePath = './public/status.json';
		const data = { log };

		// Write the log to the file
		await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
		console.log("Log saved to status.json");

		return new Response(JSON.stringify({ code: 0 }), { status: 200 });
	} catch (error) {
		console.error("Error handling POST request: ", error);
		return new Response(JSON.stringify({ code: 1, message: 'Failed to process request' }), { status: 500 });
	}
};
