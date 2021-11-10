import {
  returnError,
  errorCodes,
  errorTypes,
  ErrorStructure,
} from "../../../../utils/errorHandlingTemplate";
import { errorStrings } from "../../../errorStrings";
import { process as gprocess } from "gremlin";
import { convertFromNeptuneId } from "../../../../utils/idConverter";

export async function checkApiId(
  g: gprocess.GraphTraversalSource,
  apiIdNeptune: string
): Promise<true | ErrorStructure> {
  const checkApiId = await g.V(apiIdNeptune).hasNext();
  console.log("checkApiId ---->", checkApiId);

  if (checkApiId) {
    const apiId = convertFromNeptuneId.api(apiIdNeptune);
    return returnError(
      errorStrings.idNotAvailable(apiId),
      { errorCode: errorCodes.refused },
      errorTypes.refused
    );
  }
  return true;
}
