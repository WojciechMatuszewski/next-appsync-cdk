import type { AuthClass } from "@aws-amplify/auth/lib-esm/Auth";
import type { HubCapsule } from "@aws-amplify/core";
import { Hub, withSSRContext } from "aws-amplify";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult
} from "next";
import React from "react";

export type AuthSSRContext = { Auth: AuthClass };
export const { Auth }: AuthSSRContext = withSSRContext();

// ----- //
export function redirectTo(
  { res }: Pick<GetServerSidePropsContext, "res">,
  path: string
) {
  if (res.headersSent) return;
  res.writeHead(302, { Location: path });
  res.end();
}

type User = {
  email: string;
  sub: string;
};

export async function getServerSideUser(ctx: GetServerSidePropsContext) {
  const { Auth }: AuthSSRContext = withSSRContext(ctx);
  try {
    const user = await Auth.currentSession();
    return user.getIdToken().decodePayload() as User;
  } catch (e) {
    return null;
  }
}

export function authenticatedServerSideProps<P = unknown>(
  fn: (
    ctx: GetServerSidePropsContext,
    user: User
  ) => Promise<GetServerSidePropsResult<P>>
) {
  const getServerSideProps: GetServerSideProps = async ctx => {
    const user = await getServerSideUser(ctx);
    if (!user) {
      redirectTo(ctx, "/login");
      return { props: {} };
    }

    return await fn(ctx, user);
  };

  return getServerSideProps;
}

export type AuthenticatedPageProps = {
  user: User;
};

export const authenticatedPage: GetServerSideProps = async ctx => {
  const user = await getServerSideUser(ctx);

  if (!user) {
    redirectTo(ctx, "/login");
    return { props: {} };
  }

  return { props: { user } };
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
