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
  courses$: Observable<Course[]> | undefined;
  teacherId: number | undefined;

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('teacherId');
      if (id) {
        this.teacherId = +id; // Convertir l'ID en nombre
        this.courses$ = this.courseService.getCoursesByTeacher(this.teacherId).pipe(
          catchError(error => {
            console.error('Erreur lors de la récupération des cours', error);
            return of([]); // Retourner une liste vide en cas d'erreur
          })
        );
      }
    });
  }
}
