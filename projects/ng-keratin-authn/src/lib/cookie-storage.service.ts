import { TokenStorageService, Token } from './models';
import { Inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { JwtTokenParserService } from './jwt-token-parser.service';
import { COOKIE_NAME } from './injection-tokens';

@Injectable({
  providedIn: 'root'
})
export class CookieStorageService implements TokenStorageService {
  constructor(
    private cookieService: CookieService,
    private jwtParser: JwtTokenParserService,
    @Inject(COOKIE_NAME) private cookieName: string
  ) {}

  /**
   * Stores the id token received from Keratin Authn in a Cookie
   * which will be sent on every request made to the backend.
   */
  store(token: Token) {
    const jwtClaims = this.jwtParser.fromIdToken(token.id_token);
    this.cookieService.set(
      this.cookieName,
      token.id_token,
      new Date(jwtClaims.exp)
    );
  }

  retrieve(): Token | null {
    const idToken = this.cookieService.get(this.cookieName);

    return idToken ? { id_token: idToken } : null;
  }

  delete() {
    this.cookieService.set(
      this.cookieName,
      '',
      new Date('Thu, 01 Jan 1970 00:00:01 GMT')
    );
  }
}
