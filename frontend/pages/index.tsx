import {
  Button,
  Flex,
  FormControl,
  Input,
  List,
  ListItem,
  Spinner
} from "@chakra-ui/core";
import { gql } from "graphql.macro";
import React from "react";
import { queryCache, useMutation, useQuery } from "react-query";
import {
  CreateTodoDocument,
  CreateTodoMutation,
  TodosDocument,
  TodosQuery
} from "../generated/generated";
import { graphqlRequest } from "../graphql/operation";

export const TODOS_QUERY = gql`
  query Todos {
    todos {
      id
      content
    }
  }
`;

export const CREATE_TODO_MUTATION = gql`
  mutation CreateTodo($input: TodoInput!) {
    todo(input: $input) {
      id
      content
    }
  }
`;

async function createTodo(variables: { content: string }) {
  return await graphqlRequest(CreateTodoDocument, { input: variables });
}

async function getTodos() {
  return await graphqlRequest(TodosDocument);
}

function Index() {
  const [mutate, { isLoading }] = useMutation(createTodo);

  async function handleOnSubmit(content: string) {
    try {
      await mutate({ content }, { onSuccess: handleMutationSuccess });
    } catch (e) {
      console.log(e);
    }
  }

  function handleMutationSuccess(data: CreateTodoMutation | undefined) {
    queryCache.setQueryData<TodosQuery>("todos", oldTodos => {
      if (!oldTodos || !data) return { todos: [] };

      return { todos: [...(oldTodos.todos as any), data.todo] };
    });
  }

  return (
    <Flex
      direction="column"
      maxWidth={960}
      width="100%"
      margin="0 auto"
      marginTop={12}
    >
      <TodoForm loading={isLoading} onSubmit={handleOnSubmit} />
      <TodoList />
    </Flex>
  );
}

type FormProps = {
  loading: boolean;
  onSubmit: (content: string) => void;
};

function TodoForm({ loading, onSubmit }: FormProps) {
  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const {
      currentTarget: { elements }
    } = e;

    const content = (elements as any).content.value;
    onSubmit(content);
  }

  return (
    <form
      onSubmit={handleFormSubmit}
      key={`${loading}`}
      style={{ width: "100%" }}
    >
      <Flex>
        <FormControl flex={1}>
          <Input
            autoComplete="off"
            type="text"
            placeholder="Type here ..."
            id="content"
            name="content"
          />
        </FormControl>
        <Button
          marginLeft={6}
          type="submit"
          variantColor="teal"
          isLoading={loading}
        >
          Save
        </Button>
      </Flex>
    </form>
  );
}

function TodoList() {
  const { data, isLoading, error } = useQuery("todos", getTodos, {
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  });

  if (error) return <p>error..</p>;

  if (!data || !data.todos || isLoading) return <Spinner />;

  return (
    <List spacing={1} marginTop={6}>
      {data.todos.map(todo => (
        <ListItem key={todo.id}>{todo.content}</ListItem>
      ))}
    </List>
  );
}

export default Index;
