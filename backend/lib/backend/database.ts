import { AttributeType, Table } from "@aws-cdk/aws-dynamodb";
import { Construct, NestedStack, NestedStackProps } from "@aws-cdk/core";
import { deriveResourceName } from "../common/common";

export class DatabaseStack extends NestedStack {
  public readonly table: Table;
  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.table = new Table(scope, deriveResourceName(this, "table"), {
      partitionKey: {
        name: "pk",
        type: AttributeType.STRING
      },
      sortKey: {
        name: "sk",
        type: AttributeType.STRING
      }
    });
  }
}
