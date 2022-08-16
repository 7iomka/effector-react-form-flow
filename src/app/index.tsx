import type { ReactElement, ReactNode } from "react";
import React, { useEffect } from "react";
import type { AppProps } from "next/app";
import type { NextPage } from "next";
// import { MainErrorBoundary } from '@/shared/ui';
import type { EmotionCache } from "@emotion/react";
import { mantineEmotionCache } from "./ui-provider";
import { useRouter } from "next/router";

import { useUnit } from "effector-react";
import { $$navigation } from "@/entities/navigation";
import { withHocs } from "./hocs";
import { AppProvider } from "./app-provider.component";

// Configure validation
import "@/shared/lib/validation";

// Fix useLayoutEffect server warning
if (typeof window === undefined) {
  React.useLayoutEffect = React.useEffect;
}

type LayoutGetter = (page: ReactElement) => ReactNode;

type NextPageWithLayout = NextPage & {
  getLayout?: LayoutGetter;
};

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

type AppPropsWithLayout = MyAppProps & {
  Component: NextPageWithLayout;
};

const getFallbackLayout: LayoutGetter = (page) => page;

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = mantineEmotionCache;

const WrappedApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component?.getLayout ?? getFallbackLayout;
  const router = useRouter();
  const initializeClientHistory = useUnit(
    $$navigation.initializeClientHistoryFx
  );

  const routerAttached = useUnit($$navigation.attachRouter);
  routerAttached(router);

  useEffect(() => {
    $$navigation.attachRouter(router); // clientside only event
    initializeClientHistory(router);
    const pathnameRegex = /[^?#]+/u;
    const match = router.asPath.match(pathnameRegex);
    const pathname = match ? match[0] : router.asPath;

    console.log({ routerPathNameWithQuery: router.pathname, pathname, match });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    // <MainErrorBoundary>
    <AppProvider cache={clientSideEmotionCache}>
      {getLayout(<Component {...pageProps} />)}
    </AppProvider>
    // </MainErrorBoundary>
  );
};

const App = withHocs(WrappedApp);

export { App };
