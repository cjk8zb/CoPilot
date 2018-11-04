import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyLandingComponent } from './emergency-landing.component';

describe('EmergencyLandingComponent', () => {
  let component: EmergencyLandingComponent;
  let fixture: ComponentFixture<EmergencyLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmergencyLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmergencyLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
