import { Injectable, Inject } from '@angular/core';

/**
 * Reads to/from a cookie
 */
@Injectable({
  providedIn: 'root'
})
export class CookiesService {
  constructor() {}

  buildCookie(cookieName: string, cookieValue: string, expires: Date): string {
    return `${cookieName}=${cookieValue};expires=${expires.toUTCString()};`;
  }

  getCookie(cookieName: string, cookieString: string): string {
    const regExp: RegExp = this.getCookieRegExp(cookieName);
    const result: RegExpExecArray | null = regExp.exec(cookieString);

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
