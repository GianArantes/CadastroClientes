import { TestBed } from '@angular/core/testing';

import { NcmEstadoService } from './ncm-estado-service';

describe('NcmEstadoService', () => {
  let service: NcmEstadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NcmEstadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
