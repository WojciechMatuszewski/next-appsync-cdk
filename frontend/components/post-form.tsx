import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Textarea
} from "@chakra-ui/core";
import React from "react";

function PostForm() {
  return (
    <form>
      <FormControl>
        <FormLabel hidden={true}>What's happening</FormLabel>
        <Textarea type="text" placeholder="What's happening?" resize="none" />
      </FormControl>
      <Flex mt="4" justifyContent="flex-end">
        <Button variantColor="teal">Post</Button>
      </Flex>
    </form>
  );
}

export default PostForm;
