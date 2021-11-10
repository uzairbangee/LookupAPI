import * as gremlin from "gremlin";
import { ErrorStructure } from "../../utils/errorHandlingTemplate";
import {
  ApisListOutput,
  QueryGetMyApisArgs,
  QueryGetApiVersionsArgs,
  ApiVersionsListOutput,
  QueryGetSubscriptionDetailsArgs,
  QueryGetApiDetailsArgs,
  Api,
  ApiSubscription,
  QueryGetApiVersionDetailsArgs,
  GraphqlApiVersion,
  OpenApiVersion,
} from "../../utils/graphqlSchemaTypes";

export default interface IGraphApiQuery {
  getApi(
    g: gremlin.process.GraphTraversalSource<gremlin.process.GraphTraversal>,
    data: QueryGetMyApisArgs,
    username: string
  ): Promise<ErrorStructure | { data: ApisListOutput }>;

  getApiVersions(
    data: QueryGetApiVersionsArgs,
    username: string
  ): Promise<ErrorStructure | { data: ApiVersionsListOutput }>;

  getSubscriptionDetails(
    input: QueryGetSubscriptionDetailsArgs,
    username: string
  ): Promise<ErrorStructure | { data: ApiSubscription }>;

  getApiDetails(
    data: QueryGetApiDetailsArgs,
    username: string
  ): Promise<ErrorStructure | { data: Api }>;

  getApiVersionDetails(
    data: QueryGetApiVersionDetailsArgs,
    username: string
  ): Promise<ErrorStructure | { data: GraphqlApiVersion | OpenApiVersion }>;
}
