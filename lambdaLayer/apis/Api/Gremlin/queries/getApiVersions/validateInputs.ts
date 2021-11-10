import { GetApiVersionsInput } from "../../../utils/graphqlSchemaTypes";
import { inspectId, inspectString } from "../../../../utils/regexVerifier";
import {
  returnError,
  errorCodes,
  errorTypes,
  ErrorStructure,
} from "../../../../utils/errorHandlingTemplate";
import { errorStrings } from "../../../errorStrings";

export default function validateInputs(
  data: GetApiVersionsInput
): ErrorStructure | true {
  let { apiId, pagination } = data;
  if (!inspectId(apiId)) {
    return returnError(
      errorStrings.invalidIdInput("apiId"),
      { errorCode: errorCodes.badRequest },
      errorTypes.badRequest
    );
  }

  if (pagination?.pageNumber! < 1) {
    return returnError(
      errorStrings.pageNumberMinInput,
      { errorCode: errorCodes.badRequest },
      errorTypes.badRequest
    );
  }

  if (pagination?.pageSize! < 1) {
    return returnError(
      errorStrings.pageSizeMinInput,
      { errorCode: errorCodes.badRequest },
      errorTypes.badRequest
    );
  }

  return true;
}
