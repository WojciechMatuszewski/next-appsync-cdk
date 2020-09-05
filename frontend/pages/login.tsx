import {
  useToast,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  Box
} from "@chakra-ui/core";
import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { Auth } from "aws-amplify";

type FormData = {
  email: string;
  password: string;
};

function Login() {
  const { register, handleSubmit } = useForm<FormData>();
  const router = useRouter();

  const toast = useToast();

  async function onSubmit({ email, password }: FormData) {
    try {
      await Auth.signIn({
        password,
        username: email
      });

      router.push("/dashboard");
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
    <Box width="md" margin="0 auto" marginTop="4">
      <Heading marginBottom="4">Sign in</Heading>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="false">
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
        <Button type="submit" marginTop="4" width="full" variantColor="teal">
          Login
        </Button>
      </form>
    </Box>
  );
}

export default Login;
