import {
  useToast,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading
} from "@chakra-ui/core";
import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { Auth, notAuthenticatedPage } from "../auth/auth";
import { SignInOpts } from "@aws-amplify/auth/lib-esm/types";

type FormData = {
  email: string;
  password: string;
};

function signIn(data: SignInOpts) {
  return Auth.signIn(data);
}

function Login() {
  const { register, handleSubmit } = useForm<FormData>();

  const toast = useToast();
  const router = useRouter();

  const [login, { isLoading }] = useMutation(signIn);

  async function onSubmit({ email, password }: FormData) {
    try {
      await login({ password, username: email });
      await router.push("/");
    } catch (e) {
      toast({
        title: "An error occurred",
        description: e.message,
        status: "error",
        isClosable: true
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="false">
      <fieldset>
        <Heading marginBottom="4" as="legend">
          Login
        </Heading>
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            type="email"
            id="email"
            name="email"
            ref={register}
            autoComplete="off"
          />
        </FormControl>
        <FormControl marginTop="4">
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input type="password" id="password" name="password" ref={register} />
        </FormControl>
        <Button
          type="submit"
          marginTop="4"
          width="full"
          variantColor="teal"
          isLoading={isLoading}
        >
          Login
        </Button>
      </fieldset>
    </form>
  );
}

export const getServerSideProps = notAuthenticatedPage;

export default Login;
