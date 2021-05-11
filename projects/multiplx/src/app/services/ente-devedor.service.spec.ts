import { TestBed } from '@angular/core/testing';

import { EnteDevedorService } from './ente-devedor.service';

describe('EnteDevedorService', () => {
  let service: EnteDevedorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnteDevedorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
