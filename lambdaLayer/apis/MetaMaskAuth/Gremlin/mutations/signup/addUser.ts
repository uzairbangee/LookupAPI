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

export async function addUser(
  g: gprocess.GraphTraversalSource,
  publicAddressNeptune: string
): Promise<UserAuth> {
  const nonce = Math.floor(Math.random() * 10000);
  const timeStamp = Date.now();
  const secretText = uuidv4();

  console.log("ading user");

  const addUser = await g
    .addV(vertex.userAuthentication.L)
    .property(id, publicAddressNeptune)
    .property(vertex.userAuthentication.prop.nonce.N, nonce)
    .property(vertex.userAuthentication.prop.secretText.N, secretText)
    .property(vertex.userAuthentication.prop.dateCreated.N, timeStamp)
    .as("new_user")
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

  addUser.value.publicAddress = convertFromNeptuneId.publicAddress(
    addUser.value.publicAddress
  );

  console.log(addUser.value);

  return addUser.value;
}
