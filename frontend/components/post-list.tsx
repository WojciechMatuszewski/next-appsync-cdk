import { Button, Grid } from "@chakra-ui/core";
import gql from "fake-tag";
import React from "react";
import { useInfiniteQuery } from "react-query";
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
        numberOfLikes
        numberOfComments
        user {
          email
          id
        }
      }
    }
  }
`;

function dataToEdges(data?: (PostsQuery | undefined)[]) {
  if (!data) return [];
  return data.reduce((allPosts, currentBatch) => {
    if (!currentBatch) return allPosts;
    return allPosts.concat(...currentBatch.posts.edges);
  }, [] as PostsQuery["posts"]["edges"]);
}

function getPosts(_: string, cursor?: string) {
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
      refetchOnWindowFocus: false,
      getFetchMore: lastGroup => {
        if (!lastGroup) return false;

        return lastGroup.posts.cursor;
      },
      refetchIntervalInBackground: false
    }
  );

  const edges = dataToEdges(data);
  if (edges.length == 0) return <p>No results</p>;

  return (
    <Grid rowGap={2}>
      {edges.map(edge => {
        return <Post key={edge.id} post={edge} />;
      })}
      {canFetchMore && (
        <Button onClick={() => fetchMore()} isLoading={Boolean(isFetchingMore)}>
          Fetch more
        </Button>
      )}
    </Grid>
  );
}

export { PostList };
