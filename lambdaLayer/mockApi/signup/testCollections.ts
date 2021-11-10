import { TestCollection } from "./testCollectionsTypes";
import {
  ApiType,
  ApiStatus,
  ApiVersionStatus,
  SubscriptionType,
  ApiSaasType,
} from "../types";

export const testCollections: TestCollection = {
  fields: {
    signup: [
      {
        arguments: {
          input: {
            publicAddress: "Donetta",
          },
        },
        response: {
          nonce: "Twila",
          publicAddress: "01",
          creationDate: 1635081727478,
        },
      },
    ],
  },
};
