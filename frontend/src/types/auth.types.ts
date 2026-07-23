export interface UserProfile {
  username: string;
  role: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  message: string;
}
