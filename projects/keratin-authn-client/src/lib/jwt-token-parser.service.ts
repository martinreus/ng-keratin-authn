import { Injectable } from '@angular/core';
import { JWTClaims } from './models';

@Injectable({
  providedIn: 'root'
})
export class JwtTokenParserService {
  constructor() {}

  fromIdToken(idToken: string): JWTClaims {
    try {
      const jwtClaims: JWTClaims = JSON.parse(atob(idToken.split('.')[1]));
      // transform exp and iat to ms
      jwtClaims.exp *= 1000;
      jwtClaims.iat *= 1000;
      return jwtClaims;
    } catch (e) {
      throw Error('Malformed JWT: invalid encoding');
    }
  }
}
