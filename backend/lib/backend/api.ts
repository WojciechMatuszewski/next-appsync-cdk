import {
  AuthorizationType,
  GraphQLApi,
  MappingTemplate,
  PrimaryKey,
  SchemaDefinition,
  Values
} from "@aws-cdk/aws-appsync";
import { UserPool } from "@aws-cdk/aws-cognito";
import { AttributeType, Table } from "@aws-cdk/aws-dynamodb";
import { Construct, NestedStack, NestedStackProps } from "@aws-cdk/core";
import { join } from "path";
import { deriveResourceName } from "../common/common";

interface Props extends NestedStackProps {
  userPool: UserPool;
}

export class ApiStack extends NestedStack {
  public readonly api: GraphQLApi;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    this.api = new GraphQLApi(this, "api", {
      name: deriveResourceName(this, "api"),
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

    const todoTable = new Table(this, `todoTable`, {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING
      }
    });

    const todoDS = this.api.addDynamoDbDataSource(`todoDataSource`, todoTable);

    todoDS.createResolver({
      typeName: "Query",
      fieldName: "todo",
      requestMappingTemplate: MappingTemplate.dynamoDbGetItem("id", "S"),
      responseMappingTemplate: MappingTemplate.dynamoDbResultList()
    });

    todoDS.createResolver({
      typeName: "Query",
      fieldName: "todos",
      requestMappingTemplate: MappingTemplate.dynamoDbScanTable(),
      responseMappingTemplate: MappingTemplate.dynamoDbResultList()
    });

    todoDS.createResolver({
      typeName: "Mutation",
      fieldName: "todo",
      requestMappingTemplate: MappingTemplate.dynamoDbPutItem(
        PrimaryKey.partition("id").auto(),
        Values.projecting("input")
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem()
    });
  }
}
