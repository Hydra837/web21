import { Component } from '@angular/core';
import { Course } from '../Models/courseModel';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent 
{courses: Course[] = [];
  studentId = 4; // Remplacez par l'ID de l'étudiant

  constructor(private studentService: StudentService) { }

  ngOnInit(): void {
    this.studentService.getCoursesWithAssignmentsAndGrades(this.studentId).subscribe(
      courses => this.courses = courses,
      error => console.error('Erreur lors de la récupération des cours', error)
    );
  }

}
