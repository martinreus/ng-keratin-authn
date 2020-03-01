import { Provider } from '@angular/core';
import { APP_CLIENT_COOKIES } from '../injection-tokens';
import { SSR_CLIENT_RESPONSE } from './server-injection-tokens';
import { Response } from '../models';

/**
 * Creates needed providers for the SSR part given the request and response objects from
 * the originating SSR client request.
 * @param req Request object received in the SSR server
 * @param res Response object received in the SSR server
 */
export const keratinReqResSSRProvider = (
  req: any,
  res: Response
): Provider[] => {
  console.log('initiating keratin providers');
  return [
    { provide: APP_CLIENT_COOKIES, useValue: req.headers.cookie },
    { provide: SSR_CLIENT_RESPONSE, useValue: res }
  ];
};
