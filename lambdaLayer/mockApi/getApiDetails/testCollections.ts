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
    getApiDetails: [
      {
        arguments: {
          apiId: "01",
        },
        response: {
          id: "01",
          title: "Willabella",
          developer: {
            id: "01",
            firstName: "Jenine",
            lastName: "Colly",
            secretText: "Kellia",
            creationDate: 1635081727478,
            authData: {
              nonce: "Sherri",
              publicAddress: "01",
              creationDate: 1635081727478,
            },
          },
          description: "Jaime",
          saasType: [
            ApiSaasType.Hrm,
            ApiSaasType.Lifestyle,
            ApiSaasType.Utilities,
          ],
          image: "Emylee",
          status: ApiStatus.Underdevelopment,
          creationDate: 1635081727478,
          type: ApiType.Graphql,
        },
      },
    ],
  },
};
