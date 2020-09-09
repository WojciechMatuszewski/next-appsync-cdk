import { DynamoDbDataSource, MappingTemplate } from "@aws-cdk/aws-appsync";
import { Construct } from "@aws-cdk/core";
import { join } from "path";
import { pathFromRoot } from "../../common/common";

interface Props {
  dataSource: DynamoDbDataSource;
}

function getMappingTemplate(templateName: string) {
  return pathFromRoot(
    `lib/backend-stack/api/mapping-templates/${templateName}`
  );
}

export class PostApi extends Construct {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    const { dataSource } = props;

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
  }
}
