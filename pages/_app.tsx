import { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import FloatButtons from "@/components/FloatButtons";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthContextProvider } from "../context/AuthContext";
import { CartContextProvier } from "@/context/CartContext";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  if (Component.getLayout)
    return Component.getLayout(
      <AuthContextProvider>
        <Component {...pageProps} />
      </AuthContextProvider>
    );

  return (
    <AuthContextProvider>
      <CartContextProvier>
        <NavBar />
        <FloatButtons />
        <main className="md:w-11/12 w-full m-auto overflow-y-hidden min-h-[calc(100vh-8rem)] md:min-h-[calc(100vh-26rem)] flex justify-center md:py-10 py-5 px-1">
          <Component {...pageProps} />
        </main>
        <Footer />
      </CartContextProvier>
    </AuthContextProvider>
  );
}
