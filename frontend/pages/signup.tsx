import { Auth } from "aws-amplify";
import {
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

type FormData = {
  email: string;
  password: string;
};

function Signup() {
  const { register, handleSubmit } = useForm<FormData>();
  const router = useRouter();
  const toast = useToast();

  async function onSubmit({ email, password }: FormData) {
    try {
      await Auth.signUp({
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
      <Heading>Sign up</Heading>
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

export default Signup;
