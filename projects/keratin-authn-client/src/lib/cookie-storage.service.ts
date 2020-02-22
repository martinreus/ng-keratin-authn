import { IdTokenStorageService, Token } from './models';
import { Inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { JwtTokenParserService } from './jwt-token-parser.service';

@Inject({
  providedIn: 'root'
})
export class CookieStorageService implements IdTokenStorageService {
  constructor(
    private cookieService: CookieService,
    private jwtParser: JwtTokenParserService,
    private cookieName: string = 'idToken'
  ) {}

  /**
   * Securely stores the id token received from Keratin Authn in a secure Cookie
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

  retrieve(): Token {
    // tslint:disable-next-line: variable-name
    const id_token = this.cookieService.get(this.cookieName);
    return { id_token };
  }

  delete() {
    this.cookieService.set(
      this.cookieName,
      '',
      new Date('Thu, 01 Jan 1970 00:00:01 GMT')
    );
  }
}
