import {
  Assign,
  MappingTemplate,
  PrimaryKey,
  Values
} from "@aws-cdk/aws-appsync";

const inputVtl = `
    #set($input = $ctx.args.input)
    {
        "key": {
            "pk": $util.dynamodb.toDynamoDBJson(POST),
            "sk": $util.dynamodb.toDynamoDBJson($util.autoId())
        },
        "attributeValues": $util.dynamodb.toMapValuesJson($input)
    }
`;

const resultVtl = `

    #set($data = {
        "id": $ctx.result.sk,

    })
`;

test("it works", () => {
  const PK = new PrimaryKey(new Assign("pk", "POST"));
  // MappingTemplate.
  //   console.log(new Assign("pk", "POST").renderAsAssignment());

  //   console.log(
  //     PrimaryKey.partition("something")
  //       .auto()
  //       .sort("ks")
  //       .is("lol")
  //       .renderTemplate()
  //   );

  const mappingTemplate = MappingTemplate.dynamoDbPutItem(
    PrimaryKey.partition("sk").auto(),
    Values.projecting("input")
  );

  const rendered = mappingTemplate.renderTemplate();
  console.log(rendered);
});
