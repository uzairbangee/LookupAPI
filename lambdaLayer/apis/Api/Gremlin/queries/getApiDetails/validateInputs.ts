import {
  errorCodes,
  ErrorStructure,
  errorTypes,
  returnError,
} from "../../../../utils/errorHandlingTemplate";
import { QueryGetApiDetailsArgs } from "../../../../../../graphql/types";
import { inspectId } from "../../../../utils/regexVerifier";
import { errorStrings } from "../../../errorStrings";

export default function validateInputs(
  data: QueryGetApiDetailsArgs
): ErrorStructure | true {
  let { apiId } = data;

  if (!inspectId(apiId)) {
    return returnError(
      errorStrings.invalidIdInput("apiId"),
      { errorCode: errorCodes.badRequest },
      errorTypes.badRequest
    );
  }

  return true;
}
