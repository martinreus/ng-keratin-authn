import { InjectionToken } from '@angular/core';
import { TokenStorageService } from './models';

export const HOSTNAME = new InjectionToken<string>('hostname');
export const TOKEN_STORE = new InjectionToken<TokenStorageService>(
  'tokenStoreService'
);
export const COOKIE_NAME = new InjectionToken<string>('cookieName');
