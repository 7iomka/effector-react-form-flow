/* eslint-disable @typescript-eslint/ban-types */
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import { gapPolyfillPlugin } from "./stylis-gap-polyfill-plugin";

// On the client side, Create a meta tag at the top of the <head> and set it as insertionPoint.
// This assures that styles are loaded first.
// It allows developers to easily override styles with other styling solutions, like CSS modules.
// See: https://github.com/emotion-js/emotion/issues/2790 if global styles will cause issues
function createEmotionCache() {
  let insertionPoint;

  if (typeof window !== "undefined") {
    const emotionInsertionPoint = document.querySelector<HTMLMetaElement>(
      'meta[name="emotion-insertion-point"]'
    );
    insertionPoint = emotionInsertionPoint ?? undefined;
  }

  return createCache({
    key: "mantine",
    insertionPoint,
    prepend: true,
    stylisPlugins: [prefixer, gapPolyfillPlugin]
  });
}

const mantineEmotionCache = createEmotionCache();

export { mantineEmotionCache };
