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
    getMyApis: [
      {
        arguments: {
          input: {
            pagination: {
              pageSize: 0,
              pageNumber: 0,
            },
            apiSaasType: [
              ApiSaasType.Music,
              ApiSaasType.Travel,
              ApiSaasType.PhotoVideo,
            ],
            apiStatus: ApiStatus.Underdevelopment,
          },
        },
        response: {
          totalCount: 0,
          data: [
            {
              id: "01",
              title: "Lorelle",
              developer: {
                id: "01",
                firstName: "Tommy",
                lastName: "Marcelline",
                secretText: "Fancie",
                creationDate: 1635081727478,
                authData: {
                  nonce: "Petronella",
                  publicAddress: "01",
                  creationDate: 1635081727478,
                },
              },
              description: "Essie",
              saasType: [ApiSaasType.Cms, ApiSaasType.Data, ApiSaasType.News],
              image: "Nerissa",
              status: ApiStatus.Underdevelopment,
              creationDate: 1635081727478,
              type: ApiType.Graphql,
            },
            {
              id: "01",
              title: "Genvieve",
              developer: {
                id: "01",
                firstName: "Linzy",
                lastName: "Tiffy",
                secretText: "Clemence",
                creationDate: 1635081727478,
                authData: {
                  nonce: "Anna",
                  publicAddress: "01",
                  creationDate: 1635081727478,
                },
              },
              description: "Caritta",
              saasType: [
                ApiSaasType.Weather,
                ApiSaasType.News,
                ApiSaasType.BlockchainCrypto,
              ],
              image: "Celine",
              status: ApiStatus.Public,
              creationDate: 1635081727478,
              type: ApiType.Openapi,
            },
            {
              id: "01",
              title: "Vilhelmina",
              developer: {
                id: "01",
                firstName: "Mellisa",
                lastName: "Laurene",
                secretText: "Johnna",
                creationDate: 1635081727478,
                authData: {
                  nonce: "Cordie",
                  publicAddress: "01",
                  creationDate: 1635081727478,
                },
              },
              description: "Christen",
              saasType: [
                ApiSaasType.Data,
                ApiSaasType.Communication,
                ApiSaasType.Lifestyle,
              ],
              image: "Rosalyn",
              status: ApiStatus.Public,
              creationDate: 1635081727478,
              type: ApiType.Graphql,
            },
          ],
        },
      },
    ],
  },
};
