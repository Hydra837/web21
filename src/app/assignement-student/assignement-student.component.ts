import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssignementsService } from '../assignements.service';
import { GradeService } from '../grade.service';
import { CourseService } from '../services/course.service';
import { AssignementsDTO } from '../Models/assignementsModel';
import { GradeDTO } from '../Models/GradeModel';
import { Course } from '../Models/courseModel';

@Component({
  selector: 'app-assignement-student',
  templateUrl: './assignement-student.component.html',
  styleUrls: ['./assignement-student.component.css']
})
export class AssignementStudentComponent implements OnInit {
  assignments: AssignementsDTO[] = [];
  courses: Course[] = [];
  grades: { [key: number]: GradeDTO[] } = {}; // Dictionary to hold grades by course ID
  userId: number | undefined = 1;
  courseId: number | undefined;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private assignementsService: AssignementsService,
    private gradeService: GradeService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.courseId = +this.route.snapshot.paramMap.get('courseId')!;
    if (this.userId && this.courseId) {
      this.loadAssignments();
      this.loadCourses();
    } else {
      this.errorMessage = 'ID utilisateur ou cours manquant.';
    }
  }

  loadAssignments(): void {
    if (this.courseId) {
      this.assignementsService.getByCourse(this.courseId).subscribe(assignments => {
        this.assignments = assignments;
        this.loadGrades();
      }, error => {
        this.errorMessage = 'Erreur lors de la récupération des devoirs.';
      });
    }
  }

  loadGrades(): void {
    if (this.userId && this.courseId) {
      this.gradeService.getGradesByUserAndCourse(this.userId, this.courseId).subscribe(grades => {
        this.grades[this.courseId!] = grades;
      }, error => {
        this.errorMessage = 'Erreur lors de la récupération des notes.';
      });
    }
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe(courses => {
      this.courses = courses;
    }, error => {
      this.errorMessage = 'Erreur lors de la récupération des cours.';
    });
  
  }
  getCourseName(courseId: number): string {
    const course = this.courses.find(c => c.id === courseId);
    return course ? course.Nom : 'Course Unknown';
  }
}
