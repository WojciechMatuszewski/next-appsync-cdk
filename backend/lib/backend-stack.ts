import * as cdk from "@aws-cdk/core";
import { CfnOutput } from "@aws-cdk/core";
import { ApiStack } from "./backend/api";
import { CognitoStack } from "./backend/cognito";
import { getEnv } from "./common/common";

export class BackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, { ...props, env: getEnv(scope) });

    const cognitoStack = new CognitoStack(this, "cognito");

    const apiStack = new ApiStack(this, "api", {
      userPool: cognitoStack.userPool
    });

    new cdk.CfnOutput(this, "region", {
      value: getEnv(this).region
    });

    new cdk.CfnOutput(this, "graphqlUri", {
      value: apiStack.api.graphQlUrl
    });

    new cdk.CfnOutput(this, "cognitoClientId", {
      value: cognitoStack.userPoolClient.userPoolClientId
    });

    new CfnOutput(this, "cognitoPoolId", {
      value: cognitoStack.userPool.userPoolId
    });

    new cdk.CfnOutput(this, "authenticationFlow", {
      value: "USER_PASSWORD_AUTH"
    });
  }
}
