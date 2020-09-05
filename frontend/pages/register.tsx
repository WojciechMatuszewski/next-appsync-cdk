import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useToast
} from "@chakra-ui/core";
import { useRouter } from "next/dist/client/router";
import { useForm } from "react-hook-form";
import React from "react";
import { Auth, notAuthenticatedPage } from "../auth/auth";
import { SignUpParams } from "@aws-amplify/auth/lib-esm/types";
import { useMutation } from "react-query";

async function signUp(params: SignUpParams) {
  await Auth.signUp(params);
}

type FormData = {
  username: string;
  password: string;
};

function Register() {
  const { register: registerField, handleSubmit } = useForm<FormData>();

  const router = useRouter();
  const toast = useToast();

  const [register, { isLoading }] = useMutation(signUp);

  async function onSubmit(data: FormData) {
    try {
      await register(data);

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
          Register
        </Heading>
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            type="email"
            id="email"
            name="username"
            ref={registerField}
            autoComplete="off"
          />
        </FormControl>
        <FormControl marginTop="4">
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            type="password"
            id="password"
            name="password"
            ref={registerField}
          />
        </FormControl>
        <Button
          type="submit"
          marginTop="4"
          width="full"
          variantColor="teal"
          isLoading={isLoading}
        >
          Register
        </Button>
      </fieldset>
    </form>
  );
}

export const getServerSideProps = notAuthenticatedPage;

export default Register;
