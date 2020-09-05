import { Button, Flex, Heading, Spinner } from "@chakra-ui/core";
import React from "react";
import { useIsAuthenticated } from "../auth/Auth";
import { Auth } from "aws-amplify";

type DashboardProps = {
  authenticated: boolean;
};

function Dashboard() {
  const [submitting, setSubmitting] = React.useState(false);
  const toggleSubmitting = () => setSubmitting(prev => !prev);

  const { loading, authenticated } = useIsAuthenticated();

  async function onLogout() {
    toggleSubmitting();
    await Auth.signOut();
    toggleSubmitting();
  }

  async function onLogin() {
    toggleSubmitting();
    await Auth.signIn({ username: "foo@fo.com", password: "foo123" });
    toggleSubmitting();
  }

  if (loading)
    return (
      <Container>
        <Spinner />
      </Container>
    );

  if (!authenticated)
    return <NotAuthenticated onClick={onLogin} submitting={submitting} />;

  return <Authenticated onClick={onLogout} submitting={submitting} />;
}

export default Dashboard;

function Container({ children }: { children: React.ReactNode }) {
  return (
    <Flex
      width="full"
      height="full"
      alignContent="center"
      alignItems="center"
      justifyContent="center"
    >
      {children}
    </Flex>
  );
}
type AuthProps = {
  onClick: VoidFunction;
  submitting: boolean;
};
function Authenticated({ onClick, submitting }: AuthProps) {
  return (
    <Container>
      <Flex flexDirection="column">
        <Heading fontSize="4xl">Authenticated</Heading>
        <Button
          mt="4"
          onClick={onClick}
          isLoading={submitting}
          variantColor="teal"
        >
          Logout
        </Button>
      </Flex>
    </Container>
  );
}
function NotAuthenticated({ onClick, submitting }: AuthProps) {
  return (
    <Container>
      <Flex flexDirection="column">
        <Heading fontSize="4xl">Not authenticated</Heading>
        <Button
          mt="4"
          onClick={onClick}
          isLoading={submitting}
          variantColor="teal"
        >
          Login
        </Button>
      </Flex>
    </Container>
  );
}
