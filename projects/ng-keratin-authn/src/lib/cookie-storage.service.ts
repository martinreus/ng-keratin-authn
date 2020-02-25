import { Injectable } from '@angular/core';
import { JwtTokenParserService } from './jwt-token-parser.service';
import { Token, TokenStorageService } from './models';

@Injectable({
  providedIn: 'root'
})
export class CookieStorageService implements TokenStorageService {
  private cookieName = 'authnIdToken';
  constructor(private jwtParser: JwtTokenParserService) {}

  /**
   * Stores the id token received from Keratin Authn in a Cookie
   * which will be sent on every request made to the backend.
   */
  store(token: Token) {
    const jwtClaims = this.jwtParser.fromIdToken(token.id_token);

    this.setCookie(token.id_token, new Date(jwtClaims.exp));
  }

  retrieve(): Token | null {
    const idToken = this.getCookie();

    return idToken ? { id_token: idToken } : null;
  }

  delete() {
    this.setCookie('', new Date('Thu, 01 Jan 1970 00:00:01 GMT'));
  }

  private setCookie(cookieValue: string, expires: Date): void {
    document.cookie = `${
      this.cookieName
    }=${cookieValue};expires=${expires.toUTCString()};`;
  }

  private getCookie(): string {
    const regExp: RegExp = this.getCookieRegExp(this.cookieName);
    const result: RegExpExecArray | null = regExp.exec(document.cookie);

    return result ? result[1] : '';
  }

  private getCookieRegExp(name: string): RegExp {
    const escapedName: string = name.replace(
      /([\[\]\{\}\(\)\|\=\;\+\?\,\.\*\^\$])/gi,
      '\\$1'
    );

    return new RegExp(
      '(?:^' + escapedName + '|;\\s*' + escapedName + ')=(.*?)(?:;|$)',
      'g'
    );
  }
}
