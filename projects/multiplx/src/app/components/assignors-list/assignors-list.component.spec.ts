import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignorsListComponent } from './assignors-list.component';

describe('AssignorsListComponent', () => {
  let component: AssignorsListComponent;
  let fixture: ComponentFixture<AssignorsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignorsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignorsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
