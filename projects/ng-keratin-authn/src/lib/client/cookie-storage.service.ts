import { Injectable, Inject } from '@angular/core';
import { JwtTokenParserService } from '../jwt-token-parser.service';
import { CookiesService } from '../cookies.service';
import { Token, IdTokenStorageService } from '../models';
import { KERATIN_ID_TOKEN_STORE_KEY } from '../injection-tokens';

/**
 * Client side Token Storage service for storing an id_token in a cookie.
 */
@Injectable()
export class CookieStorageService implements IdTokenStorageService {
  constructor(
    private jwtParser: JwtTokenParserService,
    private cookies: CookiesService,
    @Inject(KERATIN_ID_TOKEN_STORE_KEY) private cookieName: string
  ) {
    console.log('using cookie storage');
  }

  /**
   * Stores the id token received from Keratin Authn in a Cookie
   * which will be sent on every request made to the backend.
   */
  store(token: Token) {
    const jwtClaims = this.jwtParser.fromIdToken(token.id_token);

    document.cookie = this.cookies.serialize(
      this.cookieName,
      token.id_token,
      new Date(jwtClaims.exp)
    );
  }

  retrieve(): Token | null {
    const idToken = this.cookies.getCookie(this.cookieName, document.cookie);

    return idToken ? { id_token: idToken } : null;
  }

  delete() {
    document.cookie = this.cookies.serialize(
      this.cookieName,
      '',
      new Date('Thu, 01 Jan 1970 00:00:01 GMT')
    );
  }
}
