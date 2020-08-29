import { CSSReset, ThemeProvider } from "@chakra-ui/core";
import { AppProps } from "next/app";
import { AppsyncProvider } from "../graphql/Appsync";

function App({ Component, pageProps }: AppProps) {
  return (
    <AppsyncProvider>
      <ThemeProvider>
        <CSSReset />
        <Component {...pageProps} />
      </ThemeProvider>
    </AppsyncProvider>
  );
}

export default App;
