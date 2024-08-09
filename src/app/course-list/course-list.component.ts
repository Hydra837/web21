import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Course } from '../Models/courseModel';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']  // Correction ici : styleUrls au lieu de styleUrl.
})
export class CourseListComponent implements OnInit {
  @Input() courses: Course[] = [];
  @Output() courseSelected = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {}

  onSelectCourse(courseId: number): void {
    this.courseSelected.emit(courseId);  // Correction ici : Fermeture de la méthode.
  }
}
