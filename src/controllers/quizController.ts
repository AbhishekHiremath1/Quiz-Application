
import { Quiz } from '../models/types';

let quizzes: Quiz[] = []; // In-memory storage for quizzes

export const createQuiz = (quiz: Quiz) => {
    quizzes.push(quiz);
};

export const getQuizById = (id: number): Quiz | undefined => {
    return quizzes.find(quiz => quiz.id === id);
};