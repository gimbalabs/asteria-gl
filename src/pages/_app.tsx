import Head from "next/head";
import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";
import { MeshProvider } from "@meshsdk/react";


import { api } from "~/utils/api";
import Layout from "../components/Layout";

import "~/styles/globals.css";
import "@meshsdk/react/styles.css";



const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className={GeistSans.className}>
      <Head>
        <title>Asteria GL</title>
        <meta name="description" content="Asteria built with T3 App + Mesh" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MeshProvider>
        <Layout> {/* ⬅️ Wrap all page content inside Layout */}
          <Component {...pageProps} />
        </Layout>
      </MeshProvider>
    </div>
  );
};

export default api.withTRPC(MyApp);
