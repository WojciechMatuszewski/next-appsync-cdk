import * as AWSMock from "aws-sdk-mock";
import { DynamoDBRecord, DynamoDBStreamEvent } from "aws-lambda";
import { UpdateItemInput, UpdateItemOutput } from "aws-sdk/clients/dynamodb";
import { AWSError } from "aws-sdk/lib/core";

function createEvent(recordIn: Partial<DynamoDBRecord>) {
  return {
    Records: [recordIn]
  } as DynamoDBStreamEvent;
}

function getHandler() {
  let module: any;
  jest.isolateModules(() => {
    const { handler } = require("./dynamo-stream");
    module = handler;
  });
  return { handler: module };
}

describe("dynamo-stream", () => {
  beforeAll(() => {
    process.env.TABLE_NAME = "TEST_TABLE";
  });

  afterEach(() => AWSMock.restore());

  it("ignores non-like events", async () => {
    const callSpy = jest.fn();
    AWSMock.mock("DynamoDB.DocumentClient", "update", (callback: Function) => {
      callSpy();
      callback(null, null);
    });

    const { handler } = getHandler();

    const event = createEvent({
      eventName: "INSERT",
      dynamodb: { Keys: { pk: { S: "USER#1" }, sk: { S: "USER#2" } } }
    });

    await handler(event);
    expect(callSpy).not.toHaveBeenCalled();
  });

  it("increments the number of likes", async () => {
    AWSMock.mock(
      "DynamoDB.DocumentClient",
      "update",
      (
        params: UpdateItemInput,
        callback: (error: AWSError, data: UpdateItemOutput) => void
      ) => {
        expect(params).toEqual(
          expect.objectContaining({
            TableName: "TEST_TABLE",
            Key: { pk: { S: "POST#2" } },
            ExpressionAttributeValues: { ":inc": 1 },
            UpdateExpression: "SET numberOfLikes = numberOfLikes + :inc"
          })
        );

        callback(null as any, {});
      }
    );

    const { handler } = getHandler();
    const event = createEvent({
      eventName: "INSERT",
      dynamodb: { Keys: { pk: { S: "USER#1" }, sk: { S: "LIKE#2" } } }
    });

    await expect(handler(event)).resolves.toBeUndefined();
  });
});
