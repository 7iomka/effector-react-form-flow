import type { PropsWithChildren } from "react";
import type { EmotionCache } from "@emotion/react";
import { UIProvider } from "./ui-provider";

type AppProviderProps = {
  cache: EmotionCache;
};

const AppProvider = ({
  children,
  cache
}: PropsWithChildren<AppProviderProps>) => (
  <UIProvider cache={cache}>{children}</UIProvider>
);

export { AppProvider };
