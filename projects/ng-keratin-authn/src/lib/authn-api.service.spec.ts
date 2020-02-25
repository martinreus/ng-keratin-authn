import { TestBed } from '@angular/core/testing';

import { AuthnApiService } from './authn-api.service';

describe('AuthnApiService', () => {
  let service: AuthnApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthnApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
