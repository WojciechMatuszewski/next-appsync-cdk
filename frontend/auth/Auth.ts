import type { AuthClass } from "@aws-amplify/auth/lib-esm/Auth";
import type { HubCapsule } from "@aws-amplify/core";
import { Hub, withSSRContext } from "aws-amplify";
import React from "react";

const { Auth }: { Auth: AuthClass } = withSSRContext();

// function redirectToSignin(res: ServerResponse) {
//   res.writeHead(302, { Location: "/signin" });
//   res.end();
// }

// export type AuthenticatedPageProps = {
//   user: { email: string; sub: string };
// };
// export const authenticatedPage: GetServerSideProps = async ({ req, res }) => {
//   const { Auth }: { Auth: AuthClass } = withSSRContext({ req });
//   try {
//     const user = (await Auth.currentAuthenticatedUser()) as CognitoUser;
//     const session = user.getSignInUserSession();
//     if (!session) {
//       redirectToSignin(res);
//       return { props: {} };
//     }

//     const userAttributes = session.getIdToken().payload;
//     return { props: { user: userAttributes } };
//   } catch (e) {
//     res.writeHead(302, { Location: "/signin" });
//     res.end();
//     return { props: {} };
//   }
// };

type State = {
  loading: boolean;
  authenticated: boolean;
};

const initialState: State = {
  loading: true,
  authenticated: false
};

const LATENCY = 1000;

function useIsAuthenticated() {
  const [state, setState] = React.useState(initialState);

  React.useEffect(() => {
    async function getAuthInfo() {
      try {
        await Auth.currentAuthenticatedUser();
        setTimeout(() => {
          setState({ loading: false, authenticated: true });
        }, LATENCY);
      } catch (e) {
        setTimeout(() => {
          setState({ loading: false, authenticated: false });
        }, LATENCY);
      }
    }

    getAuthInfo();
  }, []);

  React.useEffect(() => {
    function listener({ payload: { event } }: HubCapsule) {
      switch (event) {
        case "signIn": {
          setState({ loading: false, authenticated: true });
          break;
        }
        case "signOut": {
          setState({ loading: false, authenticated: false });
          break;
        }
      }
    }

    const cleanup = Hub.listen("auth", listener);
    return () => cleanup();
  }, []);

  return state;
}

export { useIsAuthenticated };
