import { CSSReset, ThemeProvider } from "@chakra-ui/core";
import { AppProps } from "next/app";
import { AuthProvider } from "../auth/AuthProvider";
import { AppsyncProvider } from "../graphql/AppsyncProvider";

function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <AppsyncProvider>
        <ThemeProvider>
          <CSSReset />
          <Component {...pageProps} />
        </ThemeProvider>
      </AppsyncProvider>
    </AuthProvider>
  );
}

export default App;
