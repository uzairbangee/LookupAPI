import IGraphApiQuery from "../../abstracts/IGraphApiQuery";
import { initializeGremlinClient } from "../utils/gremlin_init";
import { driver, process as gprocess, structure } from "gremlin";
import {
  GetUserAuthDataInput,
  LoginInput,
  UserAuth,
  User,
  DecodedAccessToken,
  AuthorizeUserInput,
} from "../../../utils/graphqlSchemaTypes";
import { ErrorStructure } from "../../../utils/errorHandlingTemplate";
import getUserAuthData from "./getUserAuthData";
import login from "./login";
import authorizeUser from "./authorizeUser";

export default class GremlinApiQuery implements IGraphApiQuery {
  private conn: driver.DriverRemoteConnection;
  private g: gprocess.GraphTraversalSource;

  constructor(endpoint: string) {
    const { g, conn } = initializeGremlinClient(endpoint);

    this.conn = conn;
    this.g = g;
  }

  async getUserAuthData(
    data: GetUserAuthDataInput
  ): Promise<ErrorStructure | { data: UserAuth }> {
    return await getUserAuthData(this.g, data);
  }
  async login(data: LoginInput): Promise<ErrorStructure | { data: string }> {
    return await login(this.g, data);
  }
  async authorizeUser(
    data: AuthorizeUserInput
  ): Promise<ErrorStructure | { data: DecodedAccessToken }> {
    return await authorizeUser(this.g, data);
  }
}
