import { withSSRContext } from "aws-amplify";
import type { GraphQLAPIClass, GraphQLResult } from "@aws-amplify/api-graphql";
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
import { GetServerSidePropsContext } from "next";

const getAPI = (ctx?: GetServerSidePropsContext) => {
  const { API } = withSSRContext(ctx);
  return API as GraphQLAPIClass;
};

function request(API: GraphQLAPIClass) {
  return async function <
    QueryResult,
    Variables extends Record<string, unknown>
  >(documentNode: DocumentNode<QueryResult, Variables>, variables?: Variables) {
    const { data, errors } = (await API.graphql({
      query: documentNode,
      variables
    })) as GraphQLResult<QueryResult>;

    if (errors) throw errors;

    return data;
  };
}

export const { API } = { API: getAPI() };

export const graphqlRequest = request(API);

export const SSRGraphqlRequest = (ctx: GetServerSidePropsContext) =>
  request(getAPI(ctx));
