import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LitragemComp } from './litragem-comp';

describe('LitragemComp', () => {
  let component: LitragemComp;
  let fixture: ComponentFixture<LitragemComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LitragemComp],
    }).compileComponents();

    fixture = TestBed.createComponent(LitragemComp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
