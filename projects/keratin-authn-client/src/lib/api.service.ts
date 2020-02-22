import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Credentials, Token } from './models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient, private baseUrl: string) {}

  changePassword(args: {
    password: string;
    currentPassword: string;
  }): Observable<Token> {
    return this.http
      .post(`${this.baseUrl}/password`, args)
      .pipe(map(toTokenResponse));
  }

  isAvailable(username: string): Observable<boolean> {
    return this.http
      .get(`${this.baseUrl}/accounts/available?username=${username}`)
      .pipe(
        map(toBoolean),
        catchError(err => {
          if (
            err.status === 422 &&
            err.error?.errors[0]?.field === 'username' &&
            err.error?.errors[0]?.message === 'TAKEN'
          ) {
            return of(false);
          }
          throw err;
        })
      );
  }

  login(credentials: Credentials): Observable<Token> {
    return this.http
      .post(`${this.baseUrl}/session`, credentials)
      .pipe(map(toTokenResponse));
  }

  logout(): Observable<{}> {
    return this.http.delete(`${this.baseUrl}/session`) as Observable<{}>;
  }

  signup(credentials: Credentials): Observable<Token> {
    return this.http
      .post(`${this.baseUrl}/accounts`, credentials)
      .pipe(map(toTokenResponse));
  }

  refresh(): Observable<Token> {
    return this.http
      .get(`${this.baseUrl}/session/refresh`)
      .pipe(map(toTokenResponse));
  }

  requestPasswordReset(username: string): Observable<{}> {
    return this.http.get(`${this.baseUrl}/password/reset?username=${username}`);
  }

  requestSessionToken(username: string): Observable<{}> {
    return this.http.get(
      `${this.baseUrl}/session/token?username=${username}`
    ) as Observable<{}>;
  }

  resetPassword(args: { password: string; token: string }): Observable<Token> {
    return this.http
      .post(`${this.baseUrl}/password`, args)
      .pipe(map(toTokenResponse));
  }

  sessionTokenLogin(credentials: { token: string }): Observable<Token> {
    return this.http
      .post(`${this.baseUrl}/session/token`, credentials)
      .pipe(map(toTokenResponse));
  }
}

const toTokenResponse = response => response.result as Token;
const toBoolean = response => response.result as boolean;
