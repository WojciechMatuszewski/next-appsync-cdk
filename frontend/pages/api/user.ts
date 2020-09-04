import { Amplify, withSSRContext } from "aws-amplify";
import { NextApiRequest, NextApiResponse } from "next";
import { amplifyConfig } from "../../amplify/AmplifyProvider";

Amplify.configure(amplifyConfig);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { Auth } = withSSRContext({ req });

  try {
    const user = await Auth.currentAuthenticatedUser();

    return res.status(200).json({ message: "Authenticated!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};
