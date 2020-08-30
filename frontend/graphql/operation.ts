import { API, graphqlOperation } from "aws-amplify";
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

async function graphqlRequest<QueryResult, Variables extends object>(
  documentNode: DocumentNode<QueryResult, Variables>,
  variables?: Variables
) {
  const { data, errors } = (await API.graphql({
    query: documentNode,
    variables
  })) as any;
  if (errors) throw errors;

  return data;
}

export { graphqlRequest };
