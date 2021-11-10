import { process as gprocess } from "gremlin";
import {
  CompleteUserProfileInput,
  User,
} from "../../../../utils/graphqlSchemaTypes";
import { v4 as uuidv4 } from "uuid";
import { cleanObject } from "../../../../utils/utils";

const AWS = require("aws-sdk");

import { vertex, edge } from "../../../../utils/graphdb-elements-name.json";

import { inspectId, inspectString } from "../../../../utils/regexVerifier";
import {
  ErrorStructure,
  errorCodes,
  errorTypes,
  returnError,
} from "../../../../utils/errorHandlingTemplate";
import { errorStrings } from "../../../errorStrings";

import {
  convertFromNeptuneId,
  convertToNeptuneId,
} from "../../../../utils/idConverter";
import { EventBridge } from "aws-sdk";

import * as idConverter from "../../../../utils/idConverter";
import * as utilsFns from "../../../../utils/utils";

const __ = gprocess.statics;
const id = gprocess.t.id;
const within = gprocess.P.within;
const desc = gprocess.order.desc;

type outputType = ErrorStructure | { data: User };

export async function completeUserProfile(
  g: gprocess.GraphTraversalSource,
  data: CompleteUserProfileInput,
  publicAddress: string
): Promise<outputType> {
  const timeStamp = Date.now();
  const secretText = uuidv4();

  let { username, firstName, lastName } = data;

  if (!inspectId(username)) {
    return returnError(
      errorStrings.invalidIdInput("userId"),
      { errorCode: errorCodes.badRequest },
      errorTypes.badRequest
    );
  }

  if (!inspectString(firstName)) {
    return returnError(
      errorStrings.invalidStringInput("firstName"),
      { errorCode: errorCodes.badRequest },
      errorTypes.badRequest
    );
  }

  if (!inspectString(lastName)) {
    return returnError(
      errorStrings.invalidStringInput("lastName"),
      { errorCode: errorCodes.badRequest },
      errorTypes.badRequest
    );
  }

  const publicAddressNeptune = convertToNeptuneId.publicAddress(publicAddress);
  const userIdNeptune = convertToNeptuneId.user(username);

  const checkUserId = await g.V(userIdNeptune).hasNext();

  console.log("line 77");
  if (checkUserId) {
    return returnError(
      errorStrings.idNotAvailable(username),
      { errorCode: errorCodes.refused },
      errorTypes.refused
    );
  }

  console.log("line 86");

  const errorHandling = await g
    .V(publicAddressNeptune)
    .in_(edge.hasAuthentication.L)
    .hasNext();

  if (errorHandling) {
    return returnError(
      errorStrings.profileAlreadyCompleted,
      { errorCode: errorCodes.refused },
      errorTypes.refused
    );
  }

  console.log("line 101");

  const credentials = await g
    .V(publicAddressNeptune)
    .project("secretText", "nonce")
    .by(vertex.userAuthentication.prop.secretText.N)
    .by(vertex.userAuthentication.prop.nonce.N)
    .next();

  console.log("line 110");

  let create_user = await g
    .addV(vertex.user.L)
    .property(id, userIdNeptune)
    .property(vertex.user.prop.secretText.N, secretText)
    .property(vertex.user.prop.publicAddress.N, publicAddressNeptune)
    .property(vertex.user.prop.nonce.N, credentials.value.nonce)
    .property(vertex.user.prop.authSecretText.N, credentials.value.secretText)
    .property(vertex.user.prop.firstName.N, firstName)
    .property(vertex.user.prop.lastName.N, lastName)
    .property(vertex.user.prop.dateCreated.N, timeStamp)
    .as("new_user")
    .addE(edge.hasAuthentication.L)
    .from_("new_user")
    .to(__.V(publicAddressNeptune))
    .select("new_user")
    .project("id", "firstName", "lastName", "creationDate", "authData")
    .by(id)
    .by(
      __.values(vertex.user.prop.firstName.N)
        .fold()
        .coalesce(__.unfold(), __.constant(""))
    )
    .by(
      __.values(vertex.user.prop.lastName.N)
        .fold()
        .coalesce(__.unfold(), __.constant(""))
    )
    .by(__.values(vertex.user.prop.dateCreated.N))
    .by(
      __.project("publicAddress", "creationDate")
        .by(__.out(edge.hasAuthentication.L).id())
        .by(
          __.out(edge.hasAuthentication.L).values(
            vertex.userAuthentication.prop.dateCreated.N
          )
        )
    )

    .next();

  console.log("line 153");

  create_user.value.id = convertFromNeptuneId.user(create_user.value.id);
  create_user.value.authData.publicAddress = convertFromNeptuneId.publicAddress(
    create_user.value.authData.publicAddress
  );
  cleanObject(create_user.value);

  console.log(create_user.value);

  return { data: create_user.value };
}
