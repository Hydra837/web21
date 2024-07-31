import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { mapToCourseModel } from '../Outils/mapper'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userRole!: string;
  courses: any[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    let user = JSON.parse(localStorage.getItem('user')!);

    if (!user) {
      // Default user for testing purposes
      user = { id: 1, role: 'student' };
      localStorage.setItem('user', JSON.stringify(user));
    }

    this.userRole = user.role;

    if (this.userRole === 'student') {
      this.getEnrolledCourses();
    } else if (this.userRole === 'professor') {
      this.getTeachingCourses();
    } else if (this.userRole === 'admin') {
      this.getAllCourses();
    }
  }

  getEnrolledCourses() {
    this.dashboardService.getEnrolledCourses().subscribe(data => this.courses = data);
  }

  getTeachingCourses() {
    this.dashboardService.getTeachingCourses().subscribe(data => this.courses = data);
  }

  getAllCourses() {
    this.dashboardService.getAllCourses().subscribe(data => this.courses = data);
  }
}
