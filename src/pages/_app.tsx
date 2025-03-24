import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";
import { MeshProvider } from "@meshsdk/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import "@meshsdk/react/styles.css";



const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className={GeistSans.className}>
      <MeshProvider>
        <Component {...pageProps} />
      </MeshProvider>
      
    </div>
  );
};

export default api.withTRPC(MyApp);
