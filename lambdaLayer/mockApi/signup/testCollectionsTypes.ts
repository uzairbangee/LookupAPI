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
  fields: { signup: { arguments: MutationSignupArgs; response: UserAuth }[] };
};
