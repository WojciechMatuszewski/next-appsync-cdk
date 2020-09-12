import { Button, Flex, Icon, Text } from "@chakra-ui/core";
import gql from "fake-tag";
import React from "react";
import { PostsQuery } from "../graphql/generated/generated";
import { graphqlRequest } from "../graphql/graphql";
import {
  CanLikeDocument,
  LikePostDocument
} from "../graphql/generated/generated";
import { useMutation, useQuery } from "react-query";

const CAN_LIKE_QUERY = gql`
  query CanLike($ID: ID!) {
    canLike(ID: $ID)
  }
`;

const LIKE_POST_MUTATION = gql`
  mutation LikePost($ID: ID!) {
    likePost(ID: $ID)
  }
`;

type Props = {
  post: PostsQuery["posts"]["edges"][0];
};

function canLikePost(_: string, ID: string) {
  return graphqlRequest(CanLikeDocument, { ID });
}

function likePost(ID: string) {
  return graphqlRequest(LikePostDocument, { ID });
}

function PostLikes({ post }: Props) {
  const { isLoading, isError, data } = useQuery(
    ["canLike", post.id],
    canLikePost
  );

  const [mutate, { isLoading: isLiking }] = useMutation(likePost);

  async function handleOnLikeClick() {
    try {
      const result = await mutate(post.id);
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  }

  const shouldButtonBeDisabled = isLoading || !data || !data.canLike || isError;

  return (
    <Button
      as={Flex}
      alignItems="center"
      variant="ghost"
      isLoading={isLiking}
      isDisabled={shouldButtonBeDisabled}
      onClick={handleOnLikeClick}
    >
      <Icon name="star" mr="1" />
      <Text>{post.numberOfLikes}</Text>
    </Button>
  );
}

export { PostLikes };
