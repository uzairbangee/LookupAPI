import * as async from "async";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { decode, verify } from "jsonwebtoken";
import * as gremlin from "gremlin";
import { driver, process as gprocess, structure } from "gremlin";
import * as schema from "../../../lambdaLayer/apis/utils/graphdb-elements-name.json";
const hackolade_graphdb =
  require("/opt/apis/utils/graphdb-elements-name.json") as typeof schema;

import * as idConverter from "../../../lambdaLayer/apis/utils/idConverter";
const convertId = require("/opt/apis/utils/idConverter") as typeof idConverter;

const { edge, vertex } = hackolade_graphdb;

const __ = gremlin.process.statics;
const id = gremlin.process.t.id;
const single = gremlin.process.cardinality.single;

const Graph = structure.Graph;

declare var process: {
  env: {
    NEPTUNE_ENDPOINT: string;
  };
};

let conn: driver.DriverRemoteConnection;
let g: gprocess.GraphTraversalSource;

export async function handler(event: any, context: Context) {
  console.log("request:", JSON.stringify(event, undefined, 2));

  async function doQuery() {
    console.log("Query");
    console.log("conn in Do Query ", conn);
    console.log("g initialized ", g);

    try {
      console.log(`event >`, JSON.stringify(event, null, 2));
      const {
        authorizationToken,
        requestContext: { apiId, accountId },
      } = event;

      const accessToken = authorizationToken.split(" ")[1] || "";
      console.log("getAuthUser auth header : ", accessToken);

      const decodeJwt: any = decode(accessToken);

      console.log("decodedjwt", decodeJwt);

      if (!decodeJwt) {
        throw new Error("invalid token");
      }

      let verifiedJwt: any;
      if (decodeJwt?.payload?.client && decodeJwt?.payload.client === "cli") {
        const publicAddressFromToken = decodeJwt.payload.publicAddress;

        const publicAddressNeptune = convertId.convertToNeptuneId.publicAddress(
          publicAddressFromToken
        );

        const getSecretText = await g
          .V(publicAddressNeptune)
          .values(vertex.userAuthentication.prop.secretText.N)
          .next();

        console.log("secret", getSecretText.value);

        verifiedJwt = verify(accessToken, getSecretText.value);
        console.log("verifiedJwt = ", verifiedJwt);
      } else {
        const publicAddressFromToken = decodeJwt.payload.publicAddress;

        const publicAddressNeptune = convertId.convertToNeptuneId.publicAddress(
          publicAddressFromToken
        );

        const getSecretText = await g
          .V(publicAddressNeptune)
          .values(vertex.userAuthentication.prop.secretText.N)
          .next();

        console.log("secret", getSecretText.value);

        verifiedJwt = verify(accessToken, getSecretText.value);
        console.log("verifiedJwt = ", verifiedJwt);
      }

      const response = {
        isAuthorized: true,
        resolverContext: verifiedJwt.payload,
        deniedFields: [],
        ttlOverride: 10,
      };
      console.log(`response >`, JSON.stringify(response, null, 2));
      return response;
    } catch (e) {
      console.log(e);

      const response = {
        isAuthorized: false,
        resolverContext: null,
        deniedFields: [],
        ttlOverride: 10,
      };
      return response;
    }
  }

  const getConnectionDetails = () => {
    const database_url =
      "wss://" + process.env.NEPTUNE_ENDPOINT + ":8182/gremlin";
    return { url: database_url, headers: {} };
  };

  const createRemoteConnection = () => {
    const { url, headers } = getConnectionDetails();

    return new driver.DriverRemoteConnection(url, {
      mimeType: "application/vnd.gremlin-v2.0+json",
      pingEnabled: false,
      headers: headers,
    });
  };

  const createGraphTraversalSource = (conn: driver.DriverRemoteConnection) => {
    return gprocess.traversal().withRemote(conn);
  };

  if (conn == null) {
    conn = createRemoteConnection();
    g = createGraphTraversalSource(conn);
  }

  return async.retry(
    {
      times: 5,
      interval: 1000,
      errorFilter: function (err) {
        // Add filters here to determine whether error can be retried
        console.warn("Determining whether retriable error: " + err.message);
        console.log("inside retry block");

        // Check for connection issues
        if (err.message.startsWith("WebSocket is not open")) {
          console.warn("Reopening connection");
          conn = createRemoteConnection();
          const graph = new Graph();
          g = graph.traversal().withRemote(conn);

          return true;
        }

        // Check for ConcurrentModificationException
        if (err.message.includes("ConcurrentModificationException")) {
          console.warn(
            "Retrying query because of ConcurrentModificationException"
          );
          return true;
        }

        // Check for ReadOnlyViolationException
        if (err.message.includes("ReadOnlyViolationException")) {
          console.warn("Retrying query because of ReadOnlyViolationException");
          return true;
        }

        return false;
      },
    },
    doQuery
  );
}
