import { DynamoDbDataSource, MappingTemplate } from "@aws-cdk/aws-appsync";
import { Construct } from "@aws-cdk/core";

interface Props {
  dataSource: DynamoDbDataSource;
}

export class PostApi extends Construct {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    const { dataSource } = props;

    dataSource.createResolver({
      typeName: "Mutation",
      fieldName: "createPost",
      requestMappingTemplate: MappingTemplate.fromString(`
        #set($input = $ctx.args.input)
        $util.qr($input.put("createdAt", $util.time.nowISO8601()))
        {
          "version": "2017-02-28",
          "operation": "PutItem",
          "key": {
              "pk": $util.dynamodb.toDynamoDBJson("POST"),
              "sk": $util.dynamodb.toDynamoDBJson($util.autoId())
          },
          "attributeValues": $util.dynamodb.toMapValuesJson($input)
        }
      `),
      responseMappingTemplate: MappingTemplate.fromString(`
        $util.qr($ctx.result.remove("pk"))
        $util.qr($ctx.result.put("id", $ctx.result.sk))
        $util.qr($ctx.result.remove("sk"))

        $util.toJson($ctx.result)
      `)
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
