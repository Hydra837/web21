export interface Course {
//assignments: any;
  id?: number;
  Nom: string;
  description?: string;
  dateDebut?: Date;
  dateFin?: Date;
  available: boolean;
  professeurId: number;

  }
  export interface CourseUser {
    //assignments: any;
      id?: number;
      Nom: string;
      description?: string;
      dateDebut?: Date;
      dateFin?: Date;
      available: boolean;
      professeurId: number;
      usersModels: any;

      
      }
  