/* eslint-disable risxss/catch-potential-xss-react */
import type { DocumentContext } from "next/document";
import Document, { Head, Html, Main, NextScript } from "next/document";
import type DocumentRenderProps from "next/document";
import { createStylesServer, ServerStyles } from "@mantine/next";

import { mantineEmotionCache, globalPreflightStyle } from "@/app/ui-provider";

// import { appConfig } from '@steklo24/config/app';

const mantineStylesServer = createStylesServer(mantineEmotionCache);

/**
 * NOTE: `color-scheme-dark` className (from tailwind config) is required for tailwind `dark:some` classes to work
 * Add it to html tag when dark color scheme needed
 */
class AppDocument extends Document<DocumentRenderProps> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      styles: [
        initialProps.styles,
        <ServerStyles
          html={initialProps.html}
          server={mantineStylesServer}
          key="styles"
        />
      ]
    };
  }

  render() {
    return (
      <Html lang="ru" data-theme="default">
        <Head>
          <style
            id="preflight_style"
            type="text/css"
            dangerouslySetInnerHTML={{
              __html: globalPreflightStyle
            }}
          />
          {/* <style
            id="media_style"
            type="text/css"
            dangerouslySetInnerHTML={{ __html: mediaStyles }}
          /> */}
          <meta name="emotion-insertion-point" content="" />
          {/* <script
            id="color_scheme_handler"
            dangerouslySetInnerHTML={{
              __html: `
                try {
                  if (
                    localStorage['${appConfig.colorSchemeKey}'] === 'dark' ||
                    (!('${appConfig.colorSchemeKey}' in localStorage) &&
                      window.matchMedia('(prefers-color-scheme: dark)').matches)
                  ) {
                    document.documentElement.style.colorScheme = 'dark';
                    document.documentElement.classList.add('color-scheme-dark');
                    document.documentElement.classList.add('changing-color-scheme');
                  } else {
                    document.documentElement.style.colorScheme = '';
                    document.documentElement.classList.remove('changing-color-scheme');
                    document.documentElement.classList.remove('color-scheme-dark');
                  }
                } catch (_) {}
              `,
            }}
          /> */}
        </Head>
        <body>
          {/* <div
            style={{ position: 'absolute', width: 0, height: 0 }}
            dangerouslySetInnerHTML={{ __html: spriteContent }}
          /> */}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default AppDocument;
