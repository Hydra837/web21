import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { CourseCatalogComponent } from './course-catalog/course-catalog.component';
import { CourseService } from './services/course.service';
import { UserService } from './user.service';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { StudentManagementComponent } from './student-management/student-management.component';
import { CoursesComponent } from './courses/courses.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { DashboardService } from './dashboard.service';
import { NavbarStudentComponent } from './navbar-student/navbar-student.component';
import { NavbarAdminComponent } from './navbar-admin/navbar-admin.component';
import { NavbarProfesseurComponent } from './navbar-professeur/navbar-professeur.component';
import { NavbarComponent } from './navbar/navbar.component';
import { GradeComponent } from './grade/grade.component';
import { SearchComponent } from './search/search.component';
import { CourseSearchComponent } from './course-search/course-search.component';
import { StudentSearchComponent } from './student-search/student-search.component';
import { ProfesseurSearchComponent } from './professeur-search/professeur-search.component';
import { UserSearchComponent } from './user-search/user-search.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { UserSelectionDialogComponent } from './user-selection-dialog/user-selection-dialog.component';
import { EnrollteacherComponent } from './enrollteacher/enrollteacher.component';
import { LoginComponent } from './login/login.component';
import { JwtModule } from '@auth0/angular-jwt';
import { CourseListComponent } from './course-list/course-list.component';
import { AddCourseComponent } from './add-course/add-course.component';
import { AssignementsComponent } from './assignements/assignements.component';
import { AssignementsService } from './assignements.service';
import { GradeService } from './grade.service';
import { EnrolledUsersComponent } from './enrolled-users/enrolled-users.component';
import { EnrolledcourseComponent } from './enrolledcourse/enrolledcourse.component';
import { EnrollStudentComponent } from './enroll-student/enroll-student.component';
import { AssignementStudentComponent } from './assignement-student/assignement-student.component';
import { EnrolledCourseTeacherComponent } from './enrolled-course-teacher/enrolled-course-teacher.component';
import { ManageEnrollementComponent } from './manage-enrollement/manage-enrollement.component';
import { AuthInterceptor } from './interceptors/auth.interceptor'; // Importez votre AuthInterceptor
import { UserInfoComponent } from './user-info/user-info.component';
import { DelEnrollementComponent } from './del-enrollement/del-enrollement.component';

// Fonction pour obtenir le token
export function tokenGetter() {
  return sessionStorage.getItem('jwt');
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CourseCatalogComponent,
    CourseDetailComponent,
    StudentManagementComponent,
    CoursesComponent,
    DashboardAdminComponent,
    NavbarStudentComponent,
    NavbarAdminComponent,
    NavbarProfesseurComponent,
    NavbarComponent,
    GradeComponent,
    SearchComponent,
    CourseSearchComponent,
    StudentSearchComponent,
    ProfesseurSearchComponent,
    UserSearchComponent,
    ConfirmDialogComponent,
    UserSelectionDialogComponent,
    EnrollteacherComponent,
    LoginComponent,
    CourseListComponent,
    AddCourseComponent,
    AssignementsComponent,
    EnrolledUsersComponent,
    EnrolledcourseComponent,
    EnrollStudentComponent,
    AssignementStudentComponent,
    EnrolledCourseTeacherComponent,
    ManageEnrollementComponent,
    UserInfoComponent,
    DelEnrollementComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,  // Ajoutez HttpClientModule
    MatListModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:4200'],  // Remplacez par les domaines autorisés pour les requêtes avec JWT
        disallowedRoutes: ['http://localhost:7233/api/auth/login', 'https://localhost:7233/api/Authentication/login'],  // Routes pour lesquelles le token ne doit pas être envoyé
      },
    }),
  ],
  providers: [
    CourseService,
    UserService,
    DashboardService,
    AssignementsService,
    GradeService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, // Votre AuthInterceptor personnalisé
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
