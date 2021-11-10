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

export async function checkIfUserhasSignedUp(
  g: gprocess.GraphTraversalSource,
  publicAddressNeptune: string
): Promise<true | false> {
  const userExists = await g
    .V(publicAddressNeptune)
    .hasLabel(vertex.userAuthentication.L)
    .hasNext();

  if (!userExists) {
    console.log("no user");
    const publicAddress =
      convertFromNeptuneId.publicAddress(publicAddressNeptune);
    // return returnError(
    //   errorStrings.userDoesntExist(publicAddress),
    //   { errorCode: errorCodes.notFound },
    //   errorTypes.notFound
    // );
    return false;
  }

  return true;
}
