import * as gremlin from "gremlin";
import * as hackolade_graphdb from "../../../../utils/graphdb-elements-name.json";
import {
  CreateApiInput,
  ApiVersion,
  ApiType,
  SubscriptionType,
} from "../../../utils/graphqlSchemaTypes";
import { ErrorStructure } from "../../../../utils/errorHandlingTemplate";
import validateInputs from "../createApi/validateInputs";
import {
  convertFromNeptuneId,
  convertToNeptuneId,
} from "../../../../utils/idConverter";
import { checkApiId } from "./handleErrors";
import { v4 as uuidv4 } from "uuid";
import { sign } from "jsonwebtoken";
import { cleanObject } from "../../../../utils/utils";
import { ApiStatus } from "../../../../utils/graphqlSchemaTypes";
const { edge, vertex } = hackolade_graphdb;
const __ = gremlin.process.statics;
const id = gremlin.process.t.id;

export default async function create_api(
  g: gremlin.process.GraphTraversalSource<gremlin.process.GraphTraversal>,
  data: CreateApiInput,
  username: string
): Promise<ErrorStructure | { data: ApiVersion }> {
  const validate_inputs = validateInputs(data);

  if (validate_inputs !== true) {
    return validate_inputs;
  }

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
    image,
  } = data;

  const userIdNeptune = convertToNeptuneId.user(username);
  const apiIdNeptune = convertToNeptuneId.api(apiId);

  const check_api_id = await checkApiId(g, apiIdNeptune);

  if (check_api_id !== true) {
    console.log("condition false for check_api_id");
    return check_api_id;
  }

  const secretText = uuidv4();
  console.log("secretText", secretText);

  const user_secret_key: any = await g
    .V(userIdNeptune)
    .values(vertex.user.prop.secretText.N)
    .next();
  const timeStamp = Date.now();

  console.log("user_secret_key", user_secret_key);

  const versionId = `${apiId}-1`;
  const versionIdNeptune = convertToNeptuneId.apiVersion(versionId);

  const api_info = {
    apiId: apiId,
    entityID: username,
    api_kind: ApiType.Graphql,
    versionNumber: 1,
    versionId: versionId,
  };

  const api_token = sign(api_info, user_secret_key.value);

  const subscriptionId1 = uuidv4();
  const subscriptionId2 = uuidv4();
  const subscriptionId3 = uuidv4();

  const subscription_info1 = {
    tokenType: SubscriptionType.Testing,
    apiId: apiId,
    entityID: username,
    subscriptionId1,
    versionId: versionId,
  };

  const subscription_info2 = {
    tokenType: SubscriptionType.Testing,
    apiId: apiId,
    entityID: username,
    subscriptionId2,
    versionId: versionId,
  };

  const subscription_info3 = {
    tokenType: SubscriptionType.Testing,
    apiId: apiId,
    entityID: username,
    subscriptionId3,
    versionId: versionId,
  };

  const subscription_token1 = sign(subscription_info1, secretText);
  const subscription_token2 = sign(subscription_info2, secretText);
  const subscription_token3 = sign(subscription_info3, secretText);

  console.log("console before create Api ----------->");

  const createApi = g
    .addV(vertex.api.L)
    .property(id, apiIdNeptune)
    .property(vertex.api.prop.title.N, title)
    .property(vertex.api.prop.creationDate.N, Date.now());

  console.log("create Api ----------->", createApi);

  if (description) {
    createApi.property(vertex.api.prop.description.N, description);
  }

  if (image) {
    createApi.property(vertex.api.prop.image.N, image);
  }

  const api = await createApi
    .as("new_api")
    .addE(edge.creates.L)
    .from_(__.V(userIdNeptune))
    .to("new_api")
    .next();

  console.log("api ------------------>", api.value);

  const apiVersion_status = await g
    .V(vertex.versionStatus.prop.id.V.versionStatusUnpublished)
    .fold()
    .coalesce(
      __.unfold(),
      __.addV(vertex.versionStatus.L)
        .property(id, vertex.versionStatus.prop.id.V.versionStatusUnpublished)
        .property(
          vertex.versionStatus.prop.name.N,
          vertex.versionStatus.prop.name.V.UNPUBLISHED
        )
    )
    .next();

  console.log("apiVersion_status ----------->", apiVersion_status.value);

  let apiVersion: gremlin.process.GraphTraversal;

  if (type === ApiType.Graphql) {
    apiVersion = g
      .addV(vertex.graphqlApiVersion.L)
      .property(id, versionIdNeptune)
      .property(vertex.graphqlApiVersion.prop.secretText.N, secretText)
      .property(vertex.graphqlApiVersion.prop.graphQlSchema.N, graphQlSchema)
      .property(vertex.graphqlApiVersion.prop.apiUrl.N, apiUrl)
      .property(vertex.graphqlApiVersion.prop.apiToken.N, api_token)
      .property(vertex.graphqlApiVersion.prop.versionNumber.N, 1.0)
      .property(vertex.graphqlApiVersion.prop.versionType.N, ApiType.Graphql)
      .property(vertex.graphqlApiVersion.prop.dateCreated.N, timeStamp)
      .property(
        vertex.graphqlApiVersion.prop.versionStatus.N,
        vertex.versionStatus.prop.name.V.UNPUBLISHED
      );
  } else if (type === ApiType.Openapi) {
    apiVersion = g
      .addV(vertex.openApiVersion.L)
      .property(id, versionIdNeptune)
      .property(vertex.openApiVersion.prop.secretText.N, secretText)
      .property(vertex.openApiVersion.prop.openDef.N, openApiDef)
      .property(vertex.openApiVersion.prop.apiUrl.N, apiUrl)
      .property(vertex.openApiVersion.prop.apiToken.N, api_token)
      .property(vertex.openApiVersion.prop.versionNumber.N, 1.0)
      .property(vertex.graphqlApiVersion.prop.versionType.N, ApiType.Openapi)
      .property(
        vertex.openApiVersion.prop.versionStatus.N,
        vertex.versionStatus.prop.name.V.UNPUBLISHED
      )
      .property(vertex.openApiVersion.prop.dateCreated.N, timeStamp);
  }

  console.log("condition above relese notes ");

  if (releaseNotes) {
    apiVersion!.property(
      vertex.openApiVersion.prop.releaseNotes.N,
      releaseNotes
    );
  }

  await apiVersion!
    .as("new_apiVersion")
    .addE(edge.hasVersion.L)
    .from_(__.V(apiIdNeptune))
    .to("new_apiVersion")
    .addE(edge.hasStatus.L)
    .from_("new_apiVersion")
    .to(__.V(vertex.versionStatus.prop.id.V.versionStatusUnpublished))
    .next();

  console.log("after if conditions below relese notes");

  //  const a = await apiVersion

  let vertexId;

  for (let typeName of saasType) {
    switch (typeName) {
      case vertex.apiSaasType.prop.name.V.CRM:
        vertexId = vertex.apiSaasType.prop.id.V.apiType_CRM;
        break;
      case vertex.apiSaasType.prop.name.V.ERP:
        vertexId = vertex.apiSaasType.prop.id.V.apiType_ERP;
        break;

      case vertex.apiSaasType.prop.name.V.ACCOUNTING:
        vertexId = vertex.apiSaasType.prop.id.V.apiType_ACCOUNTING;
        break;

      case vertex.apiSaasType.prop.name.V.PM:
        vertexId = vertex.apiSaasType.prop.id.V.apiType_PM;
        break;

      case vertex.apiSaasType.prop.name.V.CMS:
        vertexId = vertex.apiSaasType.prop.id.V.apiType_CMS;
        break;

      case vertex.apiSaasType.prop.name.V.COMMUNICATION:
        vertexId = vertex.apiSaasType.prop.id.V.apiType_COMMUNICATION;
        break;

      case vertex.apiSaasType.prop.name.V.ECOMMERCE:
        vertexId = vertex.apiSaasType.prop.id.V.apiType_ECOMMERCE;
        break;

      case vertex.apiSaasType.prop.name.V.HRM:
        vertexId = vertex.apiSaasType.prop.id.V.apiType_HRM;
        break;

      case vertex.apiSaasType.prop.name.V.PAYMENT_GATEWAY:
        vertexId = vertex.apiSaasType.prop.id.V.apiType_PAYMENT_GATEWAY;
        break;

      case vertex.apiSaasType.prop.name.V.BILLING:
        vertexId = vertex.apiSaasType.prop.id.V.apiType_BILLING;
        break;

      case vertex.apiSaasType.prop.name.V.FINANCE:
        vertexId = vertex.apiSaasType.prop.id.V.apiType_FINANCE;
        break;

      case vertex.apiSaasType.prop.name.V.EDUCATION:
        vertexId = vertex.apiSaasType.prop.id.V.apiType_EDUCATION;
        break;
      case vertex.apiSaasType.prop.name.V.MEDICAL:
        vertexId = vertex.apiSaasType.prop.id.V.apiType_MEDICAL;
        break;
      case vertex.apiSaasType.prop.name.V.MUSIC:
        vertexId = vertex.apiSaasType.prop.id.V.apiType_MUSIC;
        break;

      case vertex.apiSaasType.prop.name.V.NEWS:
        vertexId = vertex.apiSaasType.prop.id.V.apiType_NEWS;
        break;

      case vertex.apiSaasType.prop.name.V.SOCIAL_NETWORKING:
        vertexId = vertex.apiSaasType.prop.id.V.apiType_SOCIAL_NETWORKING;
        break;
      case vertex.apiSaasType.prop.name.V.WEATHER:
        vertexId = vertex.apiSaasType.prop.id.V.apiType_WEATHER;
        break;

      case vertex.apiSaasType.prop.name.V.LIFESTYLE:
        vertexId = vertex.apiSaasType.prop.id.V.apiType_LIFESTYLE;
        break;
      case vertex.apiSaasType.prop.name.V.PRODUCTIVITY:
        vertexId = vertex.apiSaasType.prop.id.V.apiType_PRODUCTIVITY;
        break;
      case vertex.apiSaasType.prop.name.V.SPORTS:
        vertexId = vertex.apiSaasType.prop.id.V.apiType_SPORTS;
        break;

      case vertex.apiSaasType.prop.name.V.TRAVEL:
        vertexId = vertex.apiSaasType.prop.id.V.apiType_TRAVEL;
        break;

      case vertex.apiSaasType.prop.name.V.FOOD:
        vertexId = vertex.apiSaasType.prop.id.V.apiType_FOOD;
        break;

      case vertex.apiSaasType.prop.name.V.PHOTO_VIDEO:
        vertexId = vertex.apiSaasType.prop.id.V.apiType_PHOTO_VIDEO;
        break;

      case vertex.apiSaasType.prop.name.V.UTILITIES:
        vertexId = vertex.apiSaasType.prop.id.V.apiType_UTILITIES;
        break;

      case vertex.apiSaasType.prop.name.V.DATA:
        vertexId = vertex.apiSaasType.prop.id.V.apiType_DATA;
        break;

      case vertex.apiSaasType.prop.name.V.AI:
        vertexId = vertex.apiSaasType.prop.id.V.apiType_AI;
        break;

      case vertex.apiSaasType.prop.name.V.IOT:
        vertexId = vertex.apiSaasType.prop.id.V.apiType_IOT;
        break;

      case vertex.apiSaasType.prop.name.V.BLOCKCHAIN_CRYPTO:
        vertexId = vertex.apiSaasType.prop.id.V.apiType_BLOCKCHAIN_CRYPTO;
        break;

      case vertex.apiSaasType.prop.name.V.BUSINESS:
        vertexId = vertex.apiSaasType.prop.id.V.apiType_BUSINESS;
        break;

      case vertex.apiSaasType.prop.name.V.REFERENCE:
        vertexId = vertex.apiSaasType.prop.id.V.apiType_REFERENCE;
        break;

      case vertex.apiSaasType.prop.name.V.HEALTH_FITNESS:
        vertexId = vertex.apiSaasType.prop.id.V.apiType_HEALTH_FITNESS;
        break;
    }

    console.log("after api Type added");

    const api_type = await g
      .V(vertexId)
      .fold()
      .coalesce(
        __.unfold(),
        __.addV(vertex.apiSaasType.L)
          .property(id, vertexId)
          .property(vertex.apiSaasType.prop.name.N, typeName)
      )
      .next();

    await g
      .addE(edge.hasType.L)
      .from_(__.V(apiIdNeptune))
      .to(api_type.value)
      .next();
    // createGraphQlApi.addE(edge.has_type.L).from_('new_api').to(api_type.value)
  }

  const subscription_type = await g
    .V(vertex.subscriptionType.prop.id.V.subscriptionType_testing)
    .fold()
    .coalesce(
      __.unfold(),
      __.addV(vertex.subscriptionType.L)
        .property(
          id,
          vertex.subscriptionType.prop.id.V.subscriptionType_testing
        )
        .property(
          vertex.subscriptionType.prop.name.N,
          vertex.subscriptionType.prop.name.V.TESTING
        )
    )
    .next();

  console.log(
    "*************** subscription_type ********",
    subscription_type.value
  );

  const subscription = await g
    .addV(vertex.apiSubscription.L)
    .property(id, subscriptionId1)
    //   .property(vertex.apiSubscription.prop.paymentDayEveryMonth.N,subscriptionParams.paymentDayEveryMonth)
    .property(vertex.apiSubscription.prop.creationDate.N, timeStamp)
    .property(
      vertex.apiSubscription.prop.subscriptionToken.N,
      subscription_token1
    )
    .property(
      vertex.apiSubscription.prop.subscriptionType.N,
      SubscriptionType.Testing
    )
    .as("sub")
    .addE(edge.hasSubscription.L)
    .from_(__.V(apiIdNeptune).out(edge.hasVersion.L))
    .to("sub")
    .addE(edge.hasType.L)
    .from_("sub")
    .to(subscription_type.value)
    .addE(edge.subscribes.L)
    .from_(__.V(userIdNeptune))
    .to("sub")

    .addV(vertex.apiSubscription.L)
    .property(id, subscriptionId2)
    //   .property(vertex.apiSubscription.prop.paymentDayEveryMonth.N,subscriptionParams.paymentDayEveryMonth)
    .property(vertex.apiSubscription.prop.creationDate.N, timeStamp)
    .property(
      vertex.apiSubscription.prop.subscriptionToken.N,
      subscription_token2
    )
    .property(
      vertex.apiSubscription.prop.subscriptionType.N,
      SubscriptionType.Testing
    )
    .as("sub")
    .addE(edge.hasSubscription.L)
    .from_(__.V(apiIdNeptune).out(edge.hasVersion.L))
    .to("sub")
    .addE(edge.hasType.L)
    .from_("sub")
    .to(subscription_type.value)
    .addE(edge.subscribes.L)
    .from_(__.V(userIdNeptune))
    .to("sub")

    .addV(vertex.apiSubscription.L)
    .property(id, subscriptionId3)
    .property(vertex.apiSubscription.prop.creationDate.N, timeStamp)
    .property(
      vertex.apiSubscription.prop.subscriptionToken.N,
      subscription_token3
    )
    .property(
      vertex.apiSubscription.prop.subscriptionType.N,
      SubscriptionType.Testing
    )
    .as("sub")
    .addE(edge.hasSubscription.L)
    .from_(__.V(apiIdNeptune).out(edge.hasVersion.L))
    .to("sub")
    .addE(edge.hasType.L)
    .from_("sub")
    .to(subscription_type.value)
    .addE(edge.subscribes.L)
    .from_(__.V(userIdNeptune))
    .to("sub")
    .next();

  console.log(
    " ------------------- after subscription -------------------",
    subscription
  );

  const result = await g
    .V(apiIdNeptune)
    .out(edge.hasVersion.L)
    .choose(
      __.hasLabel(vertex.graphqlApiVersion.L),
      projectApiVersion(apiIdNeptune, type),
      projectApiVersion(apiIdNeptune, type)
    )
    .next();

  console.log("GraphQlApi output=> ", result.value);

  cleanObject(result.value);

  console.log("clean object output=> ", result.value);

  result.value["id"] = convertFromNeptuneId.apiVersion(result.value["id"]);
  result.value["api"]["id"] = convertFromNeptuneId.api(
    result.value["api"]["id"]
  );
  result.value["api"]["developer"]["id"] = convertFromNeptuneId.user(
    result.value["api"]["developer"]["id"]
  );
  result.value["api"]["developer"]["authData"]["publicAddress"] =
    convertFromNeptuneId.publicAddress(
      result.value["api"]["developer"]["authData"]["publicAddress"]
    );

  return { data: result.value };
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
