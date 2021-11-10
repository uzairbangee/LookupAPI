export const errorStrings = {
  idNotAvailable: (input: string) =>
    `Id ${input} is not available. Please try a different id`,
  invalidIdInput: (input: string) =>
    `The entered Id for input - ${input} is not in valid format. Ids can only contain alphanumeric characters, _ and -`,
  invalidStringInput: (input: string) =>
    `The input - ${input} cannot be left empty`,
  invalidUrlInput: (input: string) =>
    `The entered value for input - ${input} is not in valid url format`,
  cannotBeAnEmptyArray: (input: string) =>
    `input - ${input} cannot be an empty array`,
  invalidApiType: `The apiType has to be GRAPHQL OR OPEN API`,
  maxSaasTypesInput: `You cannot select more than 3 api saas types`,
  minSaasTypesInput: `You need to select atleast 1 api saas type`,

  pageSizeMinInput: `Page size cannot be less than 1`,
  pageNumberMinInput: `Page number cannot be less than 1`,
  noSubscriptionFound:
    "Either this subscription does not exist or you don't have permission to access it",
  unPublishedVersion: `You don't have the permission to view this version.`,
};
