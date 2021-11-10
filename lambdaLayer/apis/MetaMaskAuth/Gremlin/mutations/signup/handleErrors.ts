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

export async function checkIfUserAlreadyExists(
  g: gprocess.GraphTraversalSource,
  publicAddressNeptune: string
): Promise<true | ErrorStructure> {
  const userExists = await g
    .V(publicAddressNeptune)
    .hasLabel(vertex.userAuthentication.L)
    .hasNext();

  if (userExists) {
    const publicAddress =
      convertFromNeptuneId.publicAddress(publicAddressNeptune);
    return returnError(
      errorStrings.userAlreadyExists(publicAddress),
      { errorCode: errorCodes.refused },
      errorTypes.refused
    );
  }

  return true;
}
