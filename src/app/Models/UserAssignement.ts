export interface UserAssignment {
  // coursId?: number; // If you decide to include the course ID
  nom: string;
  prenom: string;
  coursName: string;
  assignementTitle: string | null;
  grade: number | null;
}
