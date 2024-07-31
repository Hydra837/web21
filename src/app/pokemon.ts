
export class Pokemonss {
    id: number; 
    name: string;
    hp: number;
    cp: number;
    picture : string
    type: Array<string>;
    created: Date;

    constructor(id: number, name: string, hp: number, cp: number, picture: string, type: Array<string>, created: Date) {
        this.id = id;
        this.name = name;
        this.hp = hp;
        this.cp = cp;
        this.picture = picture;
        this.type = type;
        this.created = created;
    }
}