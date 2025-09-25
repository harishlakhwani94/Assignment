export interface LoginRequestParam {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}
