import { initializeGremlinClient } from "../utils/gremlin_init";
import IGraphApiQuery from "../../abstracts/IGraphApiQuery";
import { driver, process as gprocess, structure } from "gremlin";
import { getApiVersionsList } from "./getApiVersions";
import { getApiVersionDetails as _getApiVersionDetails } from "./getApiVersionDetails";
import {
  QueryGetMyApisArgs,
  ApisListOutput,
  QueryGetApiVersionsArgs,
  ApiVersionsListOutput,
  Api,
  ApiSubscription,
  QueryGetApiDetailsArgs,
  QueryGetApiVersionDetailsArgs,
  GraphqlApiVersion,
  OpenApiVersion,
} from "../../../utils/graphqlSchemaTypes";
import { getSubscriptionDetails } from "./getSubscriptionDetails";
import { ErrorStructure } from "../../../utils/errorHandlingTemplate";
import get_my_Apis from "./getMyApis/index";
import { QueryGetSubscriptionDetailsArgs } from "../../../utils/graphqlSchemaTypes";
import getApiDetails from "./getApiDetails";

export default class GremlinApiQuery implements IGraphApiQuery {
  private conn: driver.DriverRemoteConnection;
  private g: gprocess.GraphTraversalSource;

  constructor(endpoint: string) {
    const { g, conn } = initializeGremlinClient(endpoint);

    this.conn = conn;
    this.g = g;
  }

  async getApiVersions(
    data: QueryGetApiVersionsArgs,
    username: string | null
  ): Promise<ErrorStructure | { data: ApiVersionsListOutput }> {
    return await getApiVersionsList(this.g, data, username);
  }

  async getApiVersionDetails(
    data: QueryGetApiVersionDetailsArgs,
    username: string | null
  ): Promise<ErrorStructure | { data: GraphqlApiVersion | OpenApiVersion }> {
    return await _getApiVersionDetails(this.g, data, username);
  }

  async getApi(
    g: gprocess.GraphTraversalSource,
    data: QueryGetMyApisArgs,
    username: string
  ): Promise<ErrorStructure | { data: ApisListOutput }> {
    return await get_my_Apis(g, data, username);
  }

  // async getSubscriptionDetails(input: QueryGetSubscriptionDetailsArgs, username: string) {
  //   // await getSubscriptionDetails(this.g, input, username)
  // }

  async getApiDetails(
    input: QueryGetApiDetailsArgs,
    username: string
  ): Promise<ErrorStructure | { data: Api }> {
    return await getApiDetails(this.g, input, username);
  }

  async getSubscriptionDetails(
    input: QueryGetSubscriptionDetailsArgs,
    username: string
  ): Promise<ErrorStructure | { data: ApiSubscription }> {
    return await getSubscriptionDetails(this.g, input, username);
  }
}
