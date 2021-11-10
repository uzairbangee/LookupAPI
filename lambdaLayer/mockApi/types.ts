export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  AWSDate: any;
  AWSDateTime: any;
  AWSEmail: any;
  AWSIPAddress: any;
  AWSJSON: any;
  AWSPhone: any;
  AWSTime: any;
  AWSTimestamp: any;
  AWSURL: any;
}

export interface Api {
  __typename?: "Api";
  creationDate?: Maybe<Scalars["AWSTimestamp"]>;
  description?: Maybe<Scalars["String"]>;
  developer?: Maybe<User>;
  id: Scalars["ID"];
  image?: Maybe<Scalars["String"]>;
  saasType?: Maybe<Array<Maybe<ApiSaasType>>>;
  status?: Maybe<ApiStatus>;
  title?: Maybe<Scalars["String"]>;
  type?: Maybe<ApiType>;
}

export enum ApiSaasType {
  Accounting = "ACCOUNTING",
  Ai = "AI",
  Billing = "BILLING",
  BlockchainCrypto = "BLOCKCHAIN_CRYPTO",
  Business = "BUSINESS",
  Cms = "CMS",
  Communication = "COMMUNICATION",
  Crm = "CRM",
  Data = "DATA",
  Ecommerce = "ECOMMERCE",
  Education = "EDUCATION",
  Erp = "ERP",
  Finance = "FINANCE",
  Food = "FOOD",
  HealthFitness = "HEALTH_FITNESS",
  Hrm = "HRM",
  Iot = "IOT",
  Lifestyle = "LIFESTYLE",
  Medical = "MEDICAL",
  Music = "MUSIC",
  News = "NEWS",
  PaymentGateway = "PAYMENT_GATEWAY",
  PhotoVideo = "PHOTO_VIDEO",
  Pm = "PM",
  Productivity = "PRODUCTIVITY",
  Reference = "REFERENCE",
  SocialNetworking = "SOCIAL_NETWORKING",
  Sports = "SPORTS",
  Travel = "TRAVEL",
  Utilities = "UTILITIES",
  Weather = "WEATHER",
}

export enum ApiStatus {
  Public = "PUBLIC",
  Underdevelopment = "UNDERDEVELOPMENT",
}

export interface ApiSubscription {
  __typename?: "ApiSubscription";
  creationDate?: Maybe<Scalars["AWSTimestamp"]>;
  id: Scalars["ID"];
  subscriptionToken?: Maybe<Scalars["String"]>;
  type?: Maybe<SubscriptionType>;
  version?: Maybe<GraphqlApiVersion | OpenApiVersion>;
}

export enum ApiType {
  Graphql = "GRAPHQL",
  Openapi = "OPENAPI",
}

export interface ApiVersion {
  api?: Maybe<Api>;
  apiToken?: Maybe<Scalars["String"]>;
  dateCreated?: Maybe<Scalars["AWSTimestamp"]>;
  datePublished?: Maybe<Scalars["AWSTimestamp"]>;
  id: Scalars["ID"];
  releaseNotes?: Maybe<Scalars["String"]>;
  status?: Maybe<ApiVersionStatus>;
  subscriptions?: Maybe<Array<Maybe<ApiSubscription>>>;
  versionNumber?: Maybe<Scalars["Int"]>;
}

export enum ApiVersionStatus {
  Published = "PUBLISHED",
  Unpublished = "UNPUBLISHED",
}

export interface ApiVersionsListOutput {
  __typename?: "ApiVersionsListOutput";
  data: Array<Maybe<GraphqlApiVersion | OpenApiVersion>>;
  totalCount: Scalars["Int"];
}

export interface ApisListOutput {
  __typename?: "ApisListOutput";
  data: Array<Maybe<Api>>;
  totalCount: Scalars["Int"];
}

export interface CreateApiInput {
  apiId: Scalars["String"];
  apiUrl: Scalars["AWSURL"];
  description?: Maybe<Scalars["String"]>;
  graphQlSchema?: Maybe<Scalars["String"]>;
  image?: Maybe<Scalars["String"]>;
  openApiDef?: Maybe<Scalars["String"]>;
  releaseNotes?: Maybe<Scalars["String"]>;
  saasType: Array<ApiSaasType>;
  title: Scalars["String"];
  type: ApiType;
}

export interface DecodedAccessToken {
  __typename?: "DecodedAccessToken";
  exp?: Maybe<Scalars["Int"]>;
  iat?: Maybe<Scalars["Int"]>;
  payload: AccessTokenPayload;
}

export interface GetApiVersionsInput {
  apiId: Scalars["ID"];
  pagination?: Maybe<Pagination>;
}

export interface GetMyApisInput {
  apiSaasType?: Maybe<Array<Maybe<ApiSaasType>>>;
  apiStatus?: Maybe<ApiStatus>;
  pagination?: Maybe<Pagination>;
}

export interface GetPublicApisInput {
  apiSaasType?: Maybe<Array<Maybe<ApiSaasType>>>;
  pagination?: Maybe<Pagination>;
}

export interface GraphqlApiVersion extends ApiVersion {
  __typename?: "GraphqlApiVersion";
  api?: Maybe<Api>;
  apiToken?: Maybe<Scalars["String"]>;
  apiUrl?: Maybe<Scalars["AWSURL"]>;
  dateCreated?: Maybe<Scalars["AWSTimestamp"]>;
  datePublished?: Maybe<Scalars["AWSTimestamp"]>;
  graphQlSchema?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  releaseNotes?: Maybe<Scalars["String"]>;
  status?: Maybe<ApiVersionStatus>;
  subscriptions?: Maybe<Array<Maybe<ApiSubscription>>>;
  versionNumber?: Maybe<Scalars["Int"]>;
}

export interface Mutation {
  __typename?: "Mutation";
  completeUserProfile?: Maybe<User>;
  createApi: GraphqlApiVersion | OpenApiVersion;
  refreshAccessToken: Scalars["String"];
  signup: UserAuth;
}

export interface MutationCompleteUserProfileArgs {
  input: CompleteUserProfileInput;
}

export interface MutationCreateApiArgs {
  input?: Maybe<CreateApiInput>;
}

export interface MutationRefreshAccessTokenArgs {
  input: RefreshAccessTokenInput;
}

export interface MutationSignupArgs {
  input: SignupInput;
}

export interface OpenApiVersion extends ApiVersion {
  __typename?: "OpenApiVersion";
  api?: Maybe<Api>;
  apiToken?: Maybe<Scalars["String"]>;
  apiUrl?: Maybe<Scalars["AWSURL"]>;
  dateCreated?: Maybe<Scalars["AWSTimestamp"]>;
  datePublished?: Maybe<Scalars["AWSTimestamp"]>;
  id: Scalars["ID"];
  openApiDef?: Maybe<Scalars["String"]>;
  releaseNotes?: Maybe<Scalars["String"]>;
  status?: Maybe<ApiVersionStatus>;
  subscriptions?: Maybe<Array<Maybe<ApiSubscription>>>;
  versionNumber?: Maybe<Scalars["Int"]>;
}

export interface Pagination {
  pageNumber?: Maybe<Scalars["Int"]>;
  pageSize?: Maybe<Scalars["Int"]>;
}

export interface Query {
  __typename?: "Query";
  authorizeUser: DecodedAccessToken;
  getApiDetails: Api;
  getApiVersionDetails: GraphqlApiVersion | OpenApiVersion;
  getApiVersions: ApiVersionsListOutput;
  getMyApis: ApisListOutput;
  getSubscriptionDetails: ApiSubscription;
  getUserAuthData: UserAuth;
  login: Scalars["String"];
}

export interface QueryAuthorizeUserArgs {
  input: AuthorizeUserInput;
}

export interface QueryGetApiDetailsArgs {
  apiId: Scalars["ID"];
}

export interface QueryGetApiVersionDetailsArgs {
  versionId: Scalars["ID"];
}

export interface QueryGetApiVersionsArgs {
  input?: Maybe<GetApiVersionsInput>;
}

export interface QueryGetMyApisArgs {
  input?: Maybe<GetMyApisInput>;
}

export interface QueryGetSubscriptionDetailsArgs {
  subscriptionId: Scalars["ID"];
}

export interface QueryGetUserAuthDataArgs {
  input: GetUserAuthDataInput;
}

export interface QueryLoginArgs {
  input: LoginInput;
}

export enum SubscriptionType {
  Normal = "NORMAL",
  Testing = "TESTING",
}

export interface User {
  __typename?: "User";
  authData?: Maybe<UserAuth>;
  creationDate?: Maybe<Scalars["AWSTimestamp"]>;
  firstName?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  lastName?: Maybe<Scalars["String"]>;
  secretText?: Maybe<Scalars["String"]>;
}

export interface UserAuth {
  __typename?: "UserAuth";
  creationDate?: Maybe<Scalars["AWSTimestamp"]>;
  nonce?: Maybe<Scalars["String"]>;
  publicAddress: Scalars["ID"];
}

export interface VersionsListOutput {
  __typename?: "VersionsListOutput";
  data: Array<Maybe<GraphqlApiVersion | OpenApiVersion>>;
  totalCount: Scalars["Int"];
}

export interface AccessTokenPayload {
  __typename?: "accessTokenPayload";
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  publicAddress: Scalars["String"];
  username?: Maybe<Scalars["ID"]>;
}

export interface AuthorizeUserInput {
  accessToken: Scalars["String"];
}

export interface CompleteUserProfileInput {
  firstName: Scalars["String"];
  lastName: Scalars["String"];
  username: Scalars["ID"];
}

export interface GetUserAuthDataInput {
  publicAddress: Scalars["String"];
}

export interface LoginInput {
  publicAddress: Scalars["String"];
  signature: Scalars["String"];
}

export interface RefreshAccessTokenInput {
  accessToken: Scalars["String"];
}

export interface SignupInput {
  publicAddress: Scalars["String"];
}
