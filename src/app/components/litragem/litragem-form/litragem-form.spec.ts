import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LitragemForm } from './litragem-form';

describe('LitragemForm', () => {
  let component: LitragemForm;
  let fixture: ComponentFixture<LitragemForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LitragemForm],
    }).compileComponents();

    fixture = TestBed.createComponent(LitragemForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
