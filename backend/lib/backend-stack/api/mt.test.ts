import { MappingTemplate } from "@aws-cdk/aws-appsync";
import { pathFromRoot } from "../../common/common";

// /Users/wn.matuszewski/Desktop/cdk-twitter/backend/lib/backend-stack/mapping-templates/create-post.request.vtl
// /Users/wn.matuszewski/Desktop/cdk-twitter/backend/lib/backend-stack/api/mapping-templates/create-post.request.vtl
test("it works", () => {
  const template = MappingTemplate.fromFile(
    pathFromRoot(
      "lib/backend-stack/api/mapping-templates/create-post.request.vtl"
    )
  );
  console.log(template.renderTemplate());
});
