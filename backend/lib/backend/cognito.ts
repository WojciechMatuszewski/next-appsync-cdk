import {
  UserPool,
  UserPoolClient,
  UserPoolClientIdentityProvider,
  UserPoolOperation
} from "@aws-cdk/aws-cognito";
import { Construct, NestedStack } from "@aws-cdk/core";
import { join } from "path";
import { deriveResourceName } from "../common/common";
import { Code, Runtime } from "@aws-cdk/aws-lambda";
import { Function } from "@aws-cdk/aws-lambda";

export class CognitoStack extends NestedStack {
  public readonly userPool: UserPool;
  public readonly userPoolClient: UserPoolClient;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.userPool = new UserPool(this, "userPool", {
      userPoolName: deriveResourceName(this, "userPool"),
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
          mutable: false,
          required: true
        }
      },
      selfSignUpEnabled: true
    });

    const trigger = new Function(this, "preSignupHandler", {
      handler: "cognito-auto-confirm.handler",
      runtime: Runtime.NODEJS_12_X,
      code: Code.fromAsset(join(__dirname, "./functions"))
    });

    this.userPool.addTrigger(UserPoolOperation.PRE_SIGN_UP, trigger);

    this.userPoolClient = new UserPoolClient(this, "userPoolClient", {
      userPoolClientName: deriveResourceName(this, "userPoolClient"),
      userPool: this.userPool,
      authFlows: {
        refreshToken: true,
        userPassword: true
      },
      generateSecret: false,
      supportedIdentityProviders: [UserPoolClientIdentityProvider.COGNITO]
    });
  }
}
