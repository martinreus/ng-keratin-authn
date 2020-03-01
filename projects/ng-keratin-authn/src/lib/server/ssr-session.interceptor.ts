import { Injectable, Inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { KERATIN_BASE_URL, APP_CLIENT_COOKIES } from '../injection-tokens';
import { CookiesService } from '../cookies.service';
import { KERATIN_REFRESH_TOKEN_COOKIE_NAME } from './server-injection-tokens';

/**
 * This interceptor will make sure that every request the SSR server sends also includes id_token and refresh token,
 * as long as the request url lies within the domain of the application.
 */
@Injectable()
export class SsrSessionInterceptor implements HttpInterceptor {
  constructor(
    @Inject(KERATIN_BASE_URL) private keratinBaseUrl: string,
    @Inject(APP_CLIENT_COOKIES) private clientCookies: string,
    @Inject(KERATIN_REFRESH_TOKEN_COOKIE_NAME)
    private refreshCookieName: string,
    private cookieService: CookiesService
  ) {
    console.log('created ssr session interceptor');
  }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const reqCopy = req.clone();
    // TODO: add session token from cookies....
    console.log(`Going to request from server side. Request copy is`, reqCopy);
    console.log(
      `Client request contains following cookies: `,
      this.clientCookies
    );

    return next.handle(reqCopy);
  }
}
