import { process as gprocess } from "gremlin";
import {
  errorCodes,
  ErrorStructure,
  errorTypes,
  returnError,
} from "../../../../utils/errorHandlingTemplate";
import {
  convertFromNeptuneId,
  convertToNeptuneId,
} from "../../../../utils/idConverter";
import { v4 as uuidv4 } from "uuid";
import { RefreshAccessTokenInput } from "../../../../../../graphql/types";
import { decode, verify, sign } from "jsonwebtoken";
import { vertex, edge } from "../../../../utils/graphdb-elements-name.json";
import { cleanObject } from "../../../../utils/utils";
import { errorStrings } from "../../../errorStrings";

const __ = gprocess.statics;
const id = gprocess.t.id;
const within = gprocess.P.within;
const desc = gprocess.order.desc;
const single = gprocess.cardinality.single;

export default async function refreshAccessToken(
  g: gprocess.GraphTraversalSource,
  data: RefreshAccessTokenInput
): Promise<ErrorStructure | { data: string }> {
  let { accessToken } = data;

  const decodeJwt: any = decode(accessToken);

  console.log("decodedjwt", decodeJwt);

  if (!decodeJwt) {
    return returnError(
      errorStrings.invalidToken,
      { errorCode: errorCodes.unAuthorized },
      errorTypes.unAuthorized
    );
  }

  // throw new Error("invalid token");

  const publicAddressFromToken = decodeJwt.payload.publicAddress;

  const publicAddressFromTokenNeptune = convertToNeptuneId.publicAddress(
    publicAddressFromToken
  );

  const getSecretText = await g
    .V(publicAddressFromTokenNeptune)
    .values(vertex.userAuthentication.prop.secretText.N)
    .next();

  console.log("secret", getSecretText.value);

  var verifiedJwt: any = verify(accessToken, getSecretText.value);
  console.log("verifiedJwt = ", verifiedJwt);

  const secretText = uuidv4();

  const publicAddressNeptune = convertToNeptuneId.publicAddress(
    verifiedJwt.payload.publicAddress
  );

  const createNewSecret = await g
    .V(publicAddressNeptune)
    .property(single, vertex.userAuthentication.prop.secretText.N, secretText)
    .next();

  console.log(createNewSecret.value);

  const userBasicInfo = await g
    .V(publicAddressNeptune)
    .hasLabel(vertex.userAuthentication.L)
    .coalesce(
      __.in_(edge.hasAuthentication.L)
        .project("firstName", "lastName", "username")
        .by(
          __.values(vertex.user.prop.firstName.N)
            .fold()
            .coalesce(__.unfold(), __.constant(""))
        )
        .by(
          __.values(vertex.user.prop.lastName.N)
            .fold()
            .coalesce(__.unfold(), __.constant(""))
        )
        .by(id),

      __.constant("")
    )
    .next();

  console.log("userInfo", userBasicInfo.value);

  let payload = { publicAddress: verifiedJwt.payload.publicAddress };

  if (userBasicInfo.value !== "") {
    userBasicInfo.value.username = convertFromNeptuneId.user(
      userBasicInfo.value.username
    );

    console.log(userBasicInfo.value);

    cleanObject(userBasicInfo.value);

    payload = { ...payload, ...userBasicInfo.value };
  }

  const newAccessToken = sign(
    {
      payload: payload,
    },
    secretText,
    {
      expiresIn: "24h", // expires in 24 hours
    }
  );

  return { data: newAccessToken };
}
