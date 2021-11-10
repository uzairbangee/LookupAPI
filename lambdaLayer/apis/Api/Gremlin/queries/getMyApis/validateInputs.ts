import {
  returnError,
  errorCodes,
  errorTypes,
  ErrorStructure,
} from "../../../../utils/errorHandlingTemplate";
import { errorStrings } from "../../../errorStrings";
import { QueryGetMyApisArgs } from "../../../../../../graphql/types";

export default function validateInputs(
  data: QueryGetMyApisArgs
): ErrorStructure | true {
  let { input }: any = data;
  let { pagination, apiSaasType, apiStatus }: any = input;

  if (
    !(
      (
        typeof pagination === "object" &&
        pagination !== null /* checking is object or not */ &&
        "pageSize" in pagination &&
        typeof pagination?.pageSize ===
          "string" /* checking is object's property exist or not */ &&
        "pageNumber" in pagination &&
        typeof pagination?.pageNumber === "string"
      ) /* checking is object's property exist or not */
    )
  ) {
    return returnError(
      errorStrings.invalidIdInput("pagination"),
      { errorCode: errorCodes.badRequest },
      errorTypes.badRequest
    );
  }

  const enumPossibleValues = [
    "CRM",
    "ERP",
    "ACCOUNTING",
    "PM",
    "CMS",
    "COMMUNICATION",
    "ECOMMERCE",
    "HRM",
    "PAYMENT_GATEWAY",
    "BILLING",
    "FINANCE",
    "EDUCATION",
    "MEDICAL",
    "MUSIC",
    "NEWS",
    "SOCIAL_NETWORKING",
    "WEATHER",
    "LIFESTYLE",
    "PRODUCTIVITY",
    "SPORTS",
    "TRAVEL",
    "FOOD",
    "PHOTO_VIDEO",
    "UTILITIES",
    "DATA",
    "AI",
    "IOT",
    "BLOCKCHAIN_CRYPTO",
    "BUSINESS",
    "REFERENCE",
    "HEALTH_FITNESS",
  ];
  if (
    !(
      (
        Array.isArray(apiSaasType) /* checking is array or not */ &&
        apiSaasType.every((i: any) => enumPossibleValues.includes(i))
      ) /* every value of array any one of described */
    )
  ) {
    return returnError(
      errorStrings.invalidIdInput("apiSaasType"),
      { errorCode: errorCodes.badRequest },
      errorTypes.badRequest
    );
  }

  if (
    !(
      typeof apiStatus === "string" /* checking is string or not */ &&
      (apiStatus === "UNDERDEVELOPMENT" || apiStatus === "PUBLIC")
    )
  ) {
    return returnError(
      errorStrings.invalidIdInput("apiStatus"),
      { errorCode: errorCodes.badRequest },
      errorTypes.badRequest
    );
  }

  return true;
}
