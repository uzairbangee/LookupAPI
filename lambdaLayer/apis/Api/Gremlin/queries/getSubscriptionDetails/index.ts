import { process as gprocess } from "gremlin";
import {
  ApiSubscription,
  QueryGetSubscriptionDetailsArgs,
} from "../../../../utils/graphqlSchemaTypes";
import {
  returnError,
  errorCodes,
  errorTypes,
  ErrorStructure,
} from "../../../../utils/errorHandlingTemplate";
import { errorStrings } from "../../../errorStrings";
import {
  convertToNeptuneId,
  convertFromNeptuneId,
} from "../../../../utils/idConverter";
import { edge, vertex } from "../../../../utils/graphdb-elements-name.json";
import { cleanObject } from "../../../../utils/utils";

const __ = gprocess.statics;
const id = gprocess.t.id;
const within = gprocess.P.within;
const desc = gprocess.order.desc;
const lte = gprocess.P.lte;
const single = gprocess.cardinality.single;

export async function getSubscriptionDetails(
  g: gprocess.GraphTraversalSource,
  input: QueryGetSubscriptionDetailsArgs,
  username: string
): Promise<ErrorStructure | { data: ApiSubscription }> {
  console.log("Inputs===>", input, username);

  const neptuneUserId = convertToNeptuneId.user(username);

  /* checking if the user is the subscriber or developer of the API's version */
  const isSubsciber = await g
    .V(neptuneUserId)
    .out(edge.subscribes.L)
    .hasId(input.subscriptionId)
    .hasNext();

  if (!isSubsciber) {
    return returnError(
      errorStrings.noSubscriptionFound,
      { errorCode: errorCodes.unAuthorized },
      errorTypes.unAuthorized
    );
  }

  console.log("isSubsciber ===>", isSubsciber);

  /* getting the subsciption detail */

  const response = await g
    .V(input.subscriptionId)
    .project("id", "creationDate", "version", "subscriptionToken", "type")
    .by(id)
    .by(__.values(vertex.apiSubscription.prop.creationDate.N))
    .by(
      __.in_(edge.hasSubscription.L).choose(
        __.hasLabel(vertex.graphqlApiVersion.L),
        __.project("__typename", "id", "api", "status", "versionNumber")
          .by(__.constant("GraphqlApiVersion"))
          .by(id)
          .by(
            __.in_(edge.hasVersion.L)
              .project("id", "title", "image")
              .by(id)
              .by(
                __.values(vertex.api.prop.title.N)
                  .fold()
                  .coalesce(__.unfold(), __.constant(""))
              )
              .by(
                __.values(vertex.api.prop.image.N)
                  .fold()
                  .coalesce(__.unfold(), __.constant(""))
              )
          )
          .by(__.out(edge.hasStatus.L).values(vertex.versionStatus.prop.name.N))
          .by(__.values(vertex.graphqlApiVersion.prop.versionNumber.N)),

        __.project("__typename", "id", "api", "status", "versionNumber")
          .by(__.constant("OpenApiVersion"))
          .by(id)
          .by(
            __.in_(edge.hasVersion.L)
              .project("id", "title", "image")
              .by(id)
              .by(
                __.values(vertex.api.prop.title.N)
                  .fold()
                  .coalesce(__.unfold(), __.constant(""))
              )
              .by(
                __.values(vertex.api.prop.image.N)
                  .fold()
                  .coalesce(__.unfold(), __.constant(""))
              )
          )
          .by(__.out(edge.hasStatus.L).values(vertex.versionStatus.prop.name.N))
          .by(__.values(vertex.openApiVersion.prop.versionNumber.N))
      )
    )
    .by(
      __.values(vertex.apiSubscription.prop.subscriptionToken.N)
        .fold()
        .coalesce(__.unfold(), __.constant(""))
    )
    .by(__.out(edge.hasType.L).values(vertex.subscriptionType.prop.name.N))
    // .by(__.values(vertex.apiSubscription.prop.subscriptionToken.N))
    // .by(__.out(edge.hasType.L).values(vertex.subscriptionType.prop.name.N))
    .next();

  console.log("response", response);

  response.value.version.id = convertFromNeptuneId.apiVersion(
    response.value.version.id
  );
  response.value.version.api.id = convertFromNeptuneId.api(
    response.value.version.api.id
  );

  cleanObject(response.value);

  return { data: response.value as any as ApiSubscription };
}

// function chooseApiVersionByStatics(type: "Graphql" | "OpenApi") {
//     return __.project(
//         "__typename",
//         "id",
//         "api",
//         "status",
//         "dateCreated",
//         "datePublished",
//         "versionNumber",
//         "releaseNotes",
//         "apiToken",
//         type === "Graphql" ? "graphQlSchema" : "openApiDef",
//         "apiUrl"
//     )
//         .by(__.constant(type))
//         .by(id)
//         .by(findApiByStatics())
//         .by(
//             type === "Graphql"
//                 ? __.values(vertex.graphqlApiVersion.prop.versionStatus.N)
//                 : __.values(vertex.openApiVersion.prop.versionStatus.N)
//         )
//         .by(
//             type === "Graphql"
//                 ? __.values(vertex.graphqlApiVersion.prop.dateCreated.N)
//                 : __.values(vertex.openApiVersion.prop.dateCreated.N)
//         )
//         .by(
//             type === "Graphql"
//                 ? __.values(vertex.graphqlApiVersion.prop.datePublished.N)
//                 : __.values(vertex.openApiVersion.prop.datePublished.N)
//         )
//         .by(
//             type === "Graphql"
//                 ? __.values(vertex.graphqlApiVersion.prop.versionNumber.N)
//                 : __.values(vertex.openApiVersion.prop.versionNumber.N)
//         )
//         .by(
//             type === "Graphql"
//                 ? __.values(vertex.graphqlApiVersion.prop.releaseNotes.N)
//                 : __.values(vertex.openApiVersion.prop.releaseNotes.N)
//         )
//         .by(
//             type === "Graphql"
//                 ? __.values(vertex.graphqlApiVersion.prop.apiToken.N)
//                 : __.values(vertex.openApiVersion.prop.apiToken.N)
//         )
//         .by(
//             type === "Graphql"
//                 ? __.values(vertex.graphqlApiVersion.prop.graphQlSchema.N)
//                 : __.values(vertex.openApiVersion.prop.openDef.N)
//         )
//         .by(
//             type === "Graphql"
//                 ? __.values(vertex.graphqlApiVersion.prop.apiUrl.N)
//                 : __.values(vertex.openApiVersion.prop.apiUrl.N)
//         );
// }

// function findApiByStatics() {
//     return __.in_(edge.hasVersion.L)
//         .project(
//             "id",
//             "title",
//             "developer",
//             "description",
//             "saasType",
//             "image",
//             "status",
//             "creationDate",
//             "type"
//         )
//         .by(id) // id
//         .by(__.values(vertex.api.prop.title.N)) // tittle
//         .by(findUserByStatics()) // developer
//         .by(__.values(vertex.api.prop.description.N)) // description
//         .by(__.out(edge.hasType.L).values(vertex.apiSaasType.prop.name)) // saasType
//         .by(__.values(vertex.api.prop.image.N)) // image
//         .by(__.choose(__.and(__.out(edge.hasVersion.L).count().is(lte(1)) , __.out(edge.hasVersion.L).out(edge.hasStatus.L).hasId(vertex.versionStatus.prop.id.V.versionStatusUnpublished))
//         ,__.constant(vertex.versionStatus.prop.name.V.UNPUBLISHED)
//         ,__.constant(vertex.versionStatus.prop.name.V.PUBLISHED)
//         )
//         ) // status
//         .by(__.values(vertex.api.prop.creationDate.N)) // creationDate
//         .by(
//             __.choose(
//                 __.out(edge.hasVersion.L)
//                     .range(0, 1)
//                     .hasLabel(vertex.graphqlApiVersion.L),
//                 __.constant(vertex.graphqlApiVersion.L),
//                 __.constant(vertex.openApiVersion.L)
//             )
//         ); // type
// }

// function findUserByStatics() {
//     return __.in_(edge.creates.L)
//         .project(
//             "id",
//             "firstName",
//             "lastName",
//             "creationDate",
//         )
//         .by(id) // id
//         .by(__.values(vertex.user.prop.firstName.N)) // firstName
//         .by(__.values(vertex.user.prop.lastName.N)) // lastName
//         .by(__.values(vertex.user.prop.dateCreated.N)) // creationDate

// }