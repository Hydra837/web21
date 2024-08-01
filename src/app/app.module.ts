import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';  // Import the necessary functions

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
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

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
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule  // Add HttpClientModule to imports
  ],
  providers: [
    CourseService,
    UserService,
    DashboardService, 
    provideHttpClient(),
    provideHttpClient(withFetch()),
    provideAnimationsAsync()  // Configure HttpClient to use fetch
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
