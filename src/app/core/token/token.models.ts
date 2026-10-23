export interface TokenRequest {
  rollno: string;
  password: string;
}

export interface TokenDetails {
  name: string;
  quantity: string;
}

export interface TokenData {
  status: string;
  qrcode: string;
  tokenDetails: TokenDetails[];
}

export interface TokenResponse {
  status: string;
  token: TokenData;
}
