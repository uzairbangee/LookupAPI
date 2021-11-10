import {
  errorCodes,
  ErrorStructure,
  errorTypes,
  returnError,
} from "../../../../utils/errorHandlingTemplate";
import { QueryGetApiVersionDetailsArgs } from "../../../../utils/graphqlSchemaTypes";
import { inspectId } from "../../../../utils/regexVerifier";
import { errorStrings } from "../../../errorStrings";

export default function validateInputs(
  data: QueryGetApiVersionDetailsArgs
): ErrorStructure | true {
  let { versionId } = data;

  if (!inspectId(versionId)) {
    return returnError(
      errorStrings.invalidIdInput("apiVersionId"),
      { errorCode: errorCodes.badRequest },
      errorTypes.badRequest
    );
  }

  return true;
}
