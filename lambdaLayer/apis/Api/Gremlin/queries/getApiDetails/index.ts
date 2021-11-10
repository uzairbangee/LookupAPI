import * as gremlin from "gremlin";
import { process as gprocess } from "gremlin";
import {
  QueryGetApiDetailsArgs,
  Api,
  ApiType,
  ApiStatus,
} from "../../../utils/graphqlSchemaTypes";
import { ErrorStructure } from "../../../../utils/errorHandlingTemplate";
import validateInputs from "./validateInputs";
import {
  convertFromNeptuneId,
  convertToNeptuneId,
} from "../../../../utils/idConverter";
import { checkApiId } from "./handleErrors";
import { cleanObject } from "../../../../utils/utils";
import { ApiVersionStatus } from "../../../../utils/graphqlSchemaTypes";
import * as hackolade_graphdb from "../../../../utils/graphdb-elements-name.json";
const { edge, vertex } = hackolade_graphdb;
const lte = gremlin.process.P.lte;

const __ = gprocess.statics;
const id = gprocess.t.id;
const within = gprocess.P.within;
const desc = gprocess.order.desc;

export default async function getApiDetails(
  g: gprocess.GraphTraversalSource,
  data: QueryGetApiDetailsArgs,
  username: string
): Promise<ErrorStructure | { data: Api }> {
  console.log("DATA --------------->", data);

  const validate_inputs = validateInputs(data);

  if (validate_inputs !== true) {
    return validate_inputs;
  }

  let { apiId } = data;

  const apiIdNeptune = convertToNeptuneId.api(apiId);

  const check_api_id = await checkApiId(g, apiIdNeptune);

  if (check_api_id !== true) {
    return check_api_id;
  }

  const result = await g
    .V(apiIdNeptune)
    .project(
      "id",
      "title",
      "description",
      "image",
      "creationDate",
      "status",
      "saasType",
      "type",
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
      __.choose(
        __.out(edge.hasVersion.L).out(edge.hasStatus.L).count().is(lte(1)),
        __.out(edge.hasVersion.L)
          .out(edge.hasStatus.L)
          .choose(
            __.hasId(vertex.versionStatus.prop.id.V.versionStatusUnpublished),
            __.constant(ApiStatus.Underdevelopment),
            __.constant(ApiStatus.Public)
          ),
        __.constant(ApiVersionStatus.Published)
      )
    )
    .by(__.out(edge.hasType.L).values(vertex.apiSaasType.prop.name.N).fold())
    .by(
      __.out(edge.hasVersion.L).choose(
        __.hasLabel(vertex.graphqlApiVersion.L),
        __.constant(ApiType.Graphql),
        __.constant(ApiType.Openapi)
      )
    )
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
    .next();

  console.log("result.value --------------->", result.value);

  result.value["id"] = convertFromNeptuneId.api(result.value["id"]);
  result.value["developer"]["id"] = convertFromNeptuneId.user(
    result.value["developer"]["id"]
  );
  result.value["developer"]["authData"]["publicAddress"] =
    convertFromNeptuneId.publicAddress(
      result.value["developer"]["authData"]["publicAddress"]
    );

  cleanObject(result.value["developer"]);

  console.log("result.value --------------->", result.value);

  return { data: result.value };
}
