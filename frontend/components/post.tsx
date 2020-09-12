import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  IconButton,
  Text
} from "@chakra-ui/core";
import React from "react";
import { PostsQuery } from "../graphql/generated/generated";
import { PostLikes } from "./post-likes";

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
        <Flex mt="4">
          <Button as={Flex} alignItems="center" variant="ghost">
            <Icon name="chat" mr="1" />
            <Text>{post.numberOfComments}</Text>
          </Button>
          <PostLikes post={post} />
        </Flex>
      </Box>
    </Flex>
  );
}

export { Post };
