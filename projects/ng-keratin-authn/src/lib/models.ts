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

export interface IdTokenStorageService {
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

// TODO: refactor this.... maybe use cookies library
export interface CookieOptions {
  maxAge?: number;
  signed?: boolean;
  expires?: Date;
  httpOnly?: boolean;
  path?: string;
  domain?: string;
  secure?: boolean;
  encode?: (val: string) => string;
  sameSite?: boolean | 'lax' | 'strict' | 'none';
}

/**
 * This interface copies the definition from express server for the response object
 * of an http request (so that express library does not need to be imported; we are only interested in the cookie writing
 * capability anyways)
 */
export interface Response {
  cookie(name: string, val: string | any, options: CookieOptions): this;
  cookie(name: string, val: any): this;
}
