import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns";
import { join } from "path";

const imageAssetPath = join(__dirname, "../../../frontend");

interface Props extends cdk.StackProps {
  stage: string;
}

export class FrontendDeploymentStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: Props) {
    super(scope, id, props);

    const rootResourceName = `${this.stackName}-${props.stage}`;

    const vpc = new ec2.Vpc(this, `${rootResourceName}-vpc`, {
      maxAzs: 3
    });

    const cluster = new ecs.Cluster(this, `${rootResourceName}-cluster`, {
      vpc
    });

    new ecs_patterns.ApplicationLoadBalancedFargateService(
      this,
      `${rootResourceName}-ecsService`,
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
