import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Textarea,
  useToast
} from "@chakra-ui/core";
import gql from "fake-tag";
import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import {
  CreatePostDocument,
  CreatePostInput
} from "../graphql/generated/generated";
import { graphqlRequest } from "../graphql/graphql";

const CREATE_POST_MUTATION = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      content
      createdAt
    }
  }
`;

type FormValues = {
  content: string;
};

function createPostMutation(input: CreatePostInput) {
  return graphqlRequest(CreatePostDocument, { input });
}

function PostForm() {
  const { register, handleSubmit } = useForm<FormValues>();
  const toast = useToast();

  const [createPost, { isLoading, data }] = useMutation(createPostMutation);

  async function onSubmit(values: FormValues) {
    try {
      await createPost(values);
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
    <form
      key={data ? data.createPost.id : "1"}
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormControl>
        <FormLabel hidden={true}>What's happening</FormLabel>
        <Textarea
          type="text"
          name="content"
          placeholder="What's happening?"
          resize="none"
          ref={register}
        />
      </FormControl>
      <Flex mt="4" justifyContent="flex-end">
        <Button variantColor="teal" isLoading={isLoading} type="submit">
          Post
        </Button>
      </Flex>
    </form>
  );
}

export default PostForm;
