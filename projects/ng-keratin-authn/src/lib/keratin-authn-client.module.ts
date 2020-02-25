import { ModuleWithProviders, NgModule } from '@angular/core';
import { HOSTNAME, COOKIE_NAME, TOKEN_STORE } from './injection-tokens';
import { CookieStorageService } from './cookie-storage.service';

type storageTypes = 'cookie' | 'localStorage' | 'ssr';
interface AdditionalOptions {
  cookieName?: string;
}

@NgModule({
  imports: []
})
export class KeratinAuthnModule {
  static forRoot = (
    authBaseUrl: string,
    storageMode: storageTypes = 'cookie',
    options?: AdditionalOptions
  ): ModuleWithProviders => {
    const tokenStorageStrategy = KeratinAuthnModule.toStorageClass(storageMode);

    return {
      ngModule: KeratinAuthnModule,
      providers: [
        { provide: HOSTNAME, useValue: authBaseUrl },
        { provide: COOKIE_NAME, useValue: options?.cookieName || 'idToken' },
        { provide: TOKEN_STORE, useClass: tokenStorageStrategy }
      ]
    };
  };

  private static toStorageClass(storageMode: storageTypes) {
    switch (storageMode) {
      case 'cookie':
        return CookieStorageService;
      default:
        throw new Error(`Storage mode '${storageMode}' is not yet supported.`);
    }
  }
}
