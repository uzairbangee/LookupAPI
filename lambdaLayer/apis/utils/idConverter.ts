export const convertToNeptuneId = {
  api: (id: string) => `api#${id}`,
  apiVersion: (id: string) => `apiVersion#${id}`,
  publicAddress: (address: string) => `publicAddress#${address}`,
  user: (id: string) => `user#${id}`,
};

export const convertFromNeptuneId = {
  api: (id: string) => id.split("#")[1].trim(),
  apiVersion: (id: string) => id.split("#")[1].trim(),
  publicAddress: (address: string) => address.split("#")[1].trim(),
  user: (id: string) => id.split("#")[1].trim(),
};
