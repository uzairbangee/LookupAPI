import { process as gprocess } from "gremlin";
import {
  CreateApiInput,
  ApiVersion,
} from "../../../../utils/graphqlSchemaTypes";
import {
  ErrorStructure,
  returnError,
  errorTypes,
  errorCodes,
} from "../../../../utils/errorHandlingTemplate";
import { errorStrings } from "../../../errorStrings";
import { convertToNeptuneId } from "../../../../utils/idConverter";
import { v4 as uuidv4 } from "uuid";
import {
  GetUserAuthDataInput,
  UserAuth,
} from "../../../../utils/graphqlSchemaTypes";
import { checkIfUserhasSignedUp } from "./handleErrors";
import { fetchUser } from "./fetchUser";

export default async function getUserAuthData(
  g: gprocess.GraphTraversalSource,
  data: GetUserAuthDataInput
): Promise<ErrorStructure | { data: UserAuth }> {
  let { publicAddress } = data;

  const publicAddressNeptune = convertToNeptuneId.publicAddress(publicAddress);

  const checkPublicAddress = await checkIfUserhasSignedUp(
    g,
    publicAddressNeptune
  );

  if (checkPublicAddress !== true) {
    return returnError(
      errorStrings.userDoesntExist(publicAddress),
      { errorCode: errorCodes.notFound },
      errorTypes.notFound
    );
  }

  const user = await fetchUser(g, publicAddressNeptune);

  return { data: user };
}
