import { TestBed } from '@angular/core/testing';

import { JwtTokenParserService } from './jwt-token-parser.service';

describe('JwtTokenParserService', () => {
  let service: JwtTokenParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JwtTokenParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
