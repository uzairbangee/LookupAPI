import { initializeGremlinClient } from "../utils/gremlin_init";
import { driver, process as gprocess } from "gremlin";
import IGraphApiMutation from "../../abstracts/iGraphApiMutation";
import { SignupInput } from "../../../utils/graphqlSchemaTypes";
import { ErrorStructure } from "../../../utils/errorHandlingTemplate";
import signup from "./signup/index";
import refreshAccessToken from "./refreshAccessToken/index";
import {
  UserAuth,
  CompleteUserProfileInput,
  User,
} from "../../../utils/graphqlSchemaTypes";
import { RefreshAccessTokenInput } from "../../../../../graphql/types";
import { completeUserProfile } from "./completeUserProfile";

export default class GremlinApiMutation implements IGraphApiMutation {
  private conn: driver.DriverRemoteConnection;
  private g: gprocess.GraphTraversalSource;

  constructor(endpoint: string) {
    const { g, conn } = initializeGremlinClient(endpoint);

    this.conn = conn;
    this.g = g;
  }

  async signup(
    data: SignupInput
  ): Promise<ErrorStructure | { data: UserAuth }> {
    console.log("hiiii");
    return await signup(this.g, data);
  }

  async refreshAccessToken(
    data: RefreshAccessTokenInput
  ): Promise<ErrorStructure | { data: string }> {
    return await refreshAccessToken(this.g, data);
  }

  async completeUserProfile(
    data: CompleteUserProfileInput,
    publicAddress: string
  ): Promise<ErrorStructure | { data: User }> {
    return await completeUserProfile(this.g, data, publicAddress);
  }
}
