import { process as gprocess } from "gremlin";
import { ErrorStructure } from "../../../../utils/errorHandlingTemplate";
import { convertToNeptuneId } from "../../../../utils/idConverter";
import { v4 as uuidv4 } from "uuid";
import { SignupInput, UserAuth } from "../../../../utils/graphqlSchemaTypes";
import { checkIfUserAlreadyExists } from "./handleErrors";
import { addUser } from "./addUser";

export default async function signup(
  g: gprocess.GraphTraversalSource,
  data: SignupInput
): Promise<ErrorStructure | { data: UserAuth }> {
  let { publicAddress } = data;

  console.log("hi user");

  const publicAddressNeptune = convertToNeptuneId.publicAddress(publicAddress);

  const checkPublicAddress = await checkIfUserAlreadyExists(
    g,
    publicAddressNeptune
  );

  if (checkPublicAddress !== true) {
    return checkPublicAddress;
  }

  const user = await addUser(g, publicAddressNeptune);

  return { data: user };
}
