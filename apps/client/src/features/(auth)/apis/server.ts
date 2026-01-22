import { serverFetcher } from "@/shared/utils/fetcher/serverFetcher";
import { SERVER_BASE_URL } from "@/shared/constants/api";

import type { User } from "../types";

export const getCurrentUseronServer = async () => {
  return serverFetcher<User>(`${SERVER_BASE_URL}/users/me`);
};