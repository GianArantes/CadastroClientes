import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoComp } from './produto-comp';

describe('ProdutoComp', () => {
  let component: ProdutoComp;
  let fixture: ComponentFixture<ProdutoComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdutoComp],
    }).compileComponents();

    fixture = TestBed.createComponent(ProdutoComp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
