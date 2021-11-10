import { process as gprocess } from "gremlin";
import {
  errorCodes,
  ErrorStructure,
  errorTypes,
  returnError,
} from "../../../../utils/errorHandlingTemplate";
import { convertFromNeptuneId } from "../../../../utils/idConverter";
import { errorStrings } from "../../../errorStrings";
import { edge, vertex } from "../../../../utils/graphdb-elements-name.json";

export async function checkApiVersionId(
  g: gprocess.GraphTraversalSource,
  apiVersionIdNeptune: string
): Promise<true | ErrorStructure> {
  const checkApi_VersionId = await g.V(apiVersionIdNeptune).hasNext();
  console.log("CheckAPiVersionID => ", checkApi_VersionId);

  if (!checkApi_VersionId) {
    const apiVerionId = convertFromNeptuneId.apiVersion(apiVersionIdNeptune);
    return returnError(
      errorStrings.idNotAvailable(apiVerionId),
      { errorCode: errorCodes.refused },
      errorTypes.refused
    );
  }

  return true;
}

export async function isOwner(
  g: gprocess.GraphTraversalSource,
  apiVersionIdNeptune: string,
  usernameNeptune: string
): Promise<Boolean> {
  const checkOwner = await g
    .V(apiVersionIdNeptune)
    .in_(edge.hasVersion.L)
    .in_(edge.creates.L)
    .hasId(usernameNeptune)
    .hasNext();

  console.log("CHeck Owner => ", checkOwner);
  return checkOwner;
}

export async function isUnpublishedVersion(
  g: gprocess.GraphTraversalSource,
  apiVersionIdNeptune: string,
  owner: Boolean
): Promise<true | ErrorStructure> {
  const checkUnpublishedVersion = await g
    .V(apiVersionIdNeptune)
    .out(edge.hasStatus.L)
    .hasId(vertex.versionStatus.prop.id.V.versionStatusUnpublished)
    .hasNext();
  if (owner && checkUnpublishedVersion) {
    return true;
  }

  const apiVerionId = convertFromNeptuneId.api(apiVersionIdNeptune);
  return returnError(
    errorStrings.unPublishedVersion,
    { errorCode: errorCodes.refused },
    errorTypes.refused
  );
}
