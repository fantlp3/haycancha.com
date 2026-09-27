// <define:__ROUTES__>
var define_ROUTES_default = {
  version: 1,
  include: ["/*"],
  exclude: [
    "/assets/*",
    "/favicon.ico",
    "/favicon-16x16.png",
    "/favicon-32x32.png",
    "/favicon-48x48.png",
    "/favicon-96x96.png",
    "/favicon-192x192.png",
    "/favicon-512x512.png",
    "/favicon-maskable-512x512.png",
    "/apple-touch-icon.png",
    "/site.webmanifest",
    "/robots.txt",
    "/sitemap.xml",
    "/ads.txt",
    "/og-default.jpg",
    "/placeholder.svg"
  ]
};

// ../../.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/pages-dev-pipeline.ts
import worker from "/sessions/rcw-01qsgjfwt56ffjzargkryyho/mnt/haycancha.com/.wrangler/tmp/pages-Gjn8KC/functionsWorker-0.8469046058703402.mjs";
import { isRoutingRuleMatch } from "/sessions/rcw-01qsgjfwt56ffjzargkryyho/.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/pages-dev-util.ts";
export * from "/sessions/rcw-01qsgjfwt56ffjzargkryyho/mnt/haycancha.com/.wrangler/tmp/pages-Gjn8KC/functionsWorker-0.8469046058703402.mjs";
var routes = define_ROUTES_default;
var pages_dev_pipeline_default = {
  fetch(request, env, context) {
    const { pathname } = new URL(request.url);
    for (const exclude of routes.exclude) {
      if (isRoutingRuleMatch(pathname, exclude)) {
        return env.ASSETS.fetch(request);
      }
    }
    for (const include of routes.include) {
      if (isRoutingRuleMatch(pathname, include)) {
        const workerAsHandler = worker;
        if (workerAsHandler.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return workerAsHandler.fetch(request, env, context);
      }
    }
    return env.ASSETS.fetch(request);
  }
};
export {
  pages_dev_pipeline_default as default
};
//# sourceMappingURL=2h3k4xzvh09.js.map
