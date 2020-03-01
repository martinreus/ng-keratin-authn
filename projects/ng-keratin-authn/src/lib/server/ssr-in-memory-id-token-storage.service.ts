import { Injectable, Inject } from '@angular/core';
import {
  KERATIN_ID_TOKEN_STORE_KEY,
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
 *
 * TODO: if keratin at some point in time supports setting an HttpOnly id token
 * in cookies, try to read it from the cookies. For now let's assume an id_token will
 * not be present in cookies
 */
@Injectable()
export class InMemoryIdTokenStorage implements IdTokenStorageService {
  private token: Token | null;
  constructor() // @Inject(KERATIN_ID_TOKEN_STORE_KEY) private cookieName: string,
  // @Inject(APP_CLIENT_COOKIES) private clientCookies: string,
  // private cookiesService: CookiesService
  {
    console.log('in memory id token store started');
  }
  store(token: Token) {
    this.token = token;
  }
  retrieve(): Token | null {
    return (
      // favor token first, then try reading from cookie
      this.token
      // || {
      //   id_token: this.cookiesService.getCookie(
      //     this.cookieName,
      //     this.clientCookies
      //   )
      // }
    );
  }
  delete() {
    this.token = null;
  }
}
