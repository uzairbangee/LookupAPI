import { process as gprocess } from "gremlin";
import {
  QueryGetMyApisArgs,
  ApisListOutput,
  ApiStatus,
  ApiSaasType,
  Api,
} from "../../../../utils/graphqlSchemaTypes";
import {
  ErrorStructure,
  returnError,
  errorCodes,
  errorTypes,
} from "../../../../utils/errorHandlingTemplate";
import { edge, vertex } from "../../../../utils/graphdb-elements-name.json";
import { errorStrings } from "../../../errorStrings";
import { convertToNeptuneId } from "../../../../utils/idConverter";
// import validateInputs from "./validateInputs";
// import { checkApis } from "./handleErrors";

const __ = gprocess.statics;
const T = gprocess.t;
const P = gprocess.P;
const desc = gprocess.order.desc;

export default async function get_my_Apis(
  g: gprocess.GraphTraversalSource,
  { input }: QueryGetMyApisArgs,
  username: string
): Promise<ErrorStructure | { data: ApisListOutput }> {
  // const validate_inputs = validateInputs(data);

  // if (validate_inputs !== true) {
  //   return validate_inputs;
  // }

  // const allApis = await checkApis(g);
  // return allApis;

  const neptuneUserId = convertToNeptuneId.user(username);

  /* validating the inputs */
  const apiSaasTypes = input?.apiSaasType || [];
  const apiStatus = input?.apiStatus || ApiStatus.Underdevelopment;
  const pageNumber = input?.pagination?.pageNumber || 1;
  const pageSize = input?.pagination?.pageSize || 10;

  if (pageNumber < 1) {
    return returnError(
      errorStrings.pageNumberMinInput,
      { errorCode: errorCodes.badRequest },
      errorTypes.badRequest
    );
  }
  if (pageSize < 1) {
    return returnError(
      errorStrings.pageSizeMinInput,
      { errorCode: errorCodes.badRequest },
      errorTypes.badRequest
    );
  }

  const limit = pageSize;
  const offset = (pageNumber - 1) * limit;

  /* Getting all those API vertices that the user has created */

  let apiVertices = g.V(neptuneUserId).out(edge.creates.L);

  if (apiStatus) {
    // apiVertices = apiVertices.out()
  }

  /* filtering all those API vertices that match with the apiSaasTypes */
  if (apiSaasTypes.length > 0) {
    const apiSaasTypeIds: string[] = [];
    Object.values(vertex.apiSaasType.prop.id.V).forEach((saasTypeId) => {
      const saasType = saasTypeId.replace("apiType_", ""); // eg: apiType_CRM => CRM
      if (apiSaasTypes.includes(saasType as ApiSaasType)) {
        apiSaasTypeIds.push(saasTypeId);
      }
    });

    // apiVertices = apiVertices.out(edge.hasType.L).or(...apiSaasTypeIds.map((id) => __.hasId(id))).in_(edge.hasType.L);
    apiVertices = apiVertices.where(
      __.out(edge.hasType.L).hasId(P.within(...apiSaasTypeIds))
    );
  }

  /* getting total count of the apis */
  const getTotalCounts = apiVertices;

  /* ordering API vertices by dateCreated and limiting by page number and page size */
  apiVertices = apiVertices
    .order()
    .by(__.values(vertex.api.prop.creationDate.N), desc)
    .range(offset, pageNumber * limit)
    .project(
      "id",
      "title",
      "developer",
      "description",
      "saasType",
      "image",
      "status",
      "creationDate",
      "type"
    )
    .by(T.id) // id
    .by(__.values(vertex.api.prop.title.N)) // tittle
    .by(findUserByStatics()) // developer
    .by(__.values(vertex.api.prop.description.N)) // description
    .by(__.out(edge.hasType.L).values(vertex.apiSaasType.prop.name)) // saasType
    .by(__.values(vertex.api.prop.image.N)) // image
    .by(__.constant("UNDERDEVELOPMENT")) // status
    .by(__.values(vertex.api.prop.creationDate.N)) // creationDate
    .by(
      __.choose(
        __.out(edge.hasVersion.L)
          .range(0, 1)
          .hasLabel(vertex.graphqlApiVersion.L),
        __.constant("GRAPHQL"),
        __.constant("OPENAPI")
      )
    );

  const data = await apiVertices.toList();
  const totalCount = await getTotalCounts.count().next();

  return {
    data: {
      data: data as Api[],
      totalCount: totalCount.value,
    },
  };
}

function findUserByStatics() {
  return __.in_(edge.creates.L)
    .project(
      "id",
      "firstName",
      "lastName",
      "secretText",
      "creationDate",
      "authData"
    )
    .by(T.id) // id
    .by(__.values("firstName")) // firstName
    .by(__.values("lastName")) // lastName
    .by(__.values("secretText")) // secretText
    .by(__.values("creationDate")) // creationDate
    .by(
      __.project("nonce", "publicAddress")
        .by(__.values("nonce"))
        .by(__.values("publicAddress"))
    ); // authData
}
