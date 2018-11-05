import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirTrafficAwarenessComponent } from './air-traffic-awareness.component';

describe('AirTrafficAwarenessComponent', () => {
  let component: AirTrafficAwarenessComponent;
  let fixture: ComponentFixture<AirTrafficAwarenessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirTrafficAwarenessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirTrafficAwarenessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
