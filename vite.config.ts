import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

import icons from "unplugin-icons/vite";
import imports from "unplugin-auto-import/vite";
import paths from "vite-tsconfig-paths";

import { FontaineTransform } from "fontaine";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import { imagetools } from "vite-imagetools";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    paths(),
    imagetools(),
    icons({ compiler: "jsx", autoInstall: true, jsx: "react" }),
    imports({
      imports: [
        "react",
        {
          from: "@tanstack/react-query",
          imports: [
            "useQuery",
            "useMutation",
            "QueryClient",
            "useQueryClient",
            "useSuspenseQuery",
            "QueryClientProvider",
          ],
        },
        {
          from: "@tanstack/react-router",
          imports: [
            "Outlet",
            "Link",
            "getApi",
            "createFileRoute",
            "createLazyFileRoute",
          ],
        },
        {
          from: "react-helmet-async",
          imports: ["Helmet"],
        },
      ],
    }),
    FontaineTransform.vite({
      fallbacks: ["Arial"],
    }),
    TanStackRouterVite({
      routesDirectory: "./src/routes",
    }),
  ],
});
