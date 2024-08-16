import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseCatalogComponent } from './course-catalog/course-catalog.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { CoursesComponent } from './courses/courses.component';
import { StudentManagementComponent } from './student-management/student-management.component';
import { UserSearchComponent } from './user-search/user-search.component'; 
import { CourseSearchComponent } from './course-search/course-search.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AssignementsComponent } from './assignements/assignements.component';
import { EnrollStudentComponent } from './enroll-student/enroll-student.component';
import { RoleGuard } from './shared/roleguard'; 
import { authGuard } from './shared/auth.guard'; 
import { AssignementStudentComponent } from './assignement-student/assignement-student.component';
import { EnrollteacherComponent } from './enrollteacher/enrollteacher.component';
import { EnrolledCourseTeacherComponent } from './enrolled-course-teacher/enrolled-course-teacher.component';
import { EnrolledcourseComponent } from './enrolledcourse/enrolledcourse.component';
import { LoginComponent } from './login/login.component';
import { DelEnrollementComponent } from './del-enrollement/del-enrollement.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent }, //, canActivate: [authGuard] },
  { path: 'course-catalog', component: CourseCatalogComponent },
  { path: 'assignement-student', component: AssignementStudentComponent }, //, canActivate: [authGuard] },
  { path: 'course-detail/:id', component: CourseDetailComponent },
  { path: 'del-enrollement', component: DelEnrollementComponent }, //, canActivate: [authGuard] },
  { path: 'courses', component: CoursesComponent }, //, canActivate: [RoleGuard], data: { roles: ['Admin'] } },
  { path: 'student-management', component: StudentManagementComponent }, //, canActivate: [RoleGuard], data: { roles: ['Admin'] } },
  { path: 'user-search', component: UserSearchComponent }, //, canActivate: [RoleGuard], data: { roles: ['Admin'] } },
  { path: 'course-search', component: CourseSearchComponent }, //, canActivate: [authGuard] },
  { path: 'assignments/:courseId', component: AssignementsComponent },//, canActivate: [RoleGuard], data: { roles: ['Professeur', 'Admin'] } },
  { path: 'enroll-student', component: EnrollStudentComponent }, //, canActivate: [authGuard] },
  { path: 'enrollteacher', component: EnrollteacherComponent }, //, canActivate: [RoleGuard], data: { roles: ['Admin'] } },
  { path: 'courses-teacher', component: EnrolledCourseTeacherComponent },// canActivate: [authGuard] },
  { path: 'enrolled-courses', component: EnrolledcourseComponent } ,// canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/course-catalog', pathMatch: 'full' },
  { path: '**', redirectTo: '/course-catalog' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
