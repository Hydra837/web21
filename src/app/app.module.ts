import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';  // Import HttpClientModule
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PokemonsComponent } from './pokemons/pokemons.component';
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
import { JwtInterceptor, JwtModule } from '@auth0/angular-jwt';  // Importez JwtModule
//import { AuthInterceptor } from './auth.interceptor';  // Importez votre intercepteur d'authentification
//import { authentication } from './authentication.service';
export function tokenGetter() {
  return sessionStorage.getItem('jwt');
}
@NgModule({
  declarations: [
    AppComponent,
    PokemonsComponent,
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
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,  // Add HttpClientModule to imports
    MatListModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule, 
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:3000'],  // Remplacez par les domaines autorisés pour les requêtes avec JWT
        disallowedRoutes: ['http://localhost:3000/api/auth/login'],  // Routes pour lesquelles le token ne doit pas être envoyé
      },
    }),
  ],
  providers: [
    CourseService,
    UserService,
    DashboardService, 
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
