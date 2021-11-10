import {
  returnError,
  errorCodes,
  errorTypes,
  ErrorStructure,
} from "../../../../utils/errorHandlingTemplate";
import { errorStrings } from "../../../errorStrings";
import { process as gprocess } from "gremlin";
import { convertFromNeptuneId } from "../../../../utils/idConverter";
import { vertex, edge } from "../../../../utils/graphdb-elements-name.json";

import { recoverPersonalSignature } from "eth-sig-util";
// In tsconfig.json set esModuleInterop to true for ethereumjs-util to work in import style
import { bufferToHex } from "ethereumjs-util";
import { sign as jwtSign } from "jsonwebtoken";
import { cleanObject } from "../../../../utils/utils";

const __ = gprocess.statics;
const id = gprocess.t.id;
const within = gprocess.P.within;
const desc = gprocess.order.desc;
const single = gprocess.cardinality.single;

export async function generateAccessToken(
  g: gprocess.GraphTraversalSource,
  publicAddressNeptune: string,
  signature: string
): Promise<string | ErrorStructure> {
  const publicAddress =
    convertFromNeptuneId.publicAddress(publicAddressNeptune);

  const userAuthInfo = await g
    .V(publicAddressNeptune)
    .hasLabel(vertex.userAuthentication.L)
    .project("nonce", "secretText")
    .by(
      __.values(vertex.userAuthentication.prop.nonce.N)
        .fold()
        .coalesce(__.unfold(), __.constant(""))
    )
    .by(
      __.values(vertex.userAuthentication.prop.secretText.N)
        .fold()
        .coalesce(__.unfold(), __.constant(""))
    )
    .next();

  console.log(userAuthInfo.value);

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

  const message = `My App Auth Service Signing nonce: ${userAuthInfo.value.nonce}`;
  const msgBufferHex = bufferToHex(Buffer.from(message, "utf8"));
  const address = recoverPersonalSignature({
    data: msgBufferHex,
    sig: signature,
  });
  if (address.toLowerCase() !== publicAddress.toLowerCase()) {
    return returnError(
      errorStrings.signatureNotVerified,
      { errorCode: errorCodes.unAuthorized },
      errorTypes.unAuthorized
    );
  }

  const newNonce = await g
    .V(publicAddressNeptune)
    .property(
      single,
      vertex.userAuthentication.prop.nonce.N,
      Math.floor(Math.random() * 10000)
    )
    .next();

  let payload = { publicAddress: publicAddress };

  if (userBasicInfo.value !== "") {
    userBasicInfo.value.username = convertFromNeptuneId.user(
      userBasicInfo.value.username
    );

    cleanObject(userBasicInfo.value);

    payload = { ...payload, ...userBasicInfo.value };
  }

  console.log(payload);

  const accessToken = jwtSign(
    {
      payload: payload,
    },
    userAuthInfo.value.secretText,
    {
      expiresIn: "24h", // expires in 24 hours
    }
  );

  return accessToken;
}
