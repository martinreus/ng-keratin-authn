export interface Token {
  id_token: string;
}

export interface PasswordScore {
  score: number;
  requiredScore: number;
}

export interface Credentials {
  [index: string]: string;
  username: string;
  password: string;
}

export interface TokenStorageService {
  store(token: Token);
  retrieve(): Token | null;
  delete();
}

export interface JWTClaims {
  iss: string;
  aud: string;
  sub: number;
  iat: number;
  exp: number;
}
