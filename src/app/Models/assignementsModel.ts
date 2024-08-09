export interface AssignementsDTO {
    id: number;
    description?: string; // Nullable to match the C# nullable string
    coursId?: number; // Nullable to match the C# nullable int
    isAvailable?: boolean; // Nullable to match the C# nullable bool
   // cours?: CoursDTO; // DTO for course
    //grades?: GradeDTO[]; // DTO for grades
  }
  
  export interface AssignementsFORM {
    description: string; // Required in form
    coursId: number; // Required in form
    isAvailable?: boolean; // Optional in form
  }