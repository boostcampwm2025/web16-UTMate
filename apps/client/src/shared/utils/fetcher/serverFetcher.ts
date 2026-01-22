import { cookies } from "next/headers";

import { handleBadResponse, parseResponse } from "./fetcherCommon";
import type { FetchOptions } from "./fetcherCommon";

export const serverFetcher = async <T>(url: string, options: FetchOptions = {}) => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token');

    const mergedOptions = {
        credentials: 'include' as RequestCredentials,
        headers: {
            Cookie: accessToken ? `access_token=${accessToken.value}` : '',
        },
        ...options,
    };

  const response = await fetch(url, mergedOptions);

  if (!response.ok) {
    return handleBadResponse(response);
  }

  return parseResponse<T>(response);
};
