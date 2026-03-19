import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientComp } from './client-comp';

describe('ClientComp', () => {
  let component: ClientComp;
  let fixture: ComponentFixture<ClientComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientComp],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientComp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
