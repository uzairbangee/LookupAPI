import { CreateApiInput } from "../../../../utils/graphqlSchemaTypes";
import { inspectId, inspectString } from "../../../../utils/regexVerifier";
import {
  returnError,
  errorCodes,
  errorTypes,
  ErrorStructure,
} from "../../../../utils/errorHandlingTemplate";
import { errorStrings } from "../../../errorStrings";

export default function validateInputs(
  data: CreateApiInput
): ErrorStructure | true {
  let {
    apiId,
    title,
    description,
    saasType,
    type,
    releaseNotes,
    openApiDef,
    apiUrl,
    graphQlSchema,
  } = data;

  if (!inspectId(apiId)) {
    return returnError(
      errorStrings.invalidIdInput("entityId"),
      { errorCode: errorCodes.badRequest },
      errorTypes.badRequest
    );
  }

  if (!inspectString(title)) {
    return returnError(
      errorStrings.invalidStringInput("title"),
      { errorCode: errorCodes.badRequest },
      errorTypes.badRequest
    );
  }

  if (typeof description === "string" && !inspectString(description)) {
    return returnError(
      errorStrings.invalidStringInput("description"),
      { errorCode: errorCodes.badRequest },
      errorTypes.badRequest
    );
  }

  saasType = saasType.filter(function (elem, index, self) {
    return index === self.indexOf(elem);
  });

  if (saasType.length > 3) {
    return returnError(
      errorStrings.maxSaasTypesInput,
      { errorCode: errorCodes.badRequest },
      errorTypes.badRequest
    );
  }

  if (saasType.length < 1) {
    return returnError(
      errorStrings.minSaasTypesInput,
      { errorCode: errorCodes.badRequest },
      errorTypes.badRequest
    );
  }

  if (typeof releaseNotes === "string" && !inspectString(releaseNotes)) {
    return returnError(
      errorStrings.invalidStringInput("releaseNotes"),
      { errorCode: errorCodes.badRequest },
      errorTypes.badRequest
    );
  }

  if (!inspectString(apiUrl)) {
    return returnError(
      errorStrings.invalidStringInput("apiUrl"),
      { errorCode: errorCodes.badRequest },
      errorTypes.badRequest
    );
  }

  enum ApiType {
    Graphql = "GRAPHQL",
    Openapi = "OPENAPI",
  }

  if (!Object.values(ApiType).includes(type)) {
    return returnError(
      errorStrings.invalidApiType,
      { errorCode: errorCodes.badRequest },
      errorTypes.badRequest
    );
  } else if (type === ApiType.Graphql) {
    console.log("inside open api", data);
    console.log("inside open api graphql schema", graphQlSchema);
    if (
      (typeof graphQlSchema === "string" && !inspectString(graphQlSchema!)) ||
      !Object.keys(data).includes("graphQlSchema")
    )
      return returnError(
        errorStrings.invalidStringInput("graphQlSchema"),
        { errorCode: errorCodes.badRequest },
        errorTypes.badRequest
      );
  } else if (type === ApiType.Openapi) {
    console.log("inside open api", data);
    console.log("inside open api openapi key", openApiDef);
    if (
      !Object.keys(data).includes("openApiDef") ||
      (typeof openApiDef === "string" && !inspectString(openApiDef!))
    ) {
      return returnError(
        errorStrings.invalidStringInput("OpenapiDef"),
        { errorCode: errorCodes.badRequest },
        errorTypes.badRequest
      );
    }
  }

  return true;
}
