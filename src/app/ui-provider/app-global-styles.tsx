// import { css, Global as GlobalCss } from '@emotion/react';
import { Global } from "@mantine/core";

const AppGlobalStyles = () => (
  <>
    <Global
      styles={(theme) => ({
        ":disabled": {
          pointerEvents: "none"
        }
        // ...other global styles
      })}
    />
  </>
);

export { AppGlobalStyles };
