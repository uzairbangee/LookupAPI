import { process as gprocess } from "gremlin";
import {
  CreateApiInput,
  ApiVersion,
  AuthorizeUserInput,
  User,
  DecodedAccessToken,
} from "../../../../utils/graphqlSchemaTypes";
import {
  errorCodes,
  ErrorStructure,
  errorTypes,
  returnError,
} from "../../../../utils/errorHandlingTemplate";
import { convertToNeptuneId } from "../../../../utils/idConverter";
import { verify, decode } from "jsonwebtoken";
import { errorStrings } from "../../../errorStrings";
import { vertex, edge } from "../../../../utils/graphdb-elements-name.json";

export default async function authorizeUser(
  g: gprocess.GraphTraversalSource,
  data: AuthorizeUserInput
): Promise<ErrorStructure | { data: DecodedAccessToken }> {
  let { accessToken } = data;

  const decodeJwt: any = decode(accessToken);

  console.log("decodedjwt", decodeJwt);

  if (!decodeJwt) {
    return returnError(
      errorStrings.invalidToken,
      { errorCode: errorCodes.badRequest },
      errorTypes.badRequest
    );
  }

  const publicAddressFromToken = decodeJwt.payload.publicAddress;
  const publicAddressNeptune = convertToNeptuneId.publicAddress(
    publicAddressFromToken
  );

  const getSecretText = await g
    .V(publicAddressNeptune)
    .values(vertex.userAuthentication.prop.secretText.N)
    .next();

  console.log("secret", getSecretText.value);

  var verifiedJwt: any = verify(accessToken, getSecretText.value);
  console.log("verifiedJwt = ", verifiedJwt);

  return { data: verifiedJwt };
}
