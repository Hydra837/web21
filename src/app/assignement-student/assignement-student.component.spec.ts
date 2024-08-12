import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignementStudentComponent } from './assignement-student.component';

describe('AssignementStudentComponent', () => {
  let component: AssignementStudentComponent;
  let fixture: ComponentFixture<AssignementStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignementStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignementStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
