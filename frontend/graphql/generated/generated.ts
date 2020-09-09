import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  AWSDateTime: String;
};


export type CreatePostInput = {
  content: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost: Post;
};


export type MutationCreatePostArgs = {
  input: CreatePostInput;
};

export type Post = {
  __typename?: 'Post';
  id: Scalars['ID'];
  content: Scalars['String'];
  createdAt: Scalars['AWSDateTime'];
  numberOfLikes: Scalars['Int'];
  numberOfComments: Scalars['Int'];
  user: User;
};

export type PostsConnection = {
  __typename?: 'PostsConnection';
  cursor?: Maybe<Scalars['String']>;
  hasNext: Scalars['Boolean'];
  edges: Array<Post>;
};

export type Query = {
  __typename?: 'Query';
  posts: PostsConnection;
};


export type QueryPostsArgs = {
  cursor?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  id?: Maybe<Scalars['ID']>;
  email: Scalars['String'];
};

export type CreatePostMutationVariables = Exact<{
  input: CreatePostInput;
}>;


export type CreatePostMutation = (
  { __typename?: 'Mutation' }
  & { createPost: (
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'content' | 'createdAt'>
  ) }
);

export type PostsQueryVariables = Exact<{
  cursor?: Maybe<Scalars['String']>;
}>;


export type PostsQuery = (
  { __typename?: 'Query' }
  & { posts: (
    { __typename?: 'PostsConnection' }
    & Pick<PostsConnection, 'cursor' | 'hasNext'>
    & { edges: Array<(
      { __typename?: 'Post' }
      & Pick<Post, 'id' | 'content' | 'createdAt'>
      & { user: (
        { __typename?: 'User' }
        & Pick<User, 'email' | 'id'>
      ) }
    )> }
  ) }
);


export const CreatePostDocument: DocumentNode<CreatePostMutation, CreatePostMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePostInput"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"content"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"createdAt"},"arguments":[],"directives":[]}]}}]}}]};
export const PostsDocument: DocumentNode<PostsQuery, PostsQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Posts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"posts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cursor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"hasNext"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"edges"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"content"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"createdAt"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]}]}}]}}]}}]}}]};