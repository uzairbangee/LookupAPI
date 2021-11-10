import {
  GraphqlApiVersion,
  OpenApiVersion,
  MutationCreateApiArgs,
  UserAuth,
  MutationSignupArgs,
  MutationRefreshAccessTokenArgs,
  User,
  MutationCompleteUserProfileArgs,
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
  DecodedAccessToken,
  QueryAuthorizeUserArgs,
} from "../types";

export type TestCollection = {
  fields: {
    getSubscriptionDetails: {
      arguments: QueryGetSubscriptionDetailsArgs;
      response: ApiSubscription;
    }[];
  };
};
