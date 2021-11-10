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
    authorizeUser: [
      {
        arguments: {
          input: {
            accessToken: "Brynne",
          },
        },
        response: {
          id: "01",
          firstName: "Marna",
          lastName: "Twila",
          secretText: "Nancee",
          creationDate: 1635081727478,
          authData: {
            nonce: "Odella",
            publicAddress: "01",
            creationDate: 1635081727478,
          },
        },
      },
    ],
  },
};
