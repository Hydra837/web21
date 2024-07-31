import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Film } from './Film';

@Injectable({
  providedIn: 'root'
})
export class Film1Service {
  private apiUrl = 'https://localhost:7061/api/Film/GetAll';

  constructor(private http: HttpClient) { }

  getFilms(): Observable<Array<Film>> {
    // Utilisation correcte de return pour retourner l'observable
    return this.http.get<Film[]>(this.apiUrl);
  }
}
