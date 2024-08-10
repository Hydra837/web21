export interface Grade {
    id: number;
    userId: number;
    assignementsId: number;
    grade: number;
   // dateRecorded: Date;
  }
  export interface GradeDTO {
    id: number;
    grade: number;
    userId: number;
    assignementsId: number;
  }
  
  