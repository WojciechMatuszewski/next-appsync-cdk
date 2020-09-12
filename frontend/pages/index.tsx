import { Alert, AlertIcon, Divider } from "@chakra-ui/core";
import React from "react";
import {
  AuthenticatedPageProps,
  authenticatedServerSideProps
} from "../auth/auth";
import PostForm from "../components/post-form";
import { PostList } from "../components/post-list";
import { PostsDocument, PostsQuery } from "../graphql/generated/generated";
import { SSRGraphqlRequest } from "../graphql/graphql";

type Props = {
  data: PostsQuery;
  error: boolean;
};

function Index({ data, error }: Props & AuthenticatedPageProps) {
  return (
    <React.Fragment>
      <PostForm />
      <Divider mt="8" mb="8" />
      {error ? (
        <Alert status="error">
          <AlertIcon />
          An error occurred
        </Alert>
      ) : (
        <PostList initialData={data} />
      )}
    </React.Fragment>
  );
}

export const getServerSideProps = authenticatedServerSideProps<Props>(
  async (ctx, user) => {
    const graphqlRequest = SSRGraphqlRequest(ctx);

    try {
      const result = await graphqlRequest(PostsDocument);
      return {
        props: { data: result as any, error: false, user }
      };
    } catch (e) {
      console.log(e);
      return { props: { data: null as any, error: true, user } };
    }
  }
);

export default Index;
