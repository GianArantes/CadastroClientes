import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaComp } from './categoria-comp';

describe('CategoriaComp', () => {
  let component: CategoriaComp;
  let fixture: ComponentFixture<CategoriaComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriaComp],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriaComp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
