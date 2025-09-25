import { apiClient } from '../../../app/network/apiClient';
import { LoginRequestParam, LoginResponse } from '../types/apiTypes';

export const loginService = async (
  params: LoginRequestParam,
): Promise<LoginResponse> => {
  const headers = { 'x-api-key': 'reqres-free-v1' };
  return apiClient.post('https://reqres.in/api/login', params, headers);
};
