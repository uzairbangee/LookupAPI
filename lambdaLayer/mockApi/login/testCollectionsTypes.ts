import {
  GraphqlApiVersion,
  OpenApiVersion,
  MutationCreateApiArgs,
  UserAuth,
  MutationSignupArgs,
  ApisListOutput,
  QueryGetMyApisArgs,
  Api,
  QueryGetApiDetailsArgs,
  ApiVersionsListOutput,
  QueryGetApiVersionsArgs,
  QueryGetApiVersionDetailsArgs,
  ApiSubscription,
  QueryGetSubscriptionDetailsArgs,
  QueryGetUserAuthDataArgs,
  QueryLoginArgs,
} from "../types";

export type TestCollection = {
  fields: { login: { arguments: QueryLoginArgs; response: String }[] };
};
