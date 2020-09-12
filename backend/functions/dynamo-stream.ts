import { DynamoDBRecord, DynamoDBStreamHandler } from "aws-lambda";
import { DeepNonNullable } from "utility-types";

import { DocumentClient } from "aws-sdk/clients/dynamodb";

const db = new DocumentClient({ region: "eu-central-1" });

function isPostLikedEvent(record: DynamoDBRecord) {
  const keys = record.dynamodb?.Keys;
  if (!keys) return false;

  return keys["pk"].S?.includes("USER") && keys["sk"].S?.includes("LIKE");
}

function isInsertRecord(record: DynamoDBRecord) {
  return record.eventName == "INSERT";
}

function containsData(record: DynamoDBRecord) {
  return Boolean(record.dynamodb) && Boolean(record.dynamodb?.Keys);
}

async function getPost(db: DocumentClient, postId: string) {
  const { Items } = await db
    .query({
      TableName: process.env.TABLE_NAME,
      ExpressionAttributeValues: {
        ":pk": `POST#${postId}`,
        ":sk": "USER#"
      },
      KeyConditionExpression: "pk = :pk and begins_with(sk, :sk)"
    })
    .promise();

  return Items?.[0];
}

const handler: DynamoDBStreamHandler = async event => {
  const record = event.Records[0];

  const shouldBeConsidered = isInsertRecord(record) && containsData(record);
  if (!shouldBeConsidered) return;

  if (!isPostLikedEvent(record)) return;
  const {
    dynamodb: { Keys }
  } = record as DeepNonNullable<DynamoDBRecord>;

  const postId = Keys["sk"].S.replace("LIKE#", "");
  const post = await getPost(db, postId);
  if (!post) return;

  const updateOperation = db.update({
    TableName: process.env.TABLE_NAME,
    Key: { pk: post.pk, sk: post.sk },
    ExpressionAttributeValues: { ":inc": 1 },
    UpdateExpression: "SET numberOfLikes = numberOfLikes + :inc"
  });

  await updateOperation.promise();
};

module.exports.handler = handler;
