import { Component, OnInit } from '@angular/core';
import { pokelist } from './pokelist';
import { Pokemonss } from './pokemon';
import { Film } from './Film';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  template: '<h1>Liste de Pokémon</h1>',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ClientApp';
  pokemonList: Pokemonss[] = pokelist;
  selectedPokemon: Pokemonss | undefined;
  filmList: Film[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // console.table(this.pokemonList)
    //this.GetProducts();
  }
}
