import * as gremlin from "gremlin";
import {
  GetUserAuthDataInput,
  LoginInput,
  User,
  AuthorizeUserInput,
  UserAuth,
  DecodedAccessToken,
} from "../../utils/graphqlSchemaTypes";
import { ErrorStructure } from "../../utils/errorHandlingTemplate";

export default interface IGraphApiQuery {
  getUserAuthData(
    data: GetUserAuthDataInput
  ): Promise<ErrorStructure | { data: UserAuth }>;
  login(data: LoginInput): Promise<ErrorStructure | { data: string }>;
  authorizeUser(
    data: AuthorizeUserInput
  ): Promise<ErrorStructure | { data: DecodedAccessToken }>;
}
