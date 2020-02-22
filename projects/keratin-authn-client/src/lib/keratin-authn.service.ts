import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { IdTokenStorageService } from './models';

@Injectable({
  providedIn: 'root'
})
export class KeratinAuthnService {
  constructor(
    private api: ApiService,
    private idTokenStorage: IdTokenStorageService
  ) {}
}
