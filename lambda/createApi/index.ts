var axios = require("axios");

import * as AWS from "aws-sdk";
import { AppSyncResolverEvent } from "aws-lambda";
import * as _GraphApiQueryFactory from "../../lambdaLayer/apis/Api/GraphApiQueryFactory";
var apiFactory =
  require("/opt/apis/Api/GraphApiQueryFactory") as typeof _GraphApiQueryFactory;

interface AppsyncLambdaAuthContext {
  resolverContext: resolverContext;
}
interface resolverContext {
  publicAddress: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

exports.handler = async (event: AppSyncResolverEvent<any>) => {
  console.log(JSON.stringify(event, null, 2));
  const identity = event.identity
    ? (event.identity as unknown as AppsyncLambdaAuthContext)
    : undefined;

  const output = await apiFactory.default
    .mutations(process.env.NEPTUNE_ENDPOINT!)
    .createApi(event.arguments.input, identity?.resolverContext.username!);
  console.log("output", output.data);
  return output;
};
