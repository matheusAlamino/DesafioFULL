import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessFileListComponent } from './list.component';

describe('ListFilesComponent', () => {
  let component: ProcessFileListComponent;
  let fixture: ComponentFixture<ProcessFileListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessFileListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessFileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
