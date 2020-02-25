import { Injectable, Inject } from '@angular/core';
import { Observable, of, ReplaySubject, Subject } from 'rxjs';
import {
  delay,
  filter,
  flatMap,
  map,
  mergeMap,
  take,
  takeUntil,
  tap
} from 'rxjs/operators';
import { AuthnApiService } from './authn-api.service';
import { JwtTokenParserService } from './jwt-token-parser.service';
import { Credentials, TokenStorageService, JWTClaims, Token } from './models';
import { KERATIN_TOKEN_STORE } from './injection-tokens';

@Injectable({
  providedIn: 'root'
})
export class AuthnSessionService {
  private authUser$ = new ReplaySubject<JWTClaims | null>(1);
  private authToken$ = new Subject<Token | null>();
  private cancelRefresh$ = new Subject<void>();

  constructor(
    private api: AuthnApiService,
    @Inject(KERATIN_TOKEN_STORE) private idTokenStorage: TokenStorageService,
    private tokenParser: JwtTokenParserService
  ) {
    this.trySettingInitialAuthentication();
    this.initAuthLogic();
  }

  // get an observable for the current authenticated user.
  get user$(): Observable<JWTClaims | null> {
    return this.authUser$;
  }

  /**
   * Signs up a user while also logging in.
   * If you want to just register without logging user in, use AuthnApiService's signup call.
   *
   * @param credentials User credentials
   */
  signup(credentials: Credentials): Observable<JWTClaims | null> {
    return this.api.signup(credentials).pipe(
      tap(token => this.authToken$.next(token)),
      map(this.toJWTClaims)
    );
  }

  /**
   *  Logs into the application and emits an Authenticated user. Throws error otherwise.
   */
  login = (credentials: Credentials): Observable<JWTClaims | null> => {
    return this.api.login(credentials).pipe(
      tap(token => this.authToken$.next(token)),
      map(this.toJWTClaims)
    );
  };

  // logs user out, calling the backend to clear HttpOnly refresh cookie
  logout = (): Observable<null> => {
    return this.api.logout().pipe(
      map(_ => null),
      tap(token => this.authToken$.next(token))
    );
  };

  // Try setting an initial authentication if there is some in the storage.
  // If no authentication is found in storage, try refreshing it from the backend.
  // If still no authentication is found, well, then the user is not authenticated.
  private trySettingInitialAuthentication() {
    const token: Token | null = this.idTokenStorage.retrieve();
    // if there is a token, issue it. Even if it is expired, the refresh logic will take care of
    // fetching a new one.
    if (token) {
      this.authToken$.next(token);
      return;
    }

    // if no id_token is found in storage, we can still try to force refreshing an id_token,
    // because the user could potentially have a refresh token amongst his cookies.
    this.api
      .refresh()
      .pipe(take(1))
      .subscribe({
        next: result => this.authToken$.next(result),
        error: _ => this.authToken$.next(null)
      });
  }

  // set up refresh and claims logic for the authenticated user
  private initAuthLogic = () => {
    // since this should be used as a singleton service, I think it is ok to have Subscribes
    // without the unsubscribe counterpart...
    this.authToken$
      .pipe(
        // take the token and store it, or delete it if it is null
        tap(token => {
          if (!token) {
            this.idTokenStorage.delete();
          } else {
            this.idTokenStorage.store(token);
          }
        }),
        // transform into claims
        map(this.toJWTClaims),
        // inform observers of the next authenticated user.
        // Claims can be null, indicating a user has been logged out, or an error such as
        // an invalid id_token or refresh token has caused a logout
        tap(claims => this.authUser$.next(claims)),
        // stop any current refresh timer, to prevent spamming server
        tap(_ => this.cancelRefresh$.next()),
        // only setup refresh timer if token is there
        filter(token => !!token),
        // token is most definitely defined here because of the filter operator,
        // that's why tslint is disabled for the next line
        // tslint:disable-next-line: no-non-null-assertion
        mergeMap(token => this.setRefreshTimeout(token!))
      )
      // subscribe listens for the refreshes issued in setRefreshTimeout
      // and also ensures this whole block is executed =)
      .subscribe({
        next: token => this.authToken$.next(token),
        error: _ => {
          this.authToken$.next(null);
        }
      });
  };

  // returns an observer which delays a refresh for the id_token.
  // The refresh timer will be cancelled if a this.cancelRefresh$.next() is called.
  private setRefreshTimeout = (jwtClaims: JWTClaims) => {
    const browserTime = Date.now();
    const halfTime = (jwtClaims.exp - jwtClaims.iat) / 2;
    const remainingTimeInMiliseconds = jwtClaims.iat + halfTime - browserTime;

    return of(null).pipe(
      // stop if cancel is issued before calling API
      takeUntil(this.cancelRefresh$),
      // setup delay of remaining authentication time left
      delay(remainingTimeInMiliseconds),
      // then call backend for refreshing the token
      flatMap(() => this.api.refresh())
    );
  };

  private toJWTClaims = (token: Token | null): null | JWTClaims => {
    if (!token) {
      return null;
    }
    return this.tokenParser.fromIdToken(token.id_token);
  };
}
