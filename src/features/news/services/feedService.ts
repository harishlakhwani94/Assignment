import { apiClient } from '../../../app/network/apiClient';
import { Feed } from '../types/feedType';

export const fetchFeeds = async (
  page: number,
  pageSize: number,
): Promise<Array<Feed>> => {
  const response = await apiClient.get(
    `https://jsonplaceholder.typicode.com/posts?_limit=${pageSize}&_page=${page}`,
  );
  return response;
};
