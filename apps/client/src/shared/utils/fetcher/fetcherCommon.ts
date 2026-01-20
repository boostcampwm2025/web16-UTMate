import { ApiError } from "../../constants/api";
import type { ApiErrorResponse } from "../../types/api";

export type FetchOptions = Parameters<typeof fetch>[1];

export const getErrorData = async (response: Response): Promise<ApiErrorResponse> => {
  try {
    return await response.json();
  } catch {
    return {
      message: `Error: ${response.status}`,
      statusCode: response.status,
    };
  }
};


export const handleBadResponse = async (response: Response) => {
    const errorData = await getErrorData(response);
    throw new ApiError(errorData.message, errorData.statusCode, errorData.code);
};
