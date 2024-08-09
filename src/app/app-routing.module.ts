import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseCatalogComponent } from './course-catalog/course-catalog.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { CoursesComponent } from './courses/courses.component';
import { StudentManagementComponent } from './student-management/student-management.component';
import { UserSearchComponent } from './user-search/user-search.component'; // Importer le composant
import { CourseSearchComponent } from './course-search/course-search.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AssignementsComponent } from './assignements/assignements.component'; // Importer le composant Assignements

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'course-catalog', component: CourseCatalogComponent },
  { path: 'course-detail/:id', component: CourseDetailComponent },
  { path: 'courses', component: CoursesComponent },
  { path: 'student-management', component: StudentManagementComponent },
  { path: 'user-search', component: UserSearchComponent },
  { path: 'course-search', component: CourseSearchComponent },
  { path: 'assignments/:courseId', component: AssignementsComponent }, // Nouvelle route pour AssignementsComponent
  { path: '', redirectTo: '/course-catalog', pathMatch: 'full' },
  { path: '**', redirectTo: '/course-catalog' } // Route de redirection pour les URL non reconnues
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
