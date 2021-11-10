export const errorStrings = {
  userAlreadyExists: (input: string) =>
    `User with public address ${input} has already signed up`,
  userDoesntExist: (input: string) =>
    `User with public address ${input} does not exist`,
  signatureNotVerified: `Could not verify the signature`,
  invalidToken: `Invalid token`,
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
  profileAlreadyCompleted: `You have already completed your profile. To update your info please use the updateUserInfo api`,
};
