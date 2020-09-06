import { AuthorizationType } from "@aws-cdk/aws-appsync";
import * as cdk from "@aws-cdk/core";
import { CfnOutput } from "@aws-cdk/core";
import { Api } from "./backend-stack/api/api";
import { Cognito } from "./backend-stack/cognito";
import { Database } from "./backend-stack/database";
import { getEnv } from "./common/common";

export class BackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, { ...props, env: getEnv(scope) });

    const dynamoTable = new Database(this, "dynamo");

    const cognitoStack = new Cognito(this, "cognito", {
      table: dynamoTable.table
    });

    const apiStack = new Api(this, "api", {
      userPool: cognitoStack.userPool,
      table: dynamoTable.table
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

    new cdk.CfnOutput(this, "authenticationType", {
      value: AuthorizationType.USER_POOL
    });
  }
}
