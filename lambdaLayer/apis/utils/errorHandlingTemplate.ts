export const errorTypes = {
  badRequest: "Bad Request",
  unAuthorized: "Unauthorized",
  notFound: "Not Found",
  internalServerError: "Internal Server Error",
  refused: "refused",
};

export const errorCodes = {
  badRequest: 400,
  unAuthorized: 402,
  notFound: 404,
  internalServerError: 500,
  refused: 405,
};

export interface ErrorStructure {
  data: null;
  errorMessage: string;
  errorType: string;
  errorInfo: {
    errorCode: number;
  };
}

export function returnError(
  errorMessage: string,
  errorInfo: { errorCode: number },
  errorType: string
): ErrorStructure {
  return {
    data: null,
    errorMessage: errorMessage,
    errorType: errorType,
    errorInfo: errorInfo,
  };
}
