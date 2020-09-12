import { DynamoDbDataSource, MappingTemplate } from "@aws-cdk/aws-appsync";
import { Table } from "@aws-cdk/aws-dynamodb";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { Construct } from "@aws-cdk/core";
import { pathFromRoot } from "../../common/common";
import { DynamoEventSource } from "@aws-cdk/aws-lambda-event-sources";
import { StartingPosition } from "@aws-cdk/aws-lambda";

interface Props {
  dataSource: DynamoDbDataSource;
  table: Table;
}

function getMappingTemplate(templateName: string) {
  return pathFromRoot(
    `lib/backend-stack/api/mapping-templates/${templateName}`
  );
}

export class PostApi extends Construct {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    const { dataSource, table } = props;

    const streamConsumer = new NodejsFunction(this, "streamConsumer", {
      handler: "handler",
      entry: pathFromRoot("./functions/dynamo-stream.ts"),
      externalModules: [],
      environment: {
        TABLE_NAME: table.tableName
      }
    });
    streamConsumer.addEventSource(
      new DynamoEventSource(table, {
        startingPosition: StartingPosition.TRIM_HORIZON,
        batchSize: 1
      })
    );
    table.grantReadWriteData(streamConsumer);

    dataSource.createResolver({
      typeName: "Mutation",
      fieldName: "createPost",
      requestMappingTemplate: MappingTemplate.fromFile(
        getMappingTemplate("create-post.request.vtl")
      ),
      responseMappingTemplate: MappingTemplate.fromFile(
        getMappingTemplate("create-post.response.vtl")
      )
    });

    dataSource.createResolver({
      typeName: "Post",
      fieldName: "user",
      requestMappingTemplate: MappingTemplate.fromFile(
        getMappingTemplate("post-user.request.vtl")
      ),
      responseMappingTemplate: MappingTemplate.fromFile(
        getMappingTemplate("post-user.response.vtl")
      )
    });

    dataSource.createResolver({
      typeName: "Query",
      fieldName: "posts",
      requestMappingTemplate: MappingTemplate.fromFile(
        getMappingTemplate("posts.request.vtl")
      ),
      responseMappingTemplate: MappingTemplate.fromFile(
        getMappingTemplate("posts.response.vtl")
      )
    });

    dataSource.createResolver({
      typeName: "Mutation",
      fieldName: "likePost",
      requestMappingTemplate: MappingTemplate.fromFile(
        getMappingTemplate("like-post.request.vtl")
      ),
      responseMappingTemplate: MappingTemplate.fromFile(
        getMappingTemplate("like-post.response.vtl")
      )
    });

    dataSource.createResolver({
      typeName: "Query",
      fieldName: "canLike",
      requestMappingTemplate: MappingTemplate.fromFile(
        getMappingTemplate("can-like.request.vtl")
      ),
      responseMappingTemplate: MappingTemplate.fromFile(
        getMappingTemplate("can-like.response.vtl")
      )
    });
  }
}
