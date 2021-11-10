import { TestCollection } from "./testCollectionsTypes";
import {
  ApiSaasType,
  ApiStatus,
  ApiType,
  ApiVersionStatus,
  SubscriptionType,
} from "../types";

export const testCollections: TestCollection = {
  fields: {
    getApiVersions: [
      {
        arguments: {
          input: {
            apiId: "01",
            pagination: {
              pageSize: 0,
              pageNumber: 0,
            },
          },
        },
        response: {
          totalCount: 0,
          data: [
            {
              __typename: "GraphqlApiVersion",
              id: "01",
              api: {
                id: "01",
                title: "Ayn",
                developer: {
                  id: "01",
                  firstName: "Jemimah",
                  lastName: "Shaylah",
                  secretText: "Caro",
                  creationDate: 1635081727478,
                  authData: {
                    nonce: "Jeniece",
                    publicAddress: "01",
                    creationDate: 1635081727478,
                  },
                },
                description: "Fiorenze",
                saasType: [
                  ApiSaasType.Erp,
                  ApiSaasType.Accounting,
                  ApiSaasType.PaymentGateway,
                ],
                image: "Aila",
                status: ApiStatus.Underdevelopment,
                creationDate: 1635081727478,
                type: ApiType.Openapi,
              },
              status: ApiVersionStatus.Published,
              dateCreated: 1635081727478,
              datePublished: 1635081727478,
              versionNumber: 0,
              releaseNotes: "Alvira",
              subscriptions: [
                {
                  id: "01",
                  creationDate: 1635081727478,
                  subscriptionToken: "Anabelle",
                  type: SubscriptionType.Testing,
                },
                {
                  id: "01",
                  creationDate: 1635081727478,
                  subscriptionToken: "Salaidh",
                  type: SubscriptionType.Normal,
                },
                {
                  id: "01",
                  creationDate: 1635081727478,
                  subscriptionToken: "Sondra",
                  type: SubscriptionType.Normal,
                },
              ],
              apiToken: "Bernie",
              graphQlSchema: "Claudina",
              apiUrl: "https://google.com",
            },
            {
              __typename: "OpenApiVersion",
              id: "01",
              status: ApiVersionStatus.Published,
              dateCreated: 1635081727478,
              datePublished: 1635081727478,
              versionNumber: 0,
              releaseNotes: "Tarrah",
              subscriptions: [],
              apiToken: "Nathalia",
              openApiDef: "Yetta",
              apiUrl: "https://google.com",
            },
            {
              __typename: "GraphqlApiVersion",
              id: "01",
              status: ApiVersionStatus.Published,
              dateCreated: 1635081727478,
              datePublished: 1635081727478,
              versionNumber: 0,
              releaseNotes: "Barby",
              subscriptions: [],
              apiToken: "Averil",
              graphQlSchema: "Amabelle",
              apiUrl: "https://google.com",
            },
          ],
        },
      },
    ],
  },
};
