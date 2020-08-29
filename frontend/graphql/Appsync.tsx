import API from "@aws-amplify/api-graphql";

import config from "../config.json";

const {
  "backend-deployment": {
    awsappsyncgraphqlEndpoint,
    awsappsyncapiKey,
    awsappsyncauthenticationType,
    awsappsyncregion
  }
} = config;

API.configure({
  aws_appsync_graphqlEndpoint: awsappsyncgraphqlEndpoint,
  aws_appsync_region: awsappsyncregion,
  aws_appsync_authenticationType: awsappsyncauthenticationType,
  aws_appsync_apiKey: awsappsyncapiKey
});

// make sure children is a construable object.
function AppsyncProvider({ children }: { children: JSX.Element }) {
  return children;
}

export { AppsyncProvider };
