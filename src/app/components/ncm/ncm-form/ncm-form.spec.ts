import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NcmForm } from './ncm-form';

describe('NcmForm', () => {
  let component: NcmForm;
  let fixture: ComponentFixture<NcmForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NcmForm],
    }).compileComponents();

    fixture = TestBed.createComponent(NcmForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
