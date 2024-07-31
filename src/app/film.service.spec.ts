import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'  // Ce service sera disponible dans toute l'application
})
export class FilmService {
  private apiUrl = 'https://localhost:7061/api/Film/GetAll';

  constructor(private http: HttpClient) { }

  getFilms(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
