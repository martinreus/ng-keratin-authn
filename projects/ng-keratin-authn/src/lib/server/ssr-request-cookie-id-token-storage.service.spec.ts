import { TestBed } from '@angular/core/testing';

import { SSRRequestCookieIdTokenStorage } from './ssr-request-cookie-id-token-storage.service';

describe('SSRRequestCookieIdTokenStorage', () => {
  let service: SSRRequestCookieIdTokenStorage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SSRRequestCookieIdTokenStorage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
