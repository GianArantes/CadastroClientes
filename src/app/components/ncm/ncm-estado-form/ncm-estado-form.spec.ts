import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NcmEstadoForm } from './ncm-estado-form';

describe('NcmEstadoForm', () => {
  let component: NcmEstadoForm;
  let fixture: ComponentFixture<NcmEstadoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NcmEstadoForm],
    }).compileComponents();

    fixture = TestBed.createComponent(NcmEstadoForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
