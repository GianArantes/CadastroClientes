import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioComp } from './usuario-comp';

describe('UsuarioComp', () => {
  let component: UsuarioComp;
  let fixture: ComponentFixture<UsuarioComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioComp],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuarioComp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
