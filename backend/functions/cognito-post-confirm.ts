import { PostConfirmationTriggerHandler } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const db = new DocumentClient();

const handler: PostConfirmationTriggerHandler = async event => {
  if (event.triggerSource == "PostConfirmation_ConfirmForgotPassword") {
    return event;
  }

  const {
    request: {
      userAttributes: { sub, email }
    }
  } = event;

  await db
    .put({
      TableName: process.env.TABLE_NAME,
      Item: {
        pk: `USER#${sub}`,
        sk: `USER#${sub}`,
        email
      }
    })
    .promise();

  return event;
};

module.exports.handler = handler;
