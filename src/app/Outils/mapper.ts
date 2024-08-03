import { GetAllCoursForEachUsers } from "../Models/GetAllCoursForEachUsers";
import { User } from "../Models/User";
import { Course } from "../Models/courseModel";
//import { Grade } from "../models/grade.model";
import { Grade } from "../Models/GradeModel";

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
        available: item.available
    };
}

// Map API data to User model
export function mapUser(data: any): User {
    return {
        id: data.id ?? -1, // Default value if not defined
        prenom: data.prenom,
        nom: data.name ?? 'Unknown', // Default value if not defined
        // email: data.email ?? 'unknown@example.com', // Default value if not defined
        password: data.password ?? '', // Default value if not defined
        role: data.role ?? 'user', // Default value if not defined, 
        mail: data.mail ?? 'inconuu',
        pseudo: data.user ?? 'user123456'
    };
}

// Map API data to Grade model
export function mapToGradeModel(item: any): Grade {
    return {
        id: item.id,
        studentId: item.studentId,
        courseId: item.courseId,
        gradeValue: item.gradeValue,
      //  dateRecorded: new Date(item.dateRecorded)
    };
}

// Map Grade model to GradeDTO
export function mapToGradeDTO(grade: Grade): Grade {
    return {
        id: grade.id,
        studentId: grade.studentId,
        courseId: grade.courseId,
        gradeValue: grade.gradeValue,
       // dateRecorded: grade.dateRecorded.toISOString() // Convert Date to string
    };
}
