import { createEvent, createStore, sample } from "effector";
import type { StaticPageContext } from "nextjs-effector";
// import { $$sitemap } from '@/entities/sitemap';

const started = createEvent<StaticPageContext>();
// const startedOnServer = createEvent<ServerPageContext>();
// const cookiesReady = createEvent();

const mounted = createEvent();

const $ready = createStore(false);

$ready.on(started, () => true);

// sample({
//   source: started,
//   filter: isServerPageContext,
//   target: startedOnServer,
// });

// sample({
//   source: started,
//   filter: isServerPageContext,
//   fn: (context) => context.req.cookies,
//   target: $cookies,
// });

// sample({
//   clock: started,
//   filter: isClientPageContext,
//   target: cookiesReady,
// });

// sample({
//   clock: $cookies,
//   target: cookiesReady,
// });

// Fetch sitemap once on app started
// sample({
//   source: started,
//   fn: () => {}, // don't remember this
//   target: $$sitemap.getSitemapFx,
// });

// debug(started, $ready);

// sample({
//   clock: cookiesReady,
//   target: loadCurrentUserFx,
// });

export { $ready, started, mounted };
