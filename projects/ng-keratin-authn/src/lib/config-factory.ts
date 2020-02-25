import { Provider } from '@angular/core';
import { KERATIN_BASE_URL, KERATIN_TOKEN_STORE } from './injection-tokens';
import { CookieStorageService } from './cookie-storage.service';

type tokenStorageType = 'cookie';

/**
 * Configures all needed providers when using Keratin Authn library.
 */
export const authnProviders = (config: {
  authnBaseUrl: string;
  tokenStorage?: tokenStorageType;
}): Provider[] => {
  return [
    {
      provide: KERATIN_BASE_URL,
      useValue: config.authnBaseUrl
    },
    {
      provide: KERATIN_TOKEN_STORE,
      useClass: tokenStorageStrategy(config.tokenStorage)
    }
  ];
};

const tokenStorageStrategy = (storageType?: tokenStorageType) => {
  switch (storageType) {
    case 'cookie':
    case undefined:
    default:
      return CookieStorageService;
  }
};
