// course-search.component.ts
import { Component, OnInit } from '@angular/core';
import { CourseService } from '../services/course.service';
import { Router } from '@angular/router';
import { Course } from '../Models/courseModel';

@Component({
  selector: 'app-course-search',
  templateUrl: './course-search.component.html',
  styleUrls: ['./course-search.component.css']
})
export class CourseSearchComponent implements OnInit {
  searchTerm: string = '';
  courses: Course[] = [];
  isLoading: boolean = false; // Ajouté pour gérer l'état de chargement

  constructor(private courseService: CourseService, private router: Router) { }

  ngOnInit(): void { }

  searchCourses(): void {
    if (this.searchTerm.trim()) { // Vérifiez si le terme de recherche n'est pas vide
      this.isLoading = true; // Activer l'état de chargement
      this.courseService.searchCourses(this.searchTerm).subscribe({
        next: (data: Course[]) => {
          this.courses = data;
          this.isLoading = false; // Désactiver l'état de chargement
        },
        error: (error: any) => {
          console.error('Error searching courses:', error);
          this.isLoading = false; // Désactiver l'état de chargement même en cas d'erreur
        }
      });
    } else {
      this.courses = []; // Réinitialiser les résultats si le terme de recherche est vide
    }
  }

  viewCourseDetail(courseId: number | undefined): void {
    if (courseId !== undefined) {
      this.router.navigate(['/course-detail', courseId]);
    } else {
      console.error('Course ID is undefined');
    }
  }
}
