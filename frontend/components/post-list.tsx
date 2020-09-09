import { Button, Grid } from "@chakra-ui/core";
import gql from "fake-tag";
import React from "react";
import { useInfiniteQuery, usePaginatedQuery, useQuery } from "react-query";
import { PostsDocument, PostsQuery } from "../graphql/generated/generated";
import { graphqlRequest } from "../graphql/graphql";
import { Post } from "./post";

const POSTS_QUERY = gql`
  query Posts($cursor: String) {
    posts(cursor: $cursor) {
      cursor
      hasNext
      edges {
        id
        content
        createdAt
        user {
          email
          id
        }
      }
    }
  }
`;

function getPosts(key: string, cursor?: string) {
  console.log(cursor, "invocation");
  return graphqlRequest(PostsDocument, { cursor });
}

type Props = {
  initialData: PostsQuery;
};

function PostList({ initialData }: Props) {
  const { fetchMore, data, canFetchMore, isFetchingMore } = useInfiniteQuery(
    "posts",
    getPosts,
    {
      initialData: [initialData],
      enabled: initialData.posts.hasNext,
      getFetchMore: lastGroup => {
        if (!lastGroup) return false;

        return lastGroup.posts.cursor;
      },
      refetchIntervalInBackground: false
    }
  );

  if (!data) return;

  return (
    <Grid rowGap={2}>
      {data.map(group => {
        if (!group) return null;
        return group.posts.edges.map(post => (
          <Post key={post.id} post={post} />
        ));
      })}
      <Button
        isDisabled={!canFetchMore}
        onClick={() => fetchMore()}
        isLoading={Boolean(isFetchingMore)}
      >
        Fetch more
      </Button>
    </Grid>
  );
}

export { PostList };
