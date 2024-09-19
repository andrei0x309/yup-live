/* eslint-disable no-undef */
import type { T_FRAME_API_BODY } from './types'


interface Env {
  ASSETS: Fetcher;
  AIRSTACK_KEY: string;
}

export default {
  async fetch (request, env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/miniapp')) {
      // get url from query
      const url = new URL(request.url);
      const query = url.searchParams;
      const urlToFetch = query.get('url');

      // check if method is POST
      if (request.method === 'POST') {
        const body = await request.json() as T_FRAME_API_BODY;
        const VERIFY_ENDPOINT = `https://fc-frames.koyeb.app/verify-message`;
        fetch(VERIFY_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
      }

      const jsonToSend = {
        "type": "form",
        "title": "Yup Link",
        "url": urlToFetch,
      }

      return new Response(JSON.stringify(jsonToSend), {
        headers: {
          'Content-Type': 'application/json',
        },
      });

    }
    // Otherwise, serve the static assets.
    // Without this, the Worker will error and no assets will be served.
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;