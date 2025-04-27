import type { AppProps } from "next/app";

import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/router";

import { fontSans, fontMono } from "@/config/fonts";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@heroui/toast";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const router = useRouter();

  return (
    <SessionProvider session={session}>
      <HeroUIProvider navigate={router.push}>
        <ToastProvider />
        <NextThemesProvider>
          <Component {...pageProps} />
        </NextThemesProvider>
      </HeroUIProvider>
    </SessionProvider>
  );
}

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};
