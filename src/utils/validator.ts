import { getQuizById } from "../controllers/quizController";
import { Question } from "../models/types";
import { createError } from "./error";

// export const validateQuizAndGetQuestion = (quizId: number, questionId: number): Question => {
//     console.log("validateQuizAndGetQuestion......");
    
//     const quiz = getQuizById(quizId);
//     if (!quiz) {
//         throw createError(404, 'Quiz not found');
//     }

//     const question = quiz.questions.find(q => q.id === questionId);
//     if (!question) {
//         throw createError(404, 'Question not found');
//     }

//     return question; // Return only the question
// };