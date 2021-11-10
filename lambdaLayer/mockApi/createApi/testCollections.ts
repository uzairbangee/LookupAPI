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
    createApi: [
      {
        arguments: {
          input: {
            apiId: "Doris",
            title: "Maurine",
            image: "Herminia",
            description: "Tania",
            saasType: [
              ApiSaasType.Ai,
              ApiSaasType.Business,
              ApiSaasType.Ecommerce,
            ],
            type: ApiType.Openapi,
            releaseNotes: "Janeta",
            openApiDef: "Merry",
            apiUrl: "https://google.com",
            graphQlSchema: "Revkah",
          },
        },
        response: {
          __typename: "OpenApiVersion",
          id: "01",
          api: {
            id: "01",
            title: "Alisha",
            developer: {
              id: "01",
              firstName: "Maybelle",
              lastName: "Yvonne",
              secretText: "Ronna",
              creationDate: 1635081727478,
              authData: {
                nonce: "Rhianna",
                publicAddress: "01",
                creationDate: 1635081727478,
              },
            },
            description: "Pen",
            saasType: [
              ApiSaasType.Finance,
              ApiSaasType.Communication,
              ApiSaasType.News,
            ],
            image: "Celesta",
            status: ApiStatus.Underdevelopment,
            creationDate: 1635081727478,
            type: ApiType.Openapi,
          },
          status: ApiVersionStatus.Unpublished,
          dateCreated: 1635081727478,
          datePublished: 1635081727478,
          versionNumber: 0,
          releaseNotes: "Blancha",
          subscriptions: [
            {
              id: "01",
              creationDate: 1635081727478,
              subscriptionToken: "Ciel",
              type: SubscriptionType.Testing,
            },
            {
              id: "01",
              creationDate: 1635081727478,
              subscriptionToken: "Hetty",
              type: SubscriptionType.Normal,
            },
            {
              id: "01",
              creationDate: 1635081727478,
              subscriptionToken: "Georgeanna",
              type: SubscriptionType.Testing,
            },
          ],
          apiToken: "Phyllida",
          openApiDef: "Roseanne",
          apiUrl: "https://google.com",
        },
      },
    ],
  },
};
