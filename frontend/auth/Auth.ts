import type { AuthClass } from "@aws-amplify/auth/lib-esm/Auth";
import type { HubCapsule } from "@aws-amplify/core";
import { Hub, withSSRContext } from "aws-amplify";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React from "react";

export type AuthSSRContext = { Auth: AuthClass };
export const { Auth }: AuthSSRContext = withSSRContext();

// ----- //
function redirectTo(
  { res }: Pick<GetServerSidePropsContext, "res">,
  path: string
) {
  if (res.headersSent) return;
  res.writeHead(302, { Location: path });
  res.end();
}

export async function getServerSideUser(ctx: GetServerSidePropsContext) {
  const { Auth }: AuthSSRContext = withSSRContext(ctx);
  try {
    return await Auth.currentSession();
  } catch (e) {
    return null;
  }
}

export type AuthenticatedPageProps = {
  user: { email: string; sub: string };
};

export const authenticatedPage: GetServerSideProps = async ctx => {
  const user = await getServerSideUser(ctx);

  if (!user) {
    redirectTo(ctx, "/login");
    return { props: {} };
  }

  const userData = user.getIdToken().decodePayload();
  return { props: { user: userData } };
};

export const notAuthenticatedPage: GetServerSideProps = async ctx => {
  const user = await getServerSideUser(ctx);
  if (!user) return { props: {} };

  redirectTo(ctx, "/");
  return { props: {} };
};

// ----- //
type State = {
  loading: boolean;
  authenticated: boolean;
};

const initialState: State = {
  loading: true,
  authenticated: false
};

export function useIsAuthenticated() {
  const [state, setState] = React.useState(initialState);

  React.useEffect(() => {
    async function getAuthInfo() {
      try {
        await Auth.currentAuthenticatedUser();
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
