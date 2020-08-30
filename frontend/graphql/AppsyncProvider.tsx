import { API } from "aws-amplify";

import config from "../config.json";

const {
  "next-cdk-backend-dev": { graphqlUri, region }
} = config;

API.configure({
  aws_appsync_graphqlEndpoint: graphqlUri,
  aws_appsync_region: region,
  aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS"
});

// make sure children is a construable object.
function AppsyncProvider({ children }: { children: JSX.Element }) {
  return children;
}

export { AppsyncProvider };
