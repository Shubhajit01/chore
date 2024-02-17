import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { HelmetProvider } from "react-helmet-async";
import { APP_CONFIG } from "./constants/config";

const client = new QueryClient();

const router = createRouter({
  routeTree,
  context: { queryClient: client, session: null },
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <HelmetProvider>
      <Helmet titleTemplate={`%s | ${APP_CONFIG.title}`} />
      <QueryClientProvider client={client}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
