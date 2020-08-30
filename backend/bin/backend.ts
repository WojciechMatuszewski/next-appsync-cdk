import "source-map-support/register";
import { App } from "@aws-cdk/core";

import { FrontendDeploymentStack } from "../lib/frontend-deployment-stack";
import { BackendStack } from "../lib/backend-stack";
import { deriveStackName } from "../lib/common/common";

const app = new App();

new FrontendDeploymentStack(app, deriveStackName(app, "frontend"));

new BackendStack(app, deriveStackName(app, "backend"));
