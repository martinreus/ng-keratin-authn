import { TestBed } from '@angular/core/testing';

import { InMemoryIdTokenStorage } from './ssr-in-memory-id-token-storage.service';

describe('InMemoryIdTokenStorage', () => {
  let service: InMemoryIdTokenStorage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InMemoryIdTokenStorage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
