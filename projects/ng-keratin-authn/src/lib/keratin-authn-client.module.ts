import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KERATIN_BASE_URL, KERATIN_TOKEN_STORE } from './injection-tokens';
import { CookieStorageService } from './cookie-storage.service';

type storageTypes = 'cookie' | 'localStorage' | 'ssr';
interface AdditionalOptions {
  cookieName?: string;
}

@NgModule()
export class KeratinAuthnModule {
  static forRoot(
    authBaseUrl: string,
    storageMode: storageTypes = 'cookie',
    options?: AdditionalOptions
  ): ModuleWithProviders<KeratinAuthnModule> {
    const tokenStorageStrategy = KeratinAuthnModule.toStorageClass(storageMode);

    return {
      ngModule: KeratinAuthnModule,
      providers: [
        // { provide: COOKIE_NAME, useValue: options?.cookieName || 'idToken' },
        { provide: KERATIN_BASE_URL, useValue: authBaseUrl },
        { provide: KERATIN_TOKEN_STORE, useClass: tokenStorageStrategy }
      ]
    };
  }

  private static toStorageClass(storageMode: storageTypes) {
    switch (storageMode) {
      case 'cookie':
        return CookieStorageService;
      default:
        throw new Error(`Storage mode '${storageMode}' is not yet supported.`);
    }
  }
}
