export interface LoginRequest {
  rollno: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  username?: string;
}

export interface AuthSession {
  rollno: string;
  password: string;
  username: string;
}
