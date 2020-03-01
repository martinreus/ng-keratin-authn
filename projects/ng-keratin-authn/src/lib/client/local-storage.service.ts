import { Injectable, Inject } from '@angular/core';
import { IdTokenStorageService, Token } from '../models';
import { KERATIN_ID_TOKEN_STORE_KEY } from '../injection-tokens';

@Injectable()
export class LocalStorageService implements IdTokenStorageService {
  constructor(@Inject(KERATIN_ID_TOKEN_STORE_KEY) private storeKey: string) {
    console.log('local storage started');
  }

  store(token: Token) {
    localStorage.setItem(this.storeKey, token.id_token);
  }

  retrieve(): Token | null {
    const idToken = localStorage.getItem(this.storeKey);
    return idToken ? { id_token: idToken } : null;
  }

  delete() {
    localStorage.removeItem(this.storeKey);
  }
}
