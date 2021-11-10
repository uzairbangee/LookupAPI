import { initializeGremlinClient } from "../utils/gremlin_init";
import { driver, process as gprocess } from "gremlin";
import IGraphApiMutation from "../../abstracts/iGraphApiMutation";
import {
  CreateApiInput,
  ApiType,
  ApiVersion,
} from "../../../utils/graphqlSchemaTypes";
import { ErrorStructure } from "../../../utils/errorHandlingTemplate";
import create_api from "./createApi";

export default class GremlinApiMutation implements IGraphApiMutation {
  private conn: driver.DriverRemoteConnection;
  private g: gprocess.GraphTraversalSource;

  constructor(endpoint: string) {
    const { g, conn } = initializeGremlinClient(endpoint);

    this.conn = conn;
    this.g = g;
  }

  async createApi(
    data: CreateApiInput,
    username: string
  ): Promise<ErrorStructure | { data: ApiVersion }> {
    return await create_api(this.g, data, username);
  }
}
