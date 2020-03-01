import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * This interceptor will make sure that every request the SSR server sends also includes id_token and refresh token,
 * as long as the request url lies within the domain of the application.
 */
@Injectable({
  providedIn: 'root'
})
export class SsrSessionInterceptor implements HttpInterceptor {
  constructor() {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    throw new Error('Method not implemented.');
  }
}
