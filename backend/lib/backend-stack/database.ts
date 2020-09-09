import { AttributeType, Table } from "@aws-cdk/aws-dynamodb";
import { Construct, NestedStack, NestedStackProps } from "@aws-cdk/core";
import { deriveResourceName } from "../common/common";

export class Database extends Construct {
  public readonly table: Table;
  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.table = new Table(scope, "table", {
      partitionKey: {
        name: "pk",
        type: AttributeType.STRING
      },
      sortKey: {
        name: "sk",
        type: AttributeType.STRING
      }
    });

    this.table.addGlobalSecondaryIndex({
      partitionKey: { name: "type", type: AttributeType.STRING },
      sortKey: { name: "createdAt", type: AttributeType.STRING },
      indexName: "ByCreatedAt"
    });
  }
}
