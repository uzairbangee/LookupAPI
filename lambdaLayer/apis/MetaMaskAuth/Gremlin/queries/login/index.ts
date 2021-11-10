import { process as gprocess } from "gremlin";
import {
  CreateApiInput,
  ApiVersion,
} from "../../../../utils/graphqlSchemaTypes";
import { ErrorStructure } from "../../../../utils/errorHandlingTemplate";
import { convertToNeptuneId } from "../../../../utils/idConverter";
import { v4 as uuidv4 } from "uuid";
import {
  GetUserAuthDataInput,
  LoginInput,
  UserAuth,
} from "../../../../utils/graphqlSchemaTypes";
import { checkIfUserhasSignedUp } from "./handleErrors";
import { generateAccessToken } from "./generateAccessToken";

export default async function login(
  g: gprocess.GraphTraversalSource,
  data: LoginInput
): Promise<ErrorStructure | { data: string }> {
  let { publicAddress, signature } = data;

  const publicAddressNeptune = convertToNeptuneId.publicAddress(publicAddress);

  const checkPublicAddress = await checkIfUserhasSignedUp(
    g,
    publicAddressNeptune
  );

  if (checkPublicAddress !== true) {
    return checkPublicAddress;
  }

  const accessToken = await generateAccessToken(
    g,
    publicAddressNeptune,
    signature
  );

  if (typeof accessToken === "string") {
    return { data: accessToken };
  }

  return accessToken;
}
