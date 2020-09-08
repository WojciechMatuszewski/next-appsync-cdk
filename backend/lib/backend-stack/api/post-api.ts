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
      requestMappingTemplate: MappingTemplate.fromString(`
        {
          "version" : "2017-02-28",
          "operation" : "Query",
          "query" : {
              "expression" : "#pk = :POST",
              "expressionNames" : {
                  "#pk" : "pk"
              },
              "expressionValues" : {
                  ":POST" : $util.dynamodb.toDynamoDBJson("POST")
              }
          }
        }
      `),
      responseMappingTemplate: MappingTemplate.fromString(`
        #set($items = [])

        #foreach( $item in $ctx.result.items )
          $util.qr($item.remove("pk"))
            $util.qr($item.put("id", $item.sk))
            $util.qr($item.remove("sk"))

            $util.qr($items.add($item))
        #end

        $util.toJson($items)
      `)
    });
  }
}
