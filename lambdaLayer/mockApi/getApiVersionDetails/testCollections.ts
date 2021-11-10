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
    getApiVersionDetails: [
      {
        arguments: {
          versionId: "01",
        },
        response: {
          __typename: "GraphqlApiVersion",
          id: "01",
          api: {
            id: "01",
            title: "Erda",
            developer: {
              id: "01",
              firstName: "Diahann",
              lastName: "Anabal",
              secretText: "Thomasine",
              creationDate: 1635081727478,
              authData: {
                nonce: "Modesta",
                publicAddress: "01",
                creationDate: 1635081727478,
              },
            },
            description: "Delores",
            saasType: [
              ApiSaasType.Productivity,
              ApiSaasType.Communication,
              ApiSaasType.Erp,
            ],
            image: "Amii",
            status: ApiStatus.Underdevelopment,
            creationDate: 1635081727478,
            type: ApiType.Graphql,
          },
          status: ApiVersionStatus.Published,
          dateCreated: 1635081727478,
          datePublished: 1635081727478,
          versionNumber: 0,
          releaseNotes: "Lona",
          subscriptions: [
            {
              id: "01",
              creationDate: 1635081727478,
              subscriptionToken: "Marianne",
              type: SubscriptionType.Normal,
            },
            {
              id: "01",
              creationDate: 1635081727478,
              subscriptionToken: "Kellsie",
              type: SubscriptionType.Normal,
            },
            {
              id: "01",
              creationDate: 1635081727478,
              subscriptionToken: "Loree",
              type: SubscriptionType.Testing,
            },
          ],
          apiToken: "Isabelle",
          graphQlSchema: "Florencia",
          apiUrl: "https://google.com",
        },
      },
    ],
  },
};
