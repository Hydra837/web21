import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../services/course.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Course } from '../Models/courseModel';

@Component({
  selector: 'app-enrolled-course-teacher',
  templateUrl: './enrolled-course-teacher.component.html',
  styleUrls: ['./enrolled-course-teacher.component.css']
})
export class EnrolledCourseTeacherComponent implements OnInit {
  courses: Course[] = []; // Utilisation directe de Course[]
  teacherId: number | undefined;
  cc: string | null= '';

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('teacherId');
      this.cc = id;

      if (id) {
        this.teacherId = +id;
        this.getCourses(this.teacherId);
      }
    });
  }

  getCourses(teacherId: number): void {
    this.courseService.getCoursesByTeacher(teacherId).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des cours', error);
        return of([]); 
      })
    ).subscribe(courses => {
      this.courses = courses; // Assignation directe au tableau de cours
    });
  }
}
