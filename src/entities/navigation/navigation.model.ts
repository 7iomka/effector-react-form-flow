// import { debug } from 'patronum';
import type { UrlObject } from 'url';
import { createEvent, createStore, scopeBind, createEffect, attach, sample } from 'effector';
import type { NextRouter } from 'next/router';

interface TransitionOptions {
  shallow?: boolean;
  locale?: string | false;
  scroll?: boolean;
  unstable_skipClientCache?: boolean;
}
export interface NextHistoryState {
  url: string;
  as: string;
  options: TransitionOptions;
}

// router
export const historyChanged = createEvent<string>();
export const beforePopstateChanged = createEvent<NextHistoryState>();

export const $url = createStore('').on(historyChanged, (_, v) => v);

export const attachRouter = createEvent<NextRouter>();

export const $router = createStore<NextRouter | null>(null).on(attachRouter, (_, r) => r);

// On app started run this function in useEffect
export const initializeClientHistoryFx = createEffect((router: NextRouter) => {
  const boundHistoryChange = scopeBind(historyChanged);
  router.events.on('routeChangeComplete', (url: string) => {
    boundHistoryChange(url);
  });
});

export const subscribeToBeforePopstateFx = createEffect((router: NextRouter) => {
  const boundBeforePopstateChanged = scopeBind(beforePopstateChanged);
  router?.beforePopState((state) => {
    boundBeforePopstateChanged(state);
    return true;
  });
});

sample({
  clock: attachRouter,
  target: subscribeToBeforePopstateFx,
});

// effect to get location search part using router
export const getLocationFx = attach({
  source: $router,
  effect(router) {
    return router?.asPath;
  },
});

// effect to update location search part using router
export const updateLocationFx = attach({
  source: $router,
  effect(router, url: UrlObject | string) {
    router?.push(url, undefined, { shallow: true, scroll: false });
  },
});
// effect to update location search part using router
export const setQueryFx = attach({
  source: $router,
  effect(router, query: { [key: string]: string | string[] | undefined }) {
    // const {url: pageParam, ...onlyRealQueryParams} =  (router?.query || {})
    const newQuery = {
      ...(router?.query || {}),
    };

    for (const [key, val] of Object.entries(query)) {
      if (newQuery[key] && val === undefined) {
        delete newQuery[key];
      } else {
        newQuery[key] = val;
      }
    }

    router?.push(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      {
        shallow: true,
        scroll: false,
      },
    );

    console.log('router to push from set query', { query, newQuery });
  },
});
