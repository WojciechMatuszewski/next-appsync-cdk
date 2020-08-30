import React from "react";
import { Auth, Hub } from "aws-amplify";
import config from "../config.json";
import type { HubCapsule } from "@aws-amplify/core";

const {
  "next-cdk-backend-dev": {
    region,
    authenticationFlow,
    cognitoPoolId,
    cognitoClientId
  }
} = config;

Auth.configure({
  region: region,
  authenticationFlowType: authenticationFlow,
  userPoolWebClientId: cognitoClientId,
  userPoolId: cognitoPoolId,
  cookieStorage: {
    domain: "localhost",
    secure: false
  }
});

type Props = {
  children: JSX.Element;
};

function AuthProvider({ children }: Props) {
  return children;
}

type State = {
  loading: boolean;
  authenticated: boolean;
};

const initialState: State = {
  loading: true,
  authenticated: false
};

function useIsAuthenticated() {
  const [state, setState] = React.useState(initialState);

  React.useEffect(() => {
    async function getAuthInfo() {
      try {
        await Auth.currentSession();
        setState({ loading: false, authenticated: true });
      } catch (e) {
        setState({ loading: false, authenticated: false });
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

export { AuthProvider, useIsAuthenticated };
