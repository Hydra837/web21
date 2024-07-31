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

  // selectPokemons(pokeid: string): void {
  //   const index: Pokemonss | undefined = this.pokemonList.find(pokemon => pokemon.id == +pokeid);
  //   if (index) {
  //     console.log(`Vous avez cliqué sur le Pokémon ${index.name}`);
  //   } else {
  //     console.log("Le Pokémon que vous avez sélectionné n'existe pas");
  //   }
  // }

  // GetProducts(): void {
  //   this.http.get<Film[]>('https://localhost:7061/api/Film/GetAll')
  //     .subscribe({
  //       next: (data: Film[]) => {
  //         this.filmList = data;
  //         console.log('Films chargés :', this.filmList);
  //       },
  //       error: (error) => {
  //         console.error('Une erreur est survenue lors du chargement des films :', error);
  //       }
  //     });
  //}
}
