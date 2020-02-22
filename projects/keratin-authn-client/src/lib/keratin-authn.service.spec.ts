import { TestBed } from '@angular/core/testing';

import { KeratinAuthnService } from './keratin-authn.service';

describe('KeratinAuthnService', () => {
  let service: KeratinAuthnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeratinAuthnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
