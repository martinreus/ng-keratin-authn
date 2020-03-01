import { Injectable, Inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable, combineLatest, of } from 'rxjs';
import { AuthnSessionService } from '../authn-session.service';
import { IdTokenStorageService, Token } from '../models';
import { mergeMap, map, tap } from 'rxjs/operators';
import { KERATIN_ID_TOKEN_STORE } from '../injection-tokens';

@Injectable()
export class AuthorizationInterceptorService implements HttpInterceptor {
  constructor(
    private authService: AuthnSessionService,
    @Inject(KERATIN_ID_TOKEN_STORE) private tokenStore: IdTokenStorageService
  ) {
    console.log('started auth interceptor');
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.authService.user$.pipe(
      map(userClaims => (userClaims ? this.tokenStore.retrieve() : null)),
      map(token => {
        const requestCopy = req.clone();
        if (token) {
          requestCopy.headers.set('Authorization', `Bearer ${token.id_token}`);
        }
        return requestCopy;
      }),
      mergeMap(request => next.handle(request))
    );
  }
}
