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
};

export type Todo = {
  __typename?: 'Todo';
  id: Scalars['ID'];
  content: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  todo: Todo;
  todos?: Maybe<Array<Todo>>;
};


export type QueryTodoArgs = {
  id: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  todo?: Maybe<Todo>;
};


export type MutationTodoArgs = {
  input: TodoInput;
};

export type TodoInput = {
  content: Scalars['String'];
};

export type TodosQueryVariables = Exact<{ [key: string]: never; }>;


export type TodosQuery = (
  { __typename?: 'Query' }
  & { todos?: Maybe<Array<(
    { __typename?: 'Todo' }
    & Pick<Todo, 'id' | 'content'>
  )>> }
);

export type CreateTodoMutationVariables = Exact<{
  input: TodoInput;
}>;


export type CreateTodoMutation = (
  { __typename?: 'Mutation' }
  & { todo?: Maybe<(
    { __typename?: 'Todo' }
    & Pick<Todo, 'id' | 'content'>
  )> }
);


export const TodosDocument: DocumentNode<TodosQuery, TodosQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Todos"},"variableDefinitions":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"todos"},"arguments":[],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"content"},"arguments":[],"directives":[]}]}}]}}]};
export const CreateTodoDocument: DocumentNode<CreateTodoMutation, CreateTodoMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTodo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TodoInput"}}},"directives":[]}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"todo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"directives":[],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"},"arguments":[],"directives":[]},{"kind":"Field","name":{"kind":"Name","value":"content"},"arguments":[],"directives":[]}]}}]}}]};