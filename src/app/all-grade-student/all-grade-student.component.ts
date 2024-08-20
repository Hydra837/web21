import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentManagementService } from '../student-management.service';
import { UserAssignment } from '../Models/UserAssignement';

@Component({
  selector: 'app-all-grade-student',
  templateUrl: './all-grade-student.component.html',
  styleUrls: ['./all-grade-student.component.css']
})
export class AllGradeStudentComponent implements OnInit {
  userAssignments: UserAssignment[] = [];
  errorMessage: string = '';

  constructor(
    private studentManagementService: StudentManagementService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = +params['userId']; // Utilisez l'ID depuis les paramètres d'URL
      if (userId) {
        this.fetchUserAssignments(userId);
      }
    });
  }

  private fetchUserAssignments(userId: number): void {
    this.studentManagementService.getUserAssignments(userId).subscribe({
      next: (assignments) => {
        this.userAssignments = assignments;
      },
      error: (err) => {
        console.error('Failed to fetch assignments:', err);
        this.errorMessage = 'Failed to fetch assignments.';
      }
    });
  }
}
