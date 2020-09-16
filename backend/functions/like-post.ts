import { DocumentClient } from "aws-sdk/clients/dynamodb";
const db = new DocumentClient({ region: "eu-central-1" });

type Event = {
  arguments: { ID: string };
  identity: {
    sub: string;
  };
};

async function createLike(event: Event) {
  const key = {
    pk: `USER#${event.identity.sub}`,
    sk: `LIKE#${event.arguments.ID}`
  };
  const attributes = {
    type: "LIKE",
    createdAt: new Date().toISOString()
  };

  return db
    .put({
      TableName: process.env.TABLE_NAME,
      Item: { ...attributes, ...key }
    })
    .promise();
}

async function getPost(id: string) {
  return db
    .query({
      TableName: process.env.TABLE_NAME,
      ExpressionAttributeValues: {
        ":pk": `POST#${id}`
      },
      KeyConditionExpression: "pk = :pk"
    })
    .promise();
}

const handler = async (event: Event) => {
  const operations = [getPost(event.arguments.ID), createLike(event)] as const;

  const [{ Items }] = await Promise.all(operations);
  if (!Items) throw new Error("Items empty");
  const [post] = Items;

  return { ...post, numberOfLikes: post.numberOfLikes + 1 };
};

export { handler };
