import * as gremlin from "gremlin";
import { ErrorStructure } from "../../utils/errorHandlingTemplate";
import { ApiVersion, CreateApiInput } from "../../utils/graphqlSchemaTypes";

export default interface IGraphApiMutation {
  createApi(
    data: CreateApiInput,
    username: string
  ): Promise<ErrorStructure | { data: ApiVersion }>;
}
