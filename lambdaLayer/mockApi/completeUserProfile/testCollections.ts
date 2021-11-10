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
    completeUserProfile: [
      {
        arguments: {
          input: {
            firstName: "Sibbie",
            lastName: "Natala",
            username: "01",
          },
        },
        response: {
          id: "01",
          firstName: "Marietta",
          lastName: "Francine",
          secretText: "Norry",
          creationDate: 1635081727478,
          authData: {
            nonce: "Alessandra",
            publicAddress: "01",
            creationDate: 1635081727478,
          },
        },
      },
    ],
  },
};
