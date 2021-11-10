import {
  GraphqlApiVersion,
  OpenApiVersion,
  MutationCreateApiArgs,
  UserAuth,
  MutationSignupArgs,
  MutationRefreshAccessTokenArgs,
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
  User,
  QueryAuthorizeUserArgs,
} from "../types";

export type TestCollection = {
  fields: {
    refreshAccessToken: {
      arguments: MutationRefreshAccessTokenArgs;
      response: String;
    }[];
  };
};
