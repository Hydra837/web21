import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from '../services/course.service';
import { Course } from '../Models/courseModel'; 
import { GetAllCoursForEachUsers } from '../Models/GetAllCoursForEachUsers'; 
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courses: Course[] = []; 
  newCourse: Course = {} as Course; 
  errorMessage: string = '';
  courseUser: GetAllCoursForEachUsers[] = []; 

  constructor(private courseService: CourseService, private router: Router) { }

  ngOnInit(): void {
    this.loadCourses();
    this.getCoursEachUser();
  }

  loadCourses(): void {
    this.courseService.getCourses().pipe(
      catchError(error => {
        this.errorMessage = 'Erreur lors du chargement des cours.';
        console.error('Erreur lors du chargement des cours:', error);
        return of([]); 
      })
    ).subscribe(data => {
      this.courses = data;
    });
  }

  getCoursEachUser(): void {
    this.courseService.getAllCoursesForEachUsers().pipe(
      catchError(error => {
        this.errorMessage = 'Erreur lors de la récupération des cours pour chaque utilisateur.';
        console.error('Erreur lors de la récupération des cours pour chaque utilisateur:', error);
        return of([]); 
      })
    ).subscribe(data => {
      this.courseUser = data;
    });
  }

  createCourse(): void {
    this.courseService.createCourse(this.newCourse).pipe(
      catchError(error => {
        this.errorMessage = 'Erreur lors de la création du cours.';
        console.error('Erreur lors de la création du cours:', error);
        return of(null); 
      })
    ).subscribe(() => {
      this.loadCourses();
      this.newCourse = {} as Course; 
    });
  }

  updateCourse(id: number | undefined): void {
    if (id !== undefined) {
      this.router.navigate(['/update-course-admin', id.toString()]);
    } else {
      this.errorMessage = 'ID du cours est introuvable.';
    }
  }

  deleteCourse(id: number | undefined): void {
    if (id !== undefined) {
      this.router.navigate(['/delete-user-admin', id.toString()]);
    } else {
      this.errorMessage = 'ID du cours est introuvable.';
    }
  }
}
