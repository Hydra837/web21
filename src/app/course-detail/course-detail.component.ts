import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../services/course.service';
import { StudentEnrollmentService } from '../services/student-enrollement.service';
import { Course } from '../Models/courseModel';
import { User } from '../Models/User'; // Assuming you have a User model

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
  course: Course | null = null; // Initially null to handle loading state
  enrolledUsers: User[] = []; // To store the list of enrolled users
  errorMessage: string | null = null;

  constructor(
    private courseService: CourseService,
    private studentEnrollmentService: StudentEnrollmentService,
    private route: ActivatedRoute // To get the course ID from the URL
  ) { }

  ngOnInit(): void {
    // Get the course ID from the URL parameters
    this.route.paramMap.subscribe(params => {
      const courseId = +params.get('id')!;
      this.getCourseById(courseId);
      this.getAllUsersByCourse(courseId);
    });
  }

  getCourseById(id: number): void {
    this.courseService.getCourseById(id).subscribe({
      next: (course: Course) => {
        console.log(course); // Check the data received
        this.course = course;
      },
      error: (err: any) => {
        this.errorMessage = 'Error fetching course details.';
        console.error(err);
      }
    });
  }

  getAllUsersByCourse(id: number): void {
    this.studentEnrollmentService.getAllUserByCourse(id).subscribe({
      next: (users: User[]) => {
        console.log(users); // Check the data received
        this.enrolledUsers = users;
      },
      error: (err: any) => {
        this.errorMessage = 'Error fetching enrolled users.';
        console.error(err);
      }
    });
  }
}
