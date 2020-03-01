import { Injectable, Inject } from '@angular/core';
import {
  KERATIN_ID_TOKEN_COOKIE_NAME,
  APP_CLIENT_COOKIES
} from '../injection-tokens';
import { CookiesService } from '../cookies.service';
import { Token, IdTokenStorageService } from '../models';

/**
 * Server side implementation for the TokenStorageService, which reads
 * a cookie from the request.
 *
 * A Request object has to be provided in the SSR render part of an Angular application
 * so that it is available in the constructor of this class.
 */
@Injectable({ providedIn: 'root' })
export class SSRRequestCookieIdTokenStorage implements IdTokenStorageService {
  private token: Token | null;
  constructor(
    @Inject(KERATIN_ID_TOKEN_COOKIE_NAME) private cookieName: string,
    @Inject(APP_CLIENT_COOKIES) private clientCookies: string,
    private cookiesService: CookiesService
  ) {
    console.log(clientCookies);
  }
  store(token: Token) {
    this.token = token;
  }
  retrieve(): Token | null {
    return (
      // favor token first, then try reading from cookie
      this.token || {
        id_token: this.cookiesService.getCookie(
          this.cookieName,
          this.clientCookies
        )
      }
    );
  }
  delete() {
    this.token = null;
  }
}
