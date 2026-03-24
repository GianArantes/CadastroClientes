import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NcmComp } from './ncm-comp';

describe('NcmComp', () => {
  let component: NcmComp;
  let fixture: ComponentFixture<NcmComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NcmComp],
    }).compileComponents();

    fixture = TestBed.createComponent(NcmComp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
