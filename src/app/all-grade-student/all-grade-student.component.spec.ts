import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllGradeStudentComponent } from './all-grade-student.component';

describe('AllGradeStudentComponent', () => {
  let component: AllGradeStudentComponent;
  let fixture: ComponentFixture<AllGradeStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllGradeStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllGradeStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
