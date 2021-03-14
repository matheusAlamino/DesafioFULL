import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientFileListComponent } from './list.component';

describe('ListFilesComponent', () => {
  let component: ClientFileListComponent;
  let fixture: ComponentFixture<ClientFileListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientFileListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientFileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
