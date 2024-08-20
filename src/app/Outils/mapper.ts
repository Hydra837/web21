import { GetAllCoursForEachUsers } from "../Models/GetAllCoursForEachUsers";
import { User } from "../Models/User";
import { Course } from "../Models/courseModel";
import { Grade } from "../Models/GradeModel";
import { AssignementsDTO, AssignementsFORM } from "../Models/assignementsModel";
import { Login } from "../Models/Login";
import { UserAssignment } from "../Models/UserAssignement"; // Assuming this is the correct import

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

export function mapToCourseModel(item: Course): Course {
    return {
        id: item.id,
        Nom: item.Nom,
        description: item.description,
        dateDebut: new Date(item.dateDebut!),
        dateFin: new Date(item.dateFin!),
        available: item.available, 
        professeurId: item.professeurId,
    };
}

export function mapUser(data: User): User {
    return {
        id: data.id ?? -1, 
        prenom: data.prenom,
        nom: data.nom ?? 'Unknown', 
        password: data.password ?? '', 
        role: data.role ?? 'user',  
        mail: data.mail ?? 'inconnu',
        pseudo: data.pseudo ?? 'userInconnu'
    };
}

export function mapToGradeModel(item: any): Grade {
    return {
        id: item.id,  // Changed from item.i to item.id
        grade: item.grade,
        assignementsId: item.assignementsId,
        userId: item.userId
    };
}

export function mapToGradeDTO(grade: Grade): Grade {
    return {
        id: grade.id,
        userId: grade.userId,
        grade: grade.grade,
        assignementsId: grade.assignementsId
    };
}

export function mapToAssignement(data: AssignementsDTO): AssignementsDTO {
    return {
        id: data.id,
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

export function mapUserAssignment(data: any): UserAssignment {
    return {
        nom: data.nom,
        prenom: data.prenom,
        coursName: data.coursName,
        assignementTitle: data.assignementTitle,
        grade: data.grade,
    };
}
