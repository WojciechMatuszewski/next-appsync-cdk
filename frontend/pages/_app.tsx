import React from "react";
import { CSSReset, ThemeProvider } from "@chakra-ui/core";
import { AppProps } from "next/app";
import { AmplifyProvider } from "../amplify/AmplifyProvider";
import { css, Global } from "@emotion/core";

function App({ Component, pageProps }: AppProps) {
  return (
    <PageContainer>
      <AmplifyProvider>
        <ThemeProvider>
          <CSSReset />
          <Component {...pageProps} />
        </ThemeProvider>
      </AmplifyProvider>
    </PageContainer>
  );
}

function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      <Global
        styles={css`
          html,
          body,
          #__next {
            width: 100vw;
            height: 100vh;
          }
        `}
      />
      {children}
    </React.Fragment>
  );
}

export default App;
