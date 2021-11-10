import { process as gprocess } from "gremlin";
import validateInputs from "./validateInputs";

import {
  checkApiVersionId,
  isOwner,
  isUnpublishedVersion,
} from "./handleErrors";
import {
  ApiVersionStatus,
  GraphqlApiVersion,
  OpenApiVersion,
  QueryGetApiVersionDetailsArgs,
  SubscriptionType,
} from "../../../../utils/graphqlSchemaTypes";
import { ErrorStructure } from "../../../../utils/errorHandlingTemplate";
import {
  convertFromNeptuneId,
  convertToNeptuneId,
} from "../../../../utils/idConverter";
import { cleanObject } from "../../../../utils/utils";
import { edge, vertex } from "../../../../utils/graphdb-elements-name.json";

const __ = gprocess.statics;
const id = gprocess.t.id;
const within = gprocess.P.within;
const desc = gprocess.order.desc;

export async function getApiVersionDetails(
  g: gprocess.GraphTraversalSource,
  data: QueryGetApiVersionDetailsArgs,
  username: string | null
): Promise<ErrorStructure | { data: GraphqlApiVersion | OpenApiVersion }> {
  const validate_inputs = validateInputs(data);
  if (validate_inputs !== true) {
    return validate_inputs;
  }

  console.log("Data => ", data);

  const { versionId } = data;

  const apiVersionId = convertToNeptuneId.apiVersion(versionId);

  const check_api_versionId = await checkApiVersionId(g, apiVersionId);

  if (check_api_versionId !== true) {
    return check_api_versionId;
  }

  const neptuneUserNameId = convertToNeptuneId.user(username ? username : "");
  const check_owner = await isOwner(g, apiVersionId, neptuneUserNameId);

  const check_unpublished_version = await isUnpublishedVersion(
    g,
    apiVersionId,
    check_owner
  );

  if (check_unpublished_version !== true) {
    return check_unpublished_version;
  }

  let result: any;
  if (check_owner) {
    const data1 = await g
      .V(apiVersionId)
      .choose(__.hasLabel(vertex.graphqlApiVersion.L), __.valueMap())
      .next();
    console.log("Data1 valueMap => ", data1.value);

    result = await g
      .V(apiVersionId)
      .choose(
        __.hasLabel(vertex.graphqlApiVersion.L),
        __.project(
          "__typename",
          "id",
          "status",
          "dateCreated",
          "datePublished",
          "versionNumber",
          "releaseNotes",
          "subscriptions",
          "apiToken",
          "graphQlSchema",
          "apiUrl"
        )
          .by(__.constant("GraphqlApiVersion"))
          .by(id)
          // .by(__.constant(null))
          .by(
            __.choose(
              __.out(edge.hasStatus.L).hasId(
                vertex.versionStatus.prop.id.V.versionStatusUnpublished
              ),
              __.constant(ApiVersionStatus.Unpublished),
              __.constant(ApiVersionStatus.Published)
            )
          )
          .by(
            __.values(vertex.graphqlApiVersion.prop.dateCreated.N)
              .fold()
              .coalesce(__.unfold(), __.constant(""))
          )
          .by(
            __.values(vertex.graphqlApiVersion.prop.datePublished.N)
              .fold()
              .coalesce(__.unfold(), __.constant(""))
          )
          .by(
            __.values(vertex.graphqlApiVersion.prop.versionNumber.N)
              .fold()
              .coalesce(__.unfold(), __.constant(""))
          )
          .by(
            __.values(vertex.graphqlApiVersion.prop.releaseNotes.N)
              .fold()
              .coalesce(__.unfold(), __.constant(""))
          )
          .by(
            __.out(edge.hasSubscription.L)
              .project(
                "id",
                "creationDate",
                // "version",
                "subscriptionToken",
                "type"
              )
              .by(id)
              .by(
                __.values(vertex.apiSubscription.prop.creationDate.N)
                  .fold()
                  .coalesce(__.unfold(), __.constant(""))
              )
              // .by(__.constant(null))
              .by(__.values(vertex.apiSubscription.prop.subscriptionToken.N))
              .by(
                __.choose(
                  __.out(edge.hasType.L).hasId(
                    vertex.subscriptionType.prop.id.V.subscriptionType_normal
                  ),
                  __.constant(SubscriptionType.Normal),
                  __.constant(SubscriptionType.Testing)
                )
              )
              .fold()
          )
          .by(
            __.values(vertex.graphqlApiVersion.prop.apiToken.N)
              .fold()
              .coalesce(__.unfold(), __.constant(""))
          )
          .by(
            __.values(vertex.graphqlApiVersion.prop.graphQlSchema.N)
              .fold()
              .coalesce(__.unfold(), __.constant(""))
          )
          .by(
            __.values(vertex.graphqlApiVersion.prop.apiUrl.N)
              .fold()
              .coalesce(__.unfold(), __.constant(""))
          ),
        __.project(
          "__typename",
          "id",
          // "api",
          "status",
          "dateCreated",
          "datePublished",
          "versionNumber",
          "releaseNotes",
          "subscriptions",
          "apiToken",
          "openApiDef",
          "rootUrl"
        )
          .by(__.constant("OpenApiVersion"))
          .by(id)
          // .by(__.constant(null))
          .by(
            __.choose(
              __.out(edge.hasStatus.L).hasId(
                vertex.versionStatus.prop.id.V.versionStatusUnpublished
              ),
              __.constant(ApiVersionStatus.Unpublished),
              __.constant(ApiVersionStatus.Published)
            )
          )
          .by(
            __.values(vertex.openApiVersion.prop.dateCreated.N)
              .fold()
              .coalesce(__.unfold(), __.constant(""))
          )
          .by(
            __.values(vertex.openApiVersion.prop.datePublished.N)
              .fold()
              .coalesce(__.unfold(), __.constant(""))
          )
          .by(
            __.values(vertex.openApiVersion.prop.versionNumber.N)
              .fold()
              .coalesce(__.unfold(), __.constant(""))
          )
          .by(
            __.values(vertex.openApiVersion.prop.releaseNotes.N)
              .fold()
              .coalesce(__.unfold(), __.constant(""))
          )
          .by(
            __.out(edge.hasSubscription.L)
              .project(
                "id",
                "creationDate",
                // "version",
                "subscriptionToken",
                "type"
              )
              .by(id)
              .by(
                __.values(vertex.apiSubscription.prop.creationDate.N)
                  .fold()
                  .coalesce(__.unfold(), __.constant(""))
              )
              // .by(__.constant(null))
              .by(__.values(vertex.apiSubscription.prop.subscriptionToken.N))
              .by(
                __.choose(
                  __.out(edge.hasType.L).hasId(
                    vertex.subscriptionType.prop.id.V.subscriptionType_normal
                  ),
                  __.constant(SubscriptionType.Normal),
                  __.constant(SubscriptionType.Testing)
                )
              )
              .fold()
          )
          .by(
            __.values(vertex.openApiVersion.prop.apiToken.N)
              .fold()
              .coalesce(__.unfold(), __.constant(""))
          )
          .by(
            __.values(vertex.openApiVersion.prop.openDef.N)
              .fold()
              .coalesce(__.unfold(), __.constant(""))
          )
          .by(
            __.values(vertex.openApiVersion.prop.apiUrl.N)
              .fold()
              .coalesce(__.unfold(), __.constant(""))
          )
      )
      .next();
  } else {
    result = await g
      .V(apiVersionId)
      .choose(
        __.hasLabel(vertex.graphqlApiVersion.L),
        __.project(
          "__typename",
          "id",
          // "api",
          "status",
          "dateCreated",
          "datePublished",
          "versionNumber",
          "releaseNotes",
          "subscriptions",
          "apiToken",
          "graphQlSchema",
          "apiUrl"
        )
          .by(__.constant("GraphqlApiVersion"))
          .by(id)
          // .by(__.constant(null))
          .by(
            __.choose(
              __.out(edge.hasStatus.L).hasId(
                vertex.versionStatus.prop.id.V.versionStatusUnpublished
              ),
              __.constant(ApiVersionStatus.Unpublished),
              __.constant(ApiVersionStatus.Published)
            )
          )
          .by(
            __.values(vertex.graphqlApiVersion.prop.dateCreated.N)
              .fold()
              .coalesce(__.unfold(), __.constant(""))
          )
          .by(
            __.values(vertex.graphqlApiVersion.prop.datePublished.N)
              .fold()
              .coalesce(__.unfold(), __.constant(""))
          )
          .by(
            __.values(vertex.graphqlApiVersion.prop.versionNumber.N)
              .fold()
              .coalesce(__.unfold(), __.constant(""))
          )
          .by(
            __.values(vertex.graphqlApiVersion.prop.releaseNotes.N)
              .fold()
              .coalesce(__.unfold(), __.constant(""))
          )
          .by(
            __.out(edge.hasSubscription.L)
              .project(
                "id",
                "creationDate",
                // "version",
                "subscriptionToken",
                "type"
              )
              .by(id)
              .by(
                __.values(vertex.apiSubscription.prop.creationDate.N)
                  .fold()
                  .coalesce(__.unfold(), __.constant(""))
              )
              // .by(__.constant(null))
              .by(__.values(vertex.apiSubscription.prop.subscriptionToken.N))
              .by(
                __.choose(
                  __.out(edge.hasType.L).hasId(
                    vertex.subscriptionType.prop.id.V.subscriptionType_normal
                  ),
                  __.constant(SubscriptionType.Normal),
                  __.constant(SubscriptionType.Testing)
                )
              )
              .fold()
          )
          .by(__.constant(""))
          .by(
            __.values(vertex.graphqlApiVersion.prop.graphQlSchema.N)
              .fold()
              .coalesce(__.unfold(), __.constant(""))
          )
          .by(
            __.values(vertex.graphqlApiVersion.prop.apiUrl.N)
              .fold()
              .coalesce(__.unfold(), __.constant(""))
          ),

        __.project(
          "__typename",
          "id",
          // "api",
          "status",
          "dateCreated",
          "datePublished",
          "versionNumber",
          "releaseNotes",
          "subscriptions",
          "apiToken",
          "openApiDef",
          "rootUrl"
        )
          .by(__.constant("OpenApiVersion"))
          .by(id)
          // .by(__.constant(null))
          .by(
            __.choose(
              __.out(edge.hasStatus.L).hasId(
                vertex.versionStatus.prop.id.V.versionStatusUnpublished
              ),
              __.constant(ApiVersionStatus.Unpublished),
              __.constant(ApiVersionStatus.Published)
            )
          )
          .by(
            __.values(vertex.openApiVersion.prop.dateCreated.N)
              .fold()
              .coalesce(__.unfold(), __.constant(""))
          )
          .by(
            __.values(vertex.openApiVersion.prop.datePublished.N)
              .fold()
              .coalesce(__.unfold(), __.constant(""))
          )
          .by(
            __.values(vertex.openApiVersion.prop.versionNumber.N)
              .fold()
              .coalesce(__.unfold(), __.constant(""))
          )
          .by(
            __.values(vertex.openApiVersion.prop.releaseNotes.N)
              .fold()
              .coalesce(__.unfold(), __.constant(""))
          )
          .by(
            __.out(edge.hasSubscription.L)
              .project(
                "id",
                "creationDate",
                // "version",
                "subscriptionToken",
                "type"
              )
              .by(id)
              .by(
                __.values(vertex.apiSubscription.prop.creationDate.N)
                  .fold()
                  .coalesce(__.unfold(), __.constant(""))
              )
              // .by(__.constant(null))
              .by(__.values(vertex.apiSubscription.prop.subscriptionToken.N))
              .by(
                __.choose(
                  __.out(edge.hasType.L).hasId(
                    vertex.subscriptionType.prop.id.V.subscriptionType_normal
                  ),
                  __.constant(SubscriptionType.Normal),
                  __.constant(SubscriptionType.Testing)
                )
              )
              .fold()
          )
          .by(__.constant(""))
          .by(
            __.values(vertex.openApiVersion.prop.openDef.N)
              .fold()
              .coalesce(__.unfold(), __.constant(""))
          )
          .by(
            __.values(vertex.openApiVersion.prop.apiUrl.N)
              .fold()
              .coalesce(__.unfold(), __.constant(""))
          )
      )
      .next();
  }

  result.value.id = convertFromNeptuneId.apiVersion(result.value.id);

  cleanObject(result.value);

  console.log(result.value);

  return { data: result.value };
}
