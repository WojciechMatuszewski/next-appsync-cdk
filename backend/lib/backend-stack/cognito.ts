import {
  UserPool,
  UserPoolClient,
  UserPoolClientIdentityProvider,
  UserPoolOperation
} from "@aws-cdk/aws-cognito";
import { Construct } from "@aws-cdk/core";
import { deriveConstructResourceName, pathFromRoot } from "../common/common";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { Effect, PolicyStatement } from "@aws-cdk/aws-iam";
import { Table } from "@aws-cdk/aws-dynamodb";

interface Props {
  table: Table;
}

export class Cognito extends Construct {
  public readonly userPool: UserPool;
  public readonly userPoolClient: UserPoolClient;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    this.userPool = new UserPool(this, "userPool", {
      userPoolName: deriveConstructResourceName(this, "userPool"),
      autoVerify: {
        email: true
      },
      signInAliases: {
        email: true
      },
      passwordPolicy: {
        minLength: 6,
        requireDigits: false,
        requireLowercase: false,
        requireSymbols: false,
        requireUppercase: false
      },
      standardAttributes: {
        email: {
          mutable: true,
          required: true
        }
      },
      selfSignUpEnabled: true
    });

    const autoConfirmTrigger = new NodejsFunction(this, "autoConfirm", {
      handler: "handler",
      entry: pathFromRoot("./functions/cognito-auto-confirm.ts")
    });

    const postConfirmTrigger = new NodejsFunction(this, "postConfirm", {
      handler: "handler",
      entry: pathFromRoot("./functions/cognito-post-confirm.ts"),
      externalModules: [],
      nodeModules: ["aws-sdk"]
    });
    postConfirmTrigger.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [props.table.tableArn, `${props.table.tableArn}/*`],
        actions: ["dynamodb:PutItem"]
      })
    );
    postConfirmTrigger.addEnvironment("TABLE_NAME", props.table.tableName);

    this.userPool.addTrigger(UserPoolOperation.PRE_SIGN_UP, autoConfirmTrigger);

    this.userPool.addTrigger(
      UserPoolOperation.POST_CONFIRMATION,
      postConfirmTrigger
    );

    this.userPoolClient = new UserPoolClient(this, "userPoolClient", {
      userPoolClientName: deriveConstructResourceName(this, "userPoolClient"),
      userPool: this.userPool,
      authFlows: {
        refreshToken: true,
        userPassword: true,
        userSrp: true
      },
      generateSecret: false,
      supportedIdentityProviders: [UserPoolClientIdentityProvider.COGNITO]
    });
  }
}
