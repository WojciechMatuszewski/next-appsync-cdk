import { App, Construct, Stack } from "@aws-cdk/core";

function getEnv(construct: Construct) {
  const { region } = construct.node.tryGetContext("env");
  return { region };
}

function deriveResourceName(stack: Stack, resourceName: string) {
  return `${stack.stackName}-${resourceName}`;
}

function deriveConstructResourceName(
  construct: Construct,
  resourceName: string
) {
  return `${construct.node.id}-${resourceName}`;
}

function deriveStackName(app: App, stackName: string) {
  const { name, stage } = app.node.tryGetContext("env");
  return `${name}-${stackName}-${stage}`;
}

export {
  getEnv,
  deriveResourceName,
  deriveStackName,
  deriveConstructResourceName
};
