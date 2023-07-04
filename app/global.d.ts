import "@remix-run/cloudflare";

declare module "@remix-run/cloudflare" {
  type ExtendedAppLoadContext = {
    env: {
      DB: D1Database;
    };
  };

  interface AppLoadContext extends ExtendedAppLoadContext {}
}
