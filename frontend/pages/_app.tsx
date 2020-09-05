import React from "react";
import { Box, CSSReset, ThemeProvider } from "@chakra-ui/core";
import { AppProps } from "next/app";
import { AmplifyProvider } from "../amplify/AmplifyProvider";
import { css, Global } from "@emotion/core";
import { Navigation } from "../components/navigation";
import { ReactQueryConfigProvider } from "react-query";

function App({ Component, pageProps }: AppProps) {
  const isAuthenticatedPage = pageProps.user?.email;

  return (
    <ReactQueryConfigProvider config={{ mutations: { throwOnError: true } }}>
      <PageContainer>
        <AmplifyProvider>
          <ThemeProvider>
            <CSSReset />
            <main className="page-main">
              <Navigation authenticated={Boolean(isAuthenticatedPage)} />
              <Box width="lg" margin="0 auto" marginTop="4" as="section">
                <Component {...pageProps} />
              </Box>
            </main>
          </ThemeProvider>
        </AmplifyProvider>
      </PageContainer>
    </ReactQueryConfigProvider>
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
          .page-main {
            width: 100vw;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }
        `}
      />
      {children}
    </React.Fragment>
  );
}

export default App;
