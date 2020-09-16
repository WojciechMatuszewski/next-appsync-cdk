import * as AWSMock from "aws-sdk-mock";
import {
  PutItemInput,
  PutItemOutput,
  DocumentClient,
} from "aws-sdk/clients/dynamodb";

import { AWSError } from "aws-sdk/lib/core";

type Callback<O> = (error: AWSError, out: O) => void;

test("createLikeFailure", async () => {
  process.env.TABLE_NAME = "fooTable";
  AWSMock.mock(
    "DynamoDB.DocumentClient",
    "put",
    (
      params: PutItemInput,
      callback: Callback<DocumentClient.PutItemOutput>
    ) => {
      callback(new Error("boom") as AWSError, {});
    }
  );

  AWSMock.mock(
    "DynamoDB.DocumentClient",
    "put",
    (
      params: DocumentClient.QueryInput,
      callback: Callback<DocumentClient.QueryOutput>
    ) => {
      callback(null as any, { Items: [{ foo: "bar" }] });
    }
  );

  const { handler } = require("./like-post");
  await expect(
    handler({ arguments: { ID: "1" }, identity: { sub: "2" } })
  ).rejects.toMatchInlineSnapshot(`[Error: boom]`);
});
