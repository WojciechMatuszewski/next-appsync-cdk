import { Grid } from "@chakra-ui/core";
import gql from "fake-tag";
import React from "react";
import { PostsQuery } from "../graphql/generated/generated";
import { Post } from "./post";

const POSTS_QUERY = gql`
  query Posts {
    posts {
      id
      content
      createdAt
    }
  }
`;

type Props = {
  initialPosts?: PostsQuery["posts"];
};

function PostList({ initialPosts = [] }: Props) {
  if (initialPosts.length === 0) return <p>no posts</p>;

  return (
    <Grid rowGap={2}>
      {initialPosts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </Grid>
  );
}

export { PostList };
