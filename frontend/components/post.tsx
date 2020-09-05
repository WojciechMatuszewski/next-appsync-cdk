import { Avatar, Box, Flex, Text } from "@chakra-ui/core";
import React from "react";

const userData = {
  username: "wojtek@wojtek.pl",
  post:
    "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Distinctio non at voluptatibus. Tenetur odit beatae amet qui, reprehenderit eaque, vero eveniet nihil repellat consequatur culpa dolore corporis est recusandae sint."
};

function Post() {
  return (
    <Flex p="4" bg="gray.50" borderRadius="4px">
      <Avatar />
      <Box ml="4">
        <Text mb="2">{userData.username}</Text>
        <Text>{userData.post}</Text>
      </Box>
    </Flex>
  );
}

export { Post };
