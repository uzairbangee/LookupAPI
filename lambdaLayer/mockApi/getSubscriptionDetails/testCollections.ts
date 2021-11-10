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
    getSubscriptionDetails: [
      {
        arguments: {
          subscriptionId: "01",
        },
        response: {
          id: "01",
          creationDate: 1635081727478,
          version: {
            __typename: "GraphqlApiVersion",
            id: "01",
            api: {
              id: "01",
              title: "Mirna",
              developer: {
                id: "01",
                firstName: "Cherilyn",
                lastName: "Constantina",
                secretText: "Caresse",
                creationDate: 1635081727478,
                authData: {
                  nonce: "Vanna",
                  publicAddress: "01",
                  creationDate: 1635081727478,
                },
              },
              description: "Jess",
              saasType: [ApiSaasType.Pm, ApiSaasType.Sports, ApiSaasType.News],
              image: "Dyna",
              status: ApiStatus.Underdevelopment,
              creationDate: 1635081727478,
              type: ApiType.Graphql,
            },
            status: ApiVersionStatus.Unpublished,
            dateCreated: 1635081727478,
            datePublished: 1635081727478,
            versionNumber: 0,
            releaseNotes: "Dollie",
            subscriptions: [],
            apiToken: "Leigh",
            graphQlSchema: "Brita",
            apiUrl: "https://google.com",
          },
          subscriptionToken: "Taffy",
          type: SubscriptionType.Normal,
        },
      },
    ],
  },
};
