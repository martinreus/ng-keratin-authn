import { InjectionToken } from '@angular/core';
import { IdTokenStorageService } from './models';

export const KERATIN_BASE_URL = new InjectionToken<string>('keratin.base.url');
export const KERATIN_ID_TOKEN_STORE = new InjectionToken<IdTokenStorageService>(
  'keratin.token.storage.strategy'
);
export const KERATIN_ID_TOKEN_STORE_KEY = new InjectionToken<string>(
  'keratin.id.token.store.key'
);
export const APP_CLIENT_COOKIES = new InjectionToken<string>(
  'keratin.app.client.cookies'
);
