export interface Token {
  id_token: string;
}

export interface Credentials {
  [index: string]: string;
  username: string;
  password: string;
}

export interface IdTokenStorageService {
  store(token: Token);
  retrieve(): Token;
  delete();
}

export interface JWTClaims {
  iss: string;
  aud: string;
  sub: number;
  iat: number;
  exp: number;
}
