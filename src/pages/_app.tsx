// src/pages/_app.tsx
import { withTRPC } from "@trpc/next";
import type { AppRouter } from "../server/router";
import type { AppType } from "next/dist/shared/lib/utils";
import superjson from "superjson";
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";
import { AppErrorBoundary } from "../components/general/AppErrorBoundary";
import { Toaster } from "react-hot-toast";



const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {


  return (
    <AppErrorBoundary>
      <Toaster
        position="bottom-right"
        reverseOrder={true}
      />
      <SessionProvider session={session}>
          <Component {...pageProps} />
      </SessionProvider>
    </AppErrorBoundary>
  );
};

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return "";
  }
  if (process.browser) return ""; // Browser should use current path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  return `0.0.0.0:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      url,
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      queryClientConfig: { defaultOptions:
         { queries:
            { 
              refetchOnWindowFocus: false,
            } 
          } 
        },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp);
