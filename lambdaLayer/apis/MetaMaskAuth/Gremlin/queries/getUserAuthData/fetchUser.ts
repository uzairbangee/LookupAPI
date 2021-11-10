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
import { v4 as uuidv4 } from "uuid";
import { UserAuth } from "../../../../utils/graphqlSchemaTypes";

const __ = gprocess.statics;
const id = gprocess.t.id;
const within = gprocess.P.within;
const desc = gprocess.order.desc;

export async function fetchUser(
  g: gprocess.GraphTraversalSource,
  publicAddressNeptune: string
): Promise<UserAuth> {
  let getUser = await g
    .V(publicAddressNeptune)
    .hasLabel(vertex.userAuthentication.L)
    .project("publicAddress", "nonce", "creationDate")
    .by(id)
    .by(
      __.values(vertex.userAuthentication.prop.nonce.N)
        .fold()
        .coalesce(__.unfold(), __.constant(""))
    )
    .by(
      __.values(vertex.userAuthentication.prop.dateCreated.N)
        .fold()
        .coalesce(__.unfold(), __.constant(""))
    )
    .next();

  getUser.value.publicAddress = convertFromNeptuneId.publicAddress(
    getUser.value.publicAddress
  );

  console.log("getUser.value ", getUser.value);

  return getUser.value;
}
