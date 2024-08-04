export interface User {
    id: number;
    nom: string;
    prenom: string;
    role: string;
    password: string;
    pseudo: string; 
    mail: string; 
    //salt: string;
  }

  export interface UserFORM {
  
    nom: string;
    prenom: string;
    role: string;
    password: string;
    pseudo: string; 
    mail: string
    
  }
  