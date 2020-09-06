import {
  AuthorizationType,
  GraphQLApi,
  SchemaDefinition
} from "@aws-cdk/aws-appsync";
import { UserPool } from "@aws-cdk/aws-cognito";
import { Construct } from "@aws-cdk/core";
import { join } from "path";
import { deriveConstructResourceName } from "../common/common";
import { PostApi } from "./api/post-api";
import { Database } from "./database";

interface Props {
  userPool: UserPool;
}

export class Api extends Construct {
  public readonly api: GraphQLApi;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    const database = new Database(
      this,
      deriveConstructResourceName(this, "database")
    );

    this.api = new GraphQLApi(this, "api", {
      name: deriveConstructResourceName(this, "api"),
      schemaDefinition: SchemaDefinition.FILE,
      schemaDefinitionFile: join(__dirname, "../../../schema.graphql"),
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
      database.table
    );

    new PostApi(this, "post-api", { dataSource });

    // todoDS.createResolver({
    //   typeName: "Query",
    //   fieldName: "todo",
    //   requestMappingTemplate: MappingTemplate.dynamoDbGetItem("id", "S"),
    //   responseMappingTemplate: MappingTemplate.dynamoDbResultList()
    // });

    // todoDS.createResolver({
    //   typeName: "Query",
    //   fieldName: "todos",
    //   requestMappingTemplate: MappingTemplate.dynamoDbScanTable(),
    //   responseMappingTemplate: MappingTemplate.dynamoDbResultList()
    // });

    // todoDS.createResolver({
    //   typeName: "Mutation",
    //   fieldName: "todo",
    //   requestMappingTemplate: MappingTemplate.dynamoDbPutItem(
    //     PrimaryKey.partition("id").auto(),
    //     Values.projecting("input")
    //   ),
    //   responseMappingTemplate: MappingTemplate.dynamoDbResultItem()
    // });
  }
}
