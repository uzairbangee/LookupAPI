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
    getUserAuthData: [
      {
        arguments: {
          input: {
            publicAddress: "Billye",
          },
        },
        response: {
          nonce: "Andeee",
          publicAddress: "01",
          creationDate: 1635081727478,
        },
      },
    ],
  },
};
