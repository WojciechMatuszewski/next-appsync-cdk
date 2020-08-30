import { PreSignUpTriggerHandler } from "aws-lambda";

const handler: PreSignUpTriggerHandler = async event => {
  event.response.autoConfirmUser = true;
  return event;
};

module.exports.handler = handler;
