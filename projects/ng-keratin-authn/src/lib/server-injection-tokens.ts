import { InjectionToken } from '@angular/core';
import { Response } from './models';

export const KERATIN_REFRESH_TOKEN_COOKIE_NAME = new InjectionToken<string>(
  'keratin.session.token.name'
);
export const SSR_CLIENT_RESPONSE = new InjectionToken<Response>(
  'keratin.server.response'
);
