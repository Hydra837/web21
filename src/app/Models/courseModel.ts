export interface Course {
  id?: number;
  Nom: string;
  description?: string;
  dateDebut?: Date;
  dateFin?: Date;
  available: boolean;
  professeurId: number;
  }
  