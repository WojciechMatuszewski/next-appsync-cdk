import config from "../config.json";
import Amplify from "aws-amplify";

const {
  "next-cdk-backend-dev": {
    graphqlUri,
    region,
    authenticationType,
    cognitoClientId,
    cognitoPoolId,
    authenticationFlow
  }
} = config;

export const amplifyConfig = {
  aws_appsync_graphqlEndpoint: graphqlUri,
  aws_appsync_region: region,
  aws_appsync_authenticationType: authenticationType,
  Auth: {
    region: region,
    authenticationFlowType: authenticationFlow,
    userPoolWebClientId: cognitoClientId,
    userPoolId: cognitoPoolId
  }
};

Amplify.configure(amplifyConfig);

type Props = {
  children: JSX.Element;
};

function AmplifyProvider({ children }: Props) {
  return children;
}

export { AmplifyProvider };
