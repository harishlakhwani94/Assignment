export type HttpMethod = 'GET' | 'POST';
export interface ApiRequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
}

export const baseUrl = '';
export async function apiRequest<T = any>(
  url: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { method = 'GET', headers = {}, body } = options;
  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };
  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}/${url}`;
  console.log('REQUEST:', { url: fullUrl, options: fetchOptions });
  const response = await fetch(fullUrl, fetchOptions);
  if (!response.ok) {
    console.log('ERROR:', response);
  }
  const responseData = await response.json();
  console.log('RESPONSE:', { url: fullUrl, response: responseData });
  return responseData;
}

export const apiClient = {
  get: <T = any>(url: string, headers?: Record<string, string>) =>
    apiRequest<T>(url, { method: 'GET', headers }),
  post: <T = any>(url: string, body?: any, headers?: Record<string, string>) =>
    apiRequest<T>(url, { method: 'POST', body, headers }),
};
