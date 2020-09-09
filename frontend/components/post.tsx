import { Avatar, Box, Flex, Icon, Text } from "@chakra-ui/core";
import React from "react";
import { PostsQuery } from "../graphql/generated/generated";

type Props = {
  post: PostsQuery["posts"]["edges"][0];
};

function Post({ post }: Props) {
  return (
    <Flex p="4" bg="gray.50" borderRadius="4px">
      <Avatar />
      <Box ml="4">
        <Flex mb="2" alignItems="center">
          <Icon name="email" mr="2" color="blue.500" />
          <Text color="blue.500" fontWeight="bold">
            {post.user.email}
          </Text>
        </Flex>
        <Text>{post.content}</Text>
      </Box>
    </Flex>
  );
}

export { Post };
