import { GetAllCoursForEachUsers } from "../Models/GetAllCoursForEachUsers";
import { User } from "../Models/User";
import { Course } from "../Models/courseModel";
//import { Grade } from "../models/grade.model";
import { Grade } from "../Models/GradeModel";
import { IterableDiffers } from "@angular/core";
import { AssignementsDTO, AssignementsFORM } from "../Models/assignementsModel";
import { data } from "jquery";
import { Login } from "../Models/Login";


export function mapToUserCourseDetailsData(data: any): GetAllCoursForEachUsers {
    return {
        userNom: data.userNom,
        userPrenom: data.userPrenom,
        coursNom: data.coursNom,
        disponible: data.disponible,
        profNom: data.profNom,
        profPrenom: data.profPrenom,
    };
}


export function mapToCourseModel(item: any): Course {
    return {
        id: item.id,
        Nom: item.Nom,
        description: item.description,
        dateDebut: new Date(item.dateDebut),
        dateFin: new Date(item.dateFin),
        available: item.available, 
        professeurId : item.professeurId,
    };
}


export function mapUser(data: any): User {
    return {
        id: data.id ?? -1, 
        prenom: data.prenom,
        nom: data.nom ?? 'Unknown', 
        // email: data.email ?? 'unknown@example.com', // Default value if not defined
        password: data.password ?? '', 
        role: data.role ?? 'user',  
        mail: data.mail ?? 'inconuu',
        pseudo: data.user ?? 'userInconnu'
       //salt: data.salt
    };
}

export function mapToGradeModel(item: any): Grade {
    return {
        id: item.i ,
        grade: item.grade,
        assignementsId: item.assignementsId,
        userId: item.userId
      //  dateRecorded: new Date(item.dateRecorded)
    };
}


export function mapToGradeDTO(grade: Grade): Grade {
    return {
        id: grade.id,
        //studentId: grade.studentId,
        userId: grade.userId,
        grade: grade.grade,
        assignementsId: grade.assignementsId
       // dateRecorded: grade.dateRecorded.toISOString() // Convert Date to string
    };
}
export function mapToAssignement(data: AssignementsDTO): AssignementsDTO {
    return {
        id : data.id,
      description: data.description, 
      coursId: data.coursId,     
      isAvailable: data.isAvailable 
    };
  }
  export function mapToAssignementFORM(data: AssignementsFORM): AssignementsFORM {
    return {
      
      description: data.description, 
      coursId: data.coursId, 
      isAvailable: data.isAvailable  
    };
  }
  export function mapToGrade(data: Grade): Grade {
    return {
        id: data.id,
      userId: data.userId,
      assignementsId: data.assignementsId,
      grade: data.grade,  
     
    };
  }
  export function mapToLogin(data: any): Login {
    return {
        Pseudo: data.Pseudo || '',
        Password: data.Password || ''
    };
}
