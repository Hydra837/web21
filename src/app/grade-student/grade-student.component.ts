import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GradeService } from '../grade.service';
import { AssignementsService } from '../assignements.service';
import { Grade } from '../Models/GradeModel';
import { Course } from '../Models/courseModel';
import { AssignementsDTO } from '../Models/assignementsModel';
import { CourseDetailComponent } from '../course-detail/course-detail.component';

@Component({
  selector: 'app-grade-student',
  templateUrl: './grade-student.component.html',
  styleUrls: ['./grade-student.component.css']
})
export class GradeStudentComponent implements OnInit {
  grade: Grade | undefined;
  assignment: AssignementsDTO | undefined;
  errorMessage: string = '';
  assignmentId: number | undefined;
  userId: number | undefined;
  courses: Course[] = [];

  constructor(
    private route: ActivatedRoute,
    private gradeService: GradeService,
    private assignementsService: AssignementsService
  ) {}

  ngOnInit(): void {
    this.assignmentId = +this.route.snapshot.paramMap.get('assignmentId')!;
    this.userId = +this.route.snapshot.paramMap.get('userId')!;
    
    if (this.assignmentId && this.userId) {
      this.loadGrade();
      this.loadAssignment();
    } else {
      this.errorMessage = 'ID d\'assignement ou ID utilisateur manquant.';
    }
  }

  loadGrade(): void {
    if (this.assignmentId && this.userId) {
      this.gradeService.getGradeByUserId(this.userId, this.assignmentId).subscribe(
        grade => {
          this.grade = grade;
        },
        error => {
          this.errorMessage = 'Erreur lors de la récupération des notes.';
        }
      );
    }
  }
  getCourseName(courseId: number): string {
    const course = this.courses.find(c => c.id === courseId);
    return course ? course.Nom : 'Course Unknown';
  }
  
  loadAssignment(): void {
    if (this.assignmentId) {
      this.assignementsService.getById(this.assignmentId).subscribe(
        assignment => {
          this.assignment = assignment;
        },
        error => {
          this.errorMessage = 'Erreur lors de la récupération des devoirs.';
        }
      );
    }
  }
}
