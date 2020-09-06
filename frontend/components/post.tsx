import { Avatar, Box, Flex, Text } from "@chakra-ui/core";
import React from "react";
import { PostsQuery } from "../graphql/generated/generated";

type Props = {
  post: PostsQuery["posts"][0];
};

function Post({ post }: Props) {
  return (
    <Flex p="4" bg="gray.50" borderRadius="4px">
      <Avatar />
      <Box ml="4">
        <Text mb="2">TODO</Text>
        <Text>{post.content}</Text>
      </Box>
    </Flex>
  );
}

export { Post };
