import * as appsync from "@aws-cdk/aws-appsync";
import * as db from "@aws-cdk/aws-dynamodb";
import * as cdk from "@aws-cdk/core";
import { join } from "path";

interface BackendStackProps extends cdk.StackProps {
  stage: string;
}

export class BackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: BackendStackProps) {
    super(scope, id, props);

    const rootResourceName = `${this.stackName}-${props.stage}`;

    const api = new appsync.GraphQLApi(this, "Api", {
      name: `${rootResourceName}-api`,
      schemaDefinition: appsync.SchemaDefinition.FILE,
      schemaDefinitionFile: join(__dirname, "../../schema.graphql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY
        }
      }
    });

    const todoTable = new db.Table(this, `todoTable`, {
      partitionKey: {
        name: "id",
        type: db.AttributeType.STRING
      }
    });

    const todoDS = api.addDynamoDbDataSource(`todoDataSource`, todoTable);

    // Resolver for the Query "getDemos" that scans the DyanmoDb table and returns the entire list.
    todoDS.createResolver({
      typeName: "Query",
      fieldName: "todo",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbGetItem(
        "id",
        "S"
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList()
    });

    todoDS.createResolver({
      typeName: "Query",
      fieldName: "todos",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList()
    });

    todoDS.createResolver({
      typeName: "Mutation",
      fieldName: "todo",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(
        appsync.PrimaryKey.partition("id").auto(),
        appsync.Values.projecting("input")
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()
    });

    new cdk.CfnOutput(this, "aws_appsync_authenticationType", {
      value: "API_KEY"
    });

    new cdk.CfnOutput(this, "aws_appsync_apiKey", {
      value: api.apiKey ?? "unknown"
    });

    new cdk.CfnOutput(this, "aws_appsync_region", {
      value: this.node.tryGetContext("region")
    });

    new cdk.CfnOutput(this, "aws_appsync_graphqlEndpoint", {
      value: api.graphQlUrl
    });
  }
}
