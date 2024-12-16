import { createQuiz, getQuizById } from '../controllers/quizController'; // Adjust the import path
import { Quiz } from '../models/types';

describe('Quiz Service', () => {
    beforeEach(() => {
        // Clear the quizzes array before each test
        (global as any).quizzes = []; // Reset quizzes to an empty array
    });

    it('should create a new quiz', () => {
        const quiz: Quiz = { id: 1, title: 'JavaScript Basics', questions: [] };
        
        createQuiz(quiz);

        expect(getQuizById(1)).toEqual(quiz);
    });

    it('should return undefined for a non-existent quiz', () => {
        expect(getQuizById(999)).toBeUndefined();
    });

    it('should create multiple quizzes and retrieve them correctly', () => {
        const quiz1: Quiz = { id: 1, title: 'JavaScript Basics', questions: [] };
        const quiz2: Quiz = { id: 2, title: 'TypeScript Basics', questions: [] };

        createQuiz(quiz1);
        createQuiz(quiz2);

        expect(getQuizById(1)).toEqual(quiz1);
        expect(getQuizById(2)).toEqual(quiz2);
    });
});
