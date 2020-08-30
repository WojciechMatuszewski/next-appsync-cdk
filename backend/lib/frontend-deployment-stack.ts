import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns";
import { join } from "path";
import { deriveResourceName, getEnv } from "./common/common";

const imageAssetPath = join(__dirname, "../../../frontend");

export class FrontendDeploymentStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, { ...props, env: getEnv(scope) });

    const vpc = new ec2.Vpc(this, deriveResourceName(this, "vpc"), {
      maxAzs: 3
    });

    const cluster = new ecs.Cluster(this, deriveResourceName(this, "cluster"), {
      vpc
    });

    new ecs_patterns.ApplicationLoadBalancedFargateService(
      this,
      deriveResourceName(this, "service"),
      {
        cluster,
        taskImageOptions: {
          image: ecs.ContainerImage.fromAsset(imageAssetPath),
          containerPort: 80
        },
        publicLoadBalancer: true
      }
    );
  }
}
