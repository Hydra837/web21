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
import { EnrollStudentComponent } from './enroll-student/enroll-student.component';
import { RoleGuard } from './shared/roleguard'; // Assurez-vous du chemin correct
import { authGuard } from './shared/auth.guard'; // Assurez-vous du chemin correct
import { AssignementStudentComponent } from './assignement-student/assignement-student.component';
import { EnrollteacherComponent } from './enrollteacher/enrollteacher.component';
import { EnrolledCourseTeacherComponent } from './enrolled-course-teacher/enrolled-course-teacher.component';
import { EnrolledcourseComponent } from './enrolledcourse/enrolledcourse.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent }, // canActivate: [authGuard] }, // Protégé par authGuard
  { path: 'course-catalog', component: CourseCatalogComponent },
  { path: 'assignement-student '/*:userId/:courseId */, component: AssignementStudentComponent },
  { path: 'course-detail/:id', component: CourseDetailComponent },
  { path: 'courses', component: CoursesComponent }, //, canActivate: [RoleGuard], data: { role: 'Admin' } }, // Protégé par RoleGuard
  { path: 'student-management', component: StudentManagementComponent },//, canActivate: [RoleGuard], data: { role: 'Admin' } }, // Protégé par RoleGuard
  { path: 'user-search', component: UserSearchComponent }, //, canActivate: [RoleGuard], data: { role: 'Admin' } }, // Protégé par RoleGuard
  { path: 'course-search', component: CourseSearchComponent },
  { path: 'assignments/:courseId', component: AssignementsComponent },//, canActivate: [RoleGuard], data: { role: 'Professeur' } }, // Protégé par RoleGuard
  { path: 'enroll-student', component: EnrollStudentComponent },
  { path: 'enrollteacher', component: EnrollteacherComponent },//, canActivate: [RoleGuard], data: { role: 'Admin' } }, // Protégé par RoleGuard
  { path: 'courses-teacher', component: EnrolledCourseTeacherComponent },
  { path: 'enrolled-courses', component: EnrolledcourseComponent },
  { path: '', redirectTo: '/course-catalog', pathMatch: 'full' },
  { path: '**', redirectTo: '/course-catalog' } // Route de redirection pour les URL non reconnues
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
