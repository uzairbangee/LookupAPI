import * as gremlin from "gremlin";
import {
  ApiVersionsListOutput,
  QueryGetApiVersionsArgs,
} from "../../../../utils/graphqlSchemaTypes";

import * as schema from "../../../../utils/graphdb-elements-name.json";

import {
  errorCodes,
  ErrorStructure,
  errorTypes,
  returnError,
} from "../../../../utils/errorHandlingTemplate";
import { errorStrings } from "../../../errorStrings";

const generateError = returnError as typeof returnError;
const error_Codes = errorCodes as typeof errorCodes;
const error_Types = errorTypes as typeof errorTypes;

import * as idConverter from "../../../../utils/idConverter";
import validateInputs from "../getApiVersions/validateInputs";
import { checkApiId } from "./handleErrors";
const { edge, vertex } = schema;
import { cleanObject } from "../../../../utils/utils";
import {
  ApiType,
  SubscriptionType,
  ApiStatus,
} from "../../../../utils/graphqlSchemaTypes";

type outputType = ErrorStructure | { data: ApiVersionsListOutput };

const __ = gremlin.process.statics;
const id = gremlin.process.t.id;
const neq = gremlin.process.P.neq;
const desc = gremlin.process.order.desc;

export async function getApiVersionsList(
  g: gremlin.process.GraphTraversalSource<gremlin.process.GraphTraversal>,
  data: QueryGetApiVersionsArgs,
  username: string | null
): Promise<outputType> {
  const { apiId, pagination } = data.input!;

  const validate_inputs = validateInputs(data.input!);

  if (validate_inputs !== true) {
    return validate_inputs;
  }

  const apiIdNeptune = idConverter.convertToNeptuneId.api(apiId);

  const check_api_id = await checkApiId(g, apiIdNeptune);

  console.log("before check api condition", check_api_id);

  if (check_api_id !== true) {
    return check_api_id;
  }

  console.log("after check api condition", check_api_id);

  // if (username) {
  //     const userIdNeptune = idConverter.convertToNeptuneId.user(username)
  //     const errorHandling = await g.V(apiIdNeptune).hasLabel(vertex.api.L).fold().coalesce(__.unfold()
  //       .choose(__.out(edge.has_status.L).values(vertex.apiVersionStatus.prop.name.N).is(neq(vertex.apiVersionStatus.prop.name.V.PUBLIC))
  //         , __.choose(__.in_(edge.creates.L).id().is(neq(userIdNeptune))
  //         ,__.coalesce(__.V(userIdNeptune).out(edge.has_subscription.L).out(edge.subscription_for.L).in_(edge.hasVersion.L).hasId(apiId)
  //         ,__.constant(api_errorStrings.notPermittedToViewApiInfo)
  //         )
  //         ))
  //       , __.constant(api_errorStrings.apiNotFound(apiId)))
  //       .next()

  //     if (errorHandling.value === api_errorStrings.apiNotFound(apiId)) {
  //       return generateError(api_errorStrings.apiNotFound(apiId), {errorCode: error_Codes.notFound }, error_Types.notFound)
  //     }

  //     if (errorHandling.value === api_errorStrings.notPermittedToViewApiInfo) {
  //       return generateError(api_errorStrings.notPermittedToViewApiInfo, {errorCode: error_Codes.refused }, error_Types.refused)
  //     }

  // }
  // else {
  //     const errorHandling = await g.V(apiIdNeptune).hasLabel( vertex.api.L)
  //       .fold()
  //       .coalesce(__.unfold().coalesce(__.out(edge.has_status.L).hasId(vertex.apiStatus.prop.id.V.apiStatusPublic)
  //         , __.constant(api_errorStrings.notPermittedToViewApiInfo))
  //         , __.constant(api_errorStrings.apiNotFound(apiId)))
  //       .next()

  //     if (errorHandling.value === api_errorStrings.apiNotFound(apiId)) {
  //         return generateError(api_errorStrings.apiNotFound(apiId), {errorCode: error_Codes.notFound }, error_Types.notFound)
  //     }

  //     if (errorHandling.value === api_errorStrings.notPermittedToViewApiInfo) {
  //         return generateError(api_errorStrings.notPermittedToViewApiInfo, {errorCode: error_Codes.refused }, error_Types.refused)
  //     }
  // }

  const limit = pagination?.pageSize!;
  const offset = (pagination?.pageNumber! - 1) * limit;
  const pageNumber = pagination?.pageNumber!;

  // if (username){
  // const userIdNeptune = idConverter.convertToNeptuneId.user(username)

  let getPubVersions: any = null;
  let publishedVersions: any = null;

  const countPublishedVersions = await g
    .V(apiIdNeptune)
    .out(edge.hasVersion.L)
    // .where(__.out(edge.hasStatus.L)
    // .hasId(vertex.versionStatus.prop.id.V.versionStatusPublished))
    .count()
    .next();

  console.log("countPublishedVersions ", countPublishedVersions);

  getPubVersions = await g
    .V(apiIdNeptune)
    .out(edge.hasVersion.L)
    // .where(__.out(edge.hasStatus.L)
    // .hasId(vertex.versionStatus.prop.id.V.versionStatusPublished))
    .order()
    .by(vertex.graphqlApiVersion.prop.versionNumber.N, desc)
    .range(offset, pageNumber * limit)
    .choose(
      __.hasLabel(vertex.graphqlApiVersion.L), ///Condition
      // ,__.project("__typename","id","api","status", "dateCreated", "datePublished", "versionNumber", "releaseNotes", "subscriptions", "apiToken", "graphQlSchema", "apiUrl") ///true
      __.project("__typename", "id", "status", "dateCreated", "versionNumber") ///true

        .by(__.constant("GraphqlApiVersion"))
        .by(id)
        // .by(__.in_(edge.hasVersion.L)  ///api
        //     .project("id","title","description","image","creationDate","status","ApiType","saasType","developer")
        //       .by(id)
        //       .by(__.values(vertex.api.prop.title.N).fold().coalesce(__.unfold(), __.constant("")))
        //       .by(__.values(vertex.api.prop.description.N).fold().coalesce(__.unfold(), __.constant("")))
        //       .by(__.values(vertex.api.prop.image.N).fold().coalesce(__.unfold(), __.constant("")))
        //       .by(__.values(vertex.api.prop.creationDate.N).fold().coalesce(__.unfold(), __.constant("")))
        //       .by(__.out(edge.hasVersion.L).out(edge.hasStatus.L).values(vertex.versionStatus.prop.name.N))
        //       .by(__.out(edge.hasVersion.L).choose(__.hasLabel(vertex.graphqlApiVersion.L, __.constant(ApiType.Graphql),__.constant(ApiType.Openapi))))
        //       .by(__.out(edge.hasType.L).values(vertex.apiSaasType.prop.name.N).fold())

        //       .by(__.in_(edge.creates.L)
        //       .project("id","firstName","lastName","secretText","creationDate","authData")
        //         .by(id)
        //         .by(__.values(vertex.user.prop.firstName.N).fold().coalesce(__.unfold(), __.constant("")))
        //         .by(__.values(vertex.user.prop.lastName.N).fold().coalesce(__.unfold(), __.constant("")))
        //         .by(__.values(vertex.user.prop.dateCreated.N).fold().coalesce(__.unfold(), __.constant("")))
        //         .by(__.out(vertex.userAuthentication.L)
        //       .project("nonce","publicAddress","creationDate")
        //         .by(__.values(vertex.userAuthentication.prop.nonce.N).fold().coalesce(__.unfold(), __.constant("")))
        //         .by(id)
        //         .by(__.values(vertex.api.prop.creationDate.N).fold().coalesce(__.unfold(), __.constant("")))
        //     ))
        // )

        .by(__.out(edge.hasStatus.L).values("name"))
        .by(
          __.values(vertex.graphqlApiVersion.prop.dateCreated.N)
            .fold()
            .coalesce(__.unfold(), __.constant(""))
        )
        // .by(__.values(vertex.graphqlApiVersion.prop.datePublished.N).fold().coalesce(__.unfold(), __.constant('')))
        .by(
          __.values(vertex.graphqlApiVersion.prop.versionNumber.N)
            .fold()
            .coalesce(__.unfold(), __.constant(""))
        ),
      // .by(__.values(vertex.graphqlApiVersion.prop.releaseNotes.N).fold().coalesce(__.unfold(), __.constant('')))
      // .by(__.out(edge.hasSubscription.L)
      //   .project("id","creationDate","subscriptionToken","type")
      //   .by(id)
      //   .by(__.values(vertex.apiSubscription.prop.creationDate.N).fold().coalesce(__.unfold(), __.constant("")))
      //   .by(__.values(vertex.apiSubscription.prop.subscriptionToken.N))
      //   .by(__.constant(SubscriptionType.Testing))
      // )
      // .by(__.values(vertex.graphqlApiVersion.prop.apiToken.N).fold().coalesce(__.unfold(), __.constant('')))
      // .by(__.values(vertex.graphqlApiVersion.prop.graphQlSchema.N).fold().coalesce(__.unfold(), __.constant('')))
      // .by(__.values(vertex.graphqlApiVersion.prop.apiUrl.N).fold().coalesce(__.unfold(), __.constant('')))

      // ,__.project("__typename","id","api","status", "dateCreated", "datePublished", "versionNumber", "releaseNotes", "subscriptions", "apiToken", "graphQlSchema", "apiUrl") ///false
      __.project("__typename", "id", "status", "dateCreated", "versionNumber") ///true

        .by(__.constant("OpenApiVersion"))
        .by(id)
        // .by(__.in_(edge.hasVersion.L)  ///api
        //     .project("id","title","description","image","creationDate","status","ApiType","saasType","developer")
        //       .by(id)
        //       .by(__.values(vertex.api.prop.title.N).fold().coalesce(__.unfold(), __.constant("")))
        //       .by(__.values(vertex.api.prop.description.N).fold().coalesce(__.unfold(), __.constant("")))
        //       .by(__.values(vertex.api.prop.image.N).fold().coalesce(__.unfold(), __.constant("")))
        //       .by(__.values(vertex.api.prop.creationDate.N).fold().coalesce(__.unfold(), __.constant("")))
        //       .by(__.out(edge.hasVersion.L).out(edge.hasStatus.L).values(vertex.versionStatus.prop.name.N))
        //       .by(__.out(edge.hasVersion.L).choose(__.hasLabel(vertex.openApiVersion.L, __.constant(ApiType.Graphql),__.constant(ApiType.Openapi))))
        //       .by(__.out(edge.hasType.L).values(vertex.apiSaasType.prop.name.N).fold())

        //       .by(__.in_(edge.creates.L)
        //       .project("id","firstName","lastName","secretText","creationDate","authData")
        //       .by(id)
        //       .by(__.values(vertex.user.prop.firstName.N).fold().coalesce(__.unfold(), __.constant("")))
        //       .by(__.values(vertex.user.prop.lastName.N).fold().coalesce(__.unfold(), __.constant("")))
        //       .by(__.values(vertex.user.prop.dateCreated.N).fold().coalesce(__.unfold(), __.constant("")))
        //       .by(__.out(vertex.userAuthentication.L)
        //           .project("nonce","publicAddress","creationDate")
        //           .by(__.values(vertex.userAuthentication.prop.nonce.N).fold().coalesce(__.unfold(), __.constant("")))
        //           .by(id)
        //           .by(__.values(vertex.api.prop.creationDate.N).fold().coalesce(__.unfold(), __.constant("")))
        //         )
        //       )
        // )

        .by(__.out(edge.hasStatus.L).values("name"))
        .by(
          __.values(vertex.openApiVersion.prop.dateCreated.N)
            .fold()
            .coalesce(__.unfold(), __.constant(""))
        )
        // .by(__.values(vertex.openApiVersion.prop.datePublished.N).fold().coalesce(__.unfold(), __.constant('')))
        .by(
          __.values(vertex.openApiVersion.prop.versionNumber.N)
            .fold()
            .coalesce(__.unfold(), __.constant(""))
        )
      // .by(__.values(vertex.openApiVersion.prop.releaseNotes.N).fold().coalesce(__.unfold(), __.constant('')))
      // .by(__.out(edge.hasSubscription.L)
      //   .project("id","creationDate","subscriptionToken","type")
      //   .by(id)
      //   .by(__.values(vertex.apiSubscription.prop.creationDate.N).fold().coalesce(__.unfold(), __.constant("")))
      //   .by(__.values(vertex.apiSubscription.prop.subscriptionToken.N))
      //   .by(__.constant(SubscriptionType.Testing))
      // )
      // .by(__.values(vertex.openApiVersion.prop.apiToken.N).fold().coalesce(__.unfold(), __.constant('')))
      // .by(__.values(vertex.openApiVersion.prop.openDef.N).fold().coalesce(__.unfold(), __.constant('')))
      // .by(__.values(vertex.openApiVersion.prop.apiUrl.N).fold().coalesce(__.unfold(), __.constant('')))
    )

    .toList();

  console.log("getPubVersions before for loop ----> ", getPubVersions);

  for (let version of getPubVersions) {
    version.id = idConverter.convertFromNeptuneId.apiVersion(version.id);
    cleanObject(version);
  }

  console.log("getPubVersions ----> ", getPubVersions);

  publishedVersions = {
    totalCount: countPublishedVersions.value,
    data: getPubVersions,
  };

  console.log("publishedVersions ---->", publishedVersions);

  return { data: publishedVersions };

  // }
  // else {

  //     let getPubVersions:any = null;
  //     // let publishedVersions = null;

  //     const countPublishedVersions = await g.V(apiIdNeptune)
  //                             .out(edge.hasVersion.L)
  //                             // .where(__.out(edge.hasStatus.L).hasId(vertex.versionStatus.prop.id.V.versionStatusPublished))
  //                             .count().next()

  //     getPubVersions = await g.V(apiIdNeptune)
  //                         .out(edge.hasVersion.L)
  //                         // .where(__.out(edge.hasStatus.L).hasId(vertex.versionStatus.prop.id.V.versionStatusPublished))
  //                         .order().by(vertex.graphqlApiVersion.prop.versionNumber.N, desc).range(offset, pageNumber * limit)
  //                         .choose(
  //                           __.in_(edge.hasVersion.L).in_(edge.creates.L).hasLabel(vertex.graphqlApiVersion.L),
  //                         )
  //                         .toList()

  //     for (let version of getPubVersions) {

  //       version.versionId = idConverter.convertFromNeptuneId.apiVersion(version.versionId)
  //       cleanObject(version)
  //     }

  //     const publishedVersions = {totalCount: countPublishedVersions.value, data: getPubVersions }

  //     console.log(publishedVersions)

  //     return publishedVersions;

  // }
}

const projectApiVersion = (apiId: string, type: ApiType) => {
  return __.project(
    "__typename",
    "id",
    "dateCreated",
    "datePublished",
    "versionNumber",
    "releaseNotes",
    "apiToken",
    type === ApiType.Graphql ? "graphQlSchema" : "openApiDef",
    "status",
    "apiUrl",
    "api",
    "subscriptions"
  )
    .by(
      type === ApiType.Graphql
        ? __.constant("GraphqlApiVersion")
        : __.constant("OpenApiVersion")
    )
    .by(id)
    .by(
      type === ApiType.Graphql
        ? __.values(vertex.graphqlApiVersion.prop.dateCreated.N)
            .fold()
            .coalesce(__.unfold(), __.constant(""))
        : __.values(vertex.openApiVersion.prop.dateCreated.N)
            .fold()
            .coalesce(__.unfold(), __.constant(""))
    )
    .by(
      type === ApiType.Graphql
        ? __.values(vertex.graphqlApiVersion.prop.datePublished.N)
            .fold()
            .coalesce(__.unfold(), __.constant(""))
        : __.values(vertex.openApiVersion.prop.datePublished.N)
            .fold()
            .coalesce(__.unfold(), __.constant(""))
    )
    .by(
      type === ApiType.Graphql
        ? __.values(vertex.graphqlApiVersion.prop.versionNumber.N)
            .fold()
            .coalesce(__.unfold(), __.constant(""))
        : __.values(vertex.openApiVersion.prop.versionNumber.N)
            .fold()
            .coalesce(__.unfold(), __.constant(""))
    )
    .by(
      type === ApiType.Graphql
        ? __.values(vertex.graphqlApiVersion.prop.releaseNotes.N)
            .fold()
            .coalesce(__.unfold(), __.constant(""))
        : __.values(vertex.openApiVersion.prop.releaseNotes.N)
            .fold()
            .coalesce(__.unfold(), __.constant(""))
    )
    .by(
      type === ApiType.Graphql
        ? __.values(vertex.graphqlApiVersion.prop.apiToken.N)
        : __.values(vertex.openApiVersion.prop.apiToken.N)
    )
    .by(
      type === ApiType.Graphql
        ? __.values(vertex.graphqlApiVersion.prop.graphQlSchema.N)
            .fold()
            .coalesce(__.unfold(), __.constant(""))
        : __.values(vertex.openApiVersion.prop.openDef.N)
            .fold()
            .coalesce(__.unfold(), __.constant(""))
    )
    .by(
      type === ApiType.Graphql
        ? __.out(edge.hasStatus.L).values(vertex.versionStatus.prop.name.N)
        : __.out(edge.hasStatus.L).values(vertex.versionStatus.prop.name.N)
    )
    .by(
      type === ApiType.Graphql
        ? __.values(vertex.graphqlApiVersion.prop.apiUrl.N)
        : __.values(vertex.openApiVersion.prop.apiUrl.N)
    )
    .by(projectApi(apiId))
    .by(projectSubscription());
};

const projectSubscription = () => {
  return __.out(edge.hasSubscription.L)
    .project("id", "creationDate", "subscriptionToken", "type")
    .by(id)
    .by(
      __.values(vertex.apiSubscription.prop.creationDate.N)
        .fold()
        .coalesce(__.unfold(), __.constant(""))
    )
    .by(__.values(vertex.apiSubscription.prop.subscriptionToken.N))
    .by(__.constant(SubscriptionType.Testing))
    .fold();
};

const projectApi = (apiId: string) => {
  return (
    __.V(apiId)
      .project(
        "id",
        "title",
        "description",
        "image",
        "creationDate",
        "status",
        "type",
        "saasType",
        "developer"
      )
      .by(id)
      .by(
        __.values(vertex.api.prop.title.N)
          .fold()
          .coalesce(__.unfold(), __.constant(""))
      )
      .by(
        __.values(vertex.api.prop.description.N)
          .fold()
          .coalesce(__.unfold(), __.constant(""))
      )
      .by(
        __.values(vertex.api.prop.image.N)
          .fold()
          .coalesce(__.unfold(), __.constant(""))
      )
      .by(
        __.values(vertex.api.prop.creationDate.N)
          .fold()
          .coalesce(__.unfold(), __.constant(""))
      )
      .by(
        __.out(edge.hasVersion.L)
          .out(edge.hasStatus.L)
          .choose(
            __.hasId(vertex.versionStatus.prop.id.V.versionStatusUnpublished),
            __.constant(ApiStatus.Underdevelopment),
            __.constant(ApiStatus.Public)
          )
      )
      .by(
        __.out(edge.hasVersion.L).choose(
          __.hasLabel(vertex.graphqlApiVersion.L),
          __.constant(ApiType.Graphql),
          __.constant(ApiType.Openapi)
        )
      )
      .by(__.out(edge.hasType.L).values(vertex.apiSaasType.prop.name.N).fold())
      // developer field in api
      .by(
        __.in_(edge.creates.L)
          .project(
            "id",
            "firstName",
            "lastName",
            "secretText",
            "creationDate",
            "authData"
          )
          .by(id)
          .by(
            __.values(vertex.user.prop.firstName.N)
              .fold()
              .coalesce(__.unfold(), __.constant(""))
          )
          .by(
            __.values(vertex.user.prop.lastName.N)
              .fold()
              .coalesce(__.unfold(), __.constant(""))
          )
          .by(
            __.values(vertex.user.prop.secretText.N)
              .fold()
              .coalesce(__.unfold(), __.constant(""))
          )
          .by(
            __.values(vertex.user.prop.dateCreated.N)
              .fold()
              .coalesce(__.unfold(), __.constant(""))
          )
          // auth data field in developer
          .by(
            __.out(edge.hasAuthentication.L)
              .project("nonce", "publicAddress", "creationDate")
              .by(
                __.values(vertex.userAuthentication.prop.nonce.N)
                  .fold()
                  .coalesce(__.unfold(), __.constant(""))
              )
              .by(id)
              .by(
                __.values(vertex.userAuthentication.prop.dateCreated.N)
                  .fold()
                  .coalesce(__.unfold(), __.constant(""))
              )
          )
      )
  );
};
