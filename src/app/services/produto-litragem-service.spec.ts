import { TestBed } from '@angular/core/testing';

import { ProdutoLitragemService } from './produto-litragem-service';

describe('ProdutoLitragemService', () => {
  let service: ProdutoLitragemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProdutoLitragemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
