import { TestBed } from '@angular/core/testing';

import { AuthnSessionService } from './authn-session.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthnApiService } from './authn-api.service';

fdescribe('AuthnSessionService', () => {
  let service: AuthnSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: AuthnApiService, useClass: jasmine.createSpy() }]
    });
    service = TestBed.inject(AuthnSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
