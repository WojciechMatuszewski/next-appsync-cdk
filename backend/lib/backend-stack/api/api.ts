import {
  AuthorizationType,
  GraphQLApi,
  SchemaDefinition
} from "@aws-cdk/aws-appsync";
import { UserPool } from "@aws-cdk/aws-cognito";
import { Table } from "@aws-cdk/aws-dynamodb";
import { Construct } from "@aws-cdk/core";
import { deriveConstructResourceName, pathFromRoot } from "../../common/common";
import { PostApi } from "./post-api";

interface Props {
  userPool: UserPool;
  table: Table;
}

export class Api extends Construct {
  public readonly api: GraphQLApi;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    this.api = new GraphQLApi(this, "api", {
      name: deriveConstructResourceName(this, "api"),
      schemaDefinition: SchemaDefinition.FILE,
      schemaDefinitionFile: pathFromRoot("schema.graphql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool: props.userPool
          }
        }
      }
    });

    const dataSource = this.api.addDynamoDbDataSource(
      `dataSource`,
      props.table
    );

    new PostApi(this, "post-api", { dataSource, table: props.table });
  }
}
