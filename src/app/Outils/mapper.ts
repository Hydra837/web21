import { GetAllCoursForEachUsers } from "../Models/GetAllCoursForEachUsers";
import { User } from "../Models/User";
import { Course } from "../Models/courseModel";
//import { Grade } from "../models/grade.model";
import { Grade } from "../Models/GradeModel";
import { IterableDiffers } from "@angular/core";

// Map API data to GetAllCoursForEachUsers
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

// Map API data to Course model
export function mapToCourseModel(item: any): Course {
    return {
        id: item.id,
        Nom: item.nom,
        description: item.description,
        dateDebut: new Date(item.dateDebut),
        dateFin: new Date(item.dateFin),
        available: item.available, 
        professeurId : item.professeurId,
    };
}

// Map API data to User model
export function mapUser(data: any): User {
    return {
        id: data.id ?? -1, // Default value if not defined
        prenom: data.prenom,
        nom: data.nom ?? 'Unknown', // Default value if not defined
        // email: data.email ?? 'unknown@example.com', // Default value if not defined
        password: data.password ?? '', // Default value if not defined
        role: data.role ?? 'user', // Default value if not defined, 
        mail: data.mail ?? 'inconuu',
        pseudo: data.user ?? 'userInconnu'
       //salt: data.salt
    };
}

// Map API data to Grade model
export function mapToGradeModel(item: any): Grade {
    return {
        id: item.i ,
        grade: item.grade,
        assignementsId: item.assignementsId,
        userId: item.userId
      //  dateRecorded: new Date(item.dateRecorded)
    };
}

// Map Grade model to GradeDTO
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
