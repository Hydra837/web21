import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolledCourseTeacherComponent } from './enrolled-course-teacher.component';

describe('EnrolledCourseTeacherComponent', () => {
  let component: EnrolledCourseTeacherComponent;
  let fixture: ComponentFixture<EnrolledCourseTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnrolledCourseTeacherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrolledCourseTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
