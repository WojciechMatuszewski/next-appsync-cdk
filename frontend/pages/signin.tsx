import { Amplify } from "aws-amplify";
import {
  useToast,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading
} from "@chakra-ui/core";
import { useRouter } from "next/dist/client/router";
import React from "react";
import { useForm } from "react-hook-form";

type FormData = {
  email: string;
  password: string;
};

function Signin() {
  const { register, handleSubmit } = useForm<FormData>();
  const router = useRouter();
  const toast = useToast();

  async function onSubmit({ email, password }: FormData) {
    console.log(Amplify.configure());
    try {
      await Amplify.Auth.signIn({
        password,
        username: email
      });

      router.push("/");
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
    <React.Fragment>
      <Heading>Sign in</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <FormLabel htmlFor="email">email</FormLabel>
          <Input type="email" id="email" name="email" ref={register} />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password">password</FormLabel>
          <Input type="password" id="password" name="password" ref={register} />
        </FormControl>
        <Button type="submit">Login</Button>
      </form>
    </React.Fragment>
  );
}

export default Signin;
