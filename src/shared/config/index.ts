const baseConfig = {
  brandName: "XXX",
  twitterUsername: "@xxx",
  twitterURL: "https://twitter.com/xxx",
  instagramURL: "https://www.instagram.com/xxx",
  AppBaseURL:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_APP_BASE_URL
      : "http://localhost:3000",
  APIBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  themeKey: "app-theme",
  colorSchemeKey: "app-color-scheme",
  logoUrl: "/static/images/logo/logo_default__black_white.svg"
};

const metaDefaultConfig = {
  siteName: baseConfig.brandName || "",
  title:
    process.env.NEXT_PUBLIC_APP_STAGE === "production"
      ? baseConfig.brandName
      : `[${
          process.env.NEXT_PUBLIC_APP_STAGE === "staging" ? "Preview" : "Dev"
        }] ${baseConfig.brandName}`,
  description: "Тестовое meta описание",
  url: baseConfig.AppBaseURL || "",
  image: ""
};

const appConfig = {
  ...baseConfig,
  meta: metaDefaultConfig
};

export { appConfig };
