import * as gremlin from "gremlin";
import {
  UserAuth,
  CompleteUserProfileInput,
  User,
} from "../../utils/graphqlSchemaTypes";
import { ErrorStructure } from "../../utils/errorHandlingTemplate";
import {
  SignupInput,
  RefreshAccessTokenInput,
} from "../../utils/graphqlSchemaTypes";

export default interface IGraphApiMutation {
  signup(data: SignupInput): Promise<ErrorStructure | { data: UserAuth }>;
  refreshAccessToken(
    data: RefreshAccessTokenInput
  ): Promise<ErrorStructure | { data: string }>;
  completeUserProfile(
    data: CompleteUserProfileInput,
    publicAddress: string
  ): Promise<ErrorStructure | { data: User }>;
}
