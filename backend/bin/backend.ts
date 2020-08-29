import "source-map-support/register";
import { App } from "@aws-cdk/core";

import { FrontendDeploymentStack } from "../lib/frontend-deployment-stack";
import { BackendStack } from "../lib/backend-stack";

const app = new App();

new FrontendDeploymentStack(app, "frontend-deployment", {
  stage: process.env.STAGE
});

new BackendStack(app, "backend-deployment", {
  stage: process.env.STAGE
});
