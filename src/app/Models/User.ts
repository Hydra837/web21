import { CourseUser } from "./courseModel";

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
  export interface UserCours {
    id: number;
    nom: string;
    prenom: string;
    role: string;
    password: string;
    pseudo: string; 
    mail: string; 
    //salt: string;
    cours: CourseUser[];
  }
  export interface UserUpdateFORM {
  
    nom: string;
    prenom: string;
    pseudo: string; 
    mail: string
    
  }