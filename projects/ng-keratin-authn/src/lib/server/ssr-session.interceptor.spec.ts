import { TestBed } from '@angular/core/testing';

import { SsrSessionInterceptor } from './ssr-session.interceptor';

describe('SsrSessionInterceptor', () => {
  let service: SsrSessionInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SsrSessionInterceptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
