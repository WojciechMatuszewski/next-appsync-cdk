import React from "react";
import { Box, Button, Flex, Link, Text, useToast } from "@chakra-ui/core";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Auth } from "../auth/auth";
import { useMutation } from "react-query";

type Props = {
  authenticated: boolean;
};
function Navigation({ authenticated }: Props) {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="4"
      bg="teal.500"
      color="white"
    >
      <Box
        display="flex"
        width={{ sm: "full", md: "auto" }}
        alignItems="center"
        flexGrow={1}
        as="ul"
      >
        {authenticated ? (
          <AuthenticatedNavigation />
        ) : (
          <NotAuthenticatedNavigation />
        )}
      </Box>
    </Flex>
  );
}

type MenuLinkProps = React.ComponentProps<typeof NextLink> & {
  children: React.ReactNode;
};

function MenuLink({ children, ...linkProps }: MenuLinkProps) {
  return (
    <Text mr={6} display="block" as="li">
      <NextLink {...linkProps}>
        <Link>{children}</Link>
      </NextLink>
    </Text>
  );
}

function signOut() {
  return Auth.signOut();
}

function AuthenticatedNavigation() {
  const router = useRouter();
  const toast = useToast();

  const [logout, { isLoading }] = useMutation(signOut);

  async function handleOnLogout() {
    try {
      await logout();
      router.push("/login");
    } catch (e) {
      toast({
        status: "error",
        description: e.message,
        title: "An error occurred"
      });
    }
  }

  return (
    <React.Fragment>
      <MenuLink href="/">Home</MenuLink>
      <Button
        alignSelf="end"
        variant="ghost"
        variantColor="teal"
        isActive={true}
        isLoading={isLoading}
        onClick={handleOnLogout}
      >
        Logout
      </Button>
    </React.Fragment>
  );
}

function NotAuthenticatedNavigation() {
  return (
    <React.Fragment>
      <MenuLink href="/login">Login</MenuLink>
      <MenuLink href="/register">Register</MenuLink>
    </React.Fragment>
  );
}

export { Navigation };
