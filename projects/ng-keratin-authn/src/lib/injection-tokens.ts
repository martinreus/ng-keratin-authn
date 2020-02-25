import { InjectionToken } from '@angular/core';
import { TokenStorageService } from './models';

export const KERATIN_BASE_URL = new InjectionToken<string>('keratin.base.url');
export const KERATIN_TOKEN_STORE = new InjectionToken<TokenStorageService>(
  'keratin.token.storage.strategy'
);
