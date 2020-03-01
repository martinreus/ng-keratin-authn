import {
  ClassSansProvider,
  ExistingSansProvider,
  FactorySansProvider,
  ModuleWithProviders,
  NgModule,
  Provider,
  Type,
  ValueSansProvider
} from '@angular/core';
import { CookieStorageService } from './client/cookie-storage.service';
import {
  KERATIN_BASE_URL,
  KERATIN_ID_TOKEN_STORE,
  KERATIN_ID_TOKEN_COOKIE_NAME
} from './injection-tokens';
import { IdTokenStorageService } from './models';
import { SSRRequestCookieIdTokenStorage } from './server/ssr-request-cookie-id-token-storage.service';
import { KERATIN_REFRESH_TOKEN_COOKIE_NAME } from './server-injection-tokens';

type ProviderSansProvider =
  | FactorySansProvider
  | ClassSansProvider
  | ValueSansProvider
  | ExistingSansProvider;

type ClientStorageStrategy = 'cookie' | 'localStorage';
type ServerStorageStrategy = 'request-cookie' | 'authorization-header';

const defaultIdTokenName = 'authnIdToken';

export interface ClientOptions {
  tokenStore: ClientStorageStrategy | ProviderSansProvider;
}
export interface ServerOptions {
  tokenStore: ServerStorageStrategy | ProviderSansProvider;
}

@NgModule()
export class KeratinAuthnModule {
  /**
   * Initializes Keratin Authn Module for the client application
   * @param authBaseUrl Base URL where calls will be made to the auth server, for example 'api/auth'
   *                    or 'https://auth.example.com'
   * @param options Additional options, such as where authn token will be stored; default will be a cookie store.
   *                You can also provide your own authn id_token storage implementation
   */
  static forRoot(
    authBaseUrl: string,
    options: ClientOptions = { tokenStore: 'cookie' }
  ): ModuleWithProviders<KeratinAuthnModule> {
    let tokenStoreProvider: Provider = [];

    if (typeof options.tokenStore === 'string') {
      tokenStoreProvider = KeratinAuthnModule.clientStorageProviders(
        options.tokenStore
      );
    } else {
      tokenStoreProvider = {
        provide: KERATIN_ID_TOKEN_STORE,
        ...options.tokenStore
      };
    }

    return {
      ngModule: KeratinAuthnModule,
      providers: [
        { provide: KERATIN_BASE_URL, useValue: authBaseUrl },
        tokenStoreProvider
      ]
    };
  }

  /**
   * Initializes Keratin Authn Module for use with Angular SSR capable server
   *
   * Keep in mind that you will also need to provide the cookies from the request as a provider, so that
   * the server side can render the application if user is authenticated or has an expired id_token but still
   * valid session token.
   *
   * @param authBaseUrl Base URL where calls will be made to the auth server, for example 'api/auth'
   *                    or 'http://authn-server'
   * @param options Additional options, such as where authn token will be stored; default will be a cookie store.
   *                You can also provide your own authn id_token storage implementation
   */
  static forServerRoot(
    authBaseUrl: string,
    options: ServerOptions = { tokenStore: 'request-cookie' }
  ): ModuleWithProviders<KeratinAuthnModule> {
    let tokenStoreProvider: Provider = [];

    if (typeof options.tokenStore === 'string') {
      tokenStoreProvider = KeratinAuthnModule.serverStorageProviders(
        options.tokenStore
      );
    } else {
      tokenStoreProvider = {
        provide: KERATIN_ID_TOKEN_STORE,
        ...options.tokenStore
      };
    }

    return {
      ngModule: KeratinAuthnModule,
      providers: [
        { provide: KERATIN_BASE_URL, useValue: authBaseUrl },
        {
          provide: KERATIN_REFRESH_TOKEN_COOKIE_NAME,
          useValue: 'authn'
        },
        tokenStoreProvider
      ]
    };
  }

  /**
   * Returns needed Providers depending on which type of StorageStrategy was chosen.
   */
  private static clientStorageProviders(
    storage?: ClientStorageStrategy
  ): Provider[] {
    switch (storage) {
      case 'localStorage':
        throw new Error(`Storage type '${storage}' not supported yet.`);
      case 'cookie':
      default:
        return [
          {
            provide: KERATIN_ID_TOKEN_COOKIE_NAME,
            useValue: defaultIdTokenName
          },
          { provide: KERATIN_ID_TOKEN_STORE, useClass: CookieStorageService }
        ];
    }
  }

  /**
   * Returns needed Providers depending on which type of StorageStrategy was chosen.
   */
  private static serverStorageProviders(
    storage?: ServerStorageStrategy
  ): Provider[] {
    switch (storage) {
      case 'authorization-header':
        throw new Error(`Storage type '${storage}' not supported yet.`);
      case 'request-cookie':
      default:
        return [
          {
            // TODO: make configurable
            provide: KERATIN_ID_TOKEN_COOKIE_NAME,
            useValue: defaultIdTokenName
          },
          {
            provide: KERATIN_ID_TOKEN_STORE,
            useClass: SSRRequestCookieIdTokenStorage
          }
        ];
    }
  }
}
