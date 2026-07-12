import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const startTime = Date.now();
    
    try {
      const url = new URL(request.url);
      
      // Handle /metrics endpoint
      if (url.pathname === '/metrics') {
        try {
          const { register } = await import('./lib/metrics');
          const metrics = await register.metrics();
          return new Response(metrics, {
            status: 200,
            headers: { 'content-type': register.contentType },
          });
        } catch (error) {
          console.error('Error generating metrics:', error);
          return new Response('Error generating metrics', { status: 500 });
        }
      }
      
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const normalizedResponse = await normalizeCatastrophicSsrResponse(response);
      
      // Record metrics
      const duration = Date.now() - startTime;
      try {
        const { httpRequestDuration, httpRequestTotal } = await import('./lib/metrics');
        const route = url.pathname;
        const method = request.method;
        
        httpRequestDuration
          .labels(method, route, normalizedResponse.status)
          .observe(duration / 1000);
        httpRequestTotal
          .labels(method, route, normalizedResponse.status)
          .inc();
      } catch (metricsError) {
        console.warn('Error recording request metrics:', metricsError);
      }
      
      return normalizedResponse;
    } catch (error) {
      console.error(error);
      
      // Record error metric
      try {
        const { applicationErrors } = await import('./lib/metrics');
        const url = new URL(request.url);
        applicationErrors
          .labels('unhandled', url.pathname)
          .inc();
      } catch (metricsError) {
        console.warn('Error recording error metric:', metricsError);
      }
      
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
