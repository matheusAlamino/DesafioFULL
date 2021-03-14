import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineStatusComponent } from './timeline-status.component';

describe('TimelineStatusComponent', () => {
  let component: TimelineStatusComponent;
  let fixture: ComponentFixture<TimelineStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimelineStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
