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

  constructor(private courseService: CourseService, private router: Router) { }

  ngOnInit(): void { }

  searchCourses(): void {
    this.courseService.searchCourses(this.searchTerm).subscribe({
      next: (data: Course[]) => {
        this.courses = data;
      },
      error: (error: any) => {
        console.error('Error searching courses:', error);
      }
    });
  }

  viewCourseDetail(courseId: number | undefined): void {
    if (courseId !== undefined) {
      this.router.navigate(['/course-detail', courseId]);
    } else {
      console.error('Course ID is undefined');
    }
  }
}
