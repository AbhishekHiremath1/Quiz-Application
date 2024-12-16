import { getResultsByUserIdAndQuizId } from '../controllers/resultController'; // Adjust the import path
import { userAnswers } from '../controllers/answerController'; // Import userAnswers for mocking
import { Answer, Quiz, Result } from '../models/types';
import { createQuiz, getQuizById } from '../controllers/quizController'; // Import createQuiz to set up quizzes

jest.mock('../controllers/quizController'); // Mocking quizController functions

describe('Result Service', () => {
    const mockQuiz: Quiz = {
        id: 1,
        title: 'JavaScript Basics',
        questions: [
            { id: 1, text: 'What is JavaScript?', options: ['A programming language', 'A coffee brand'], correct_option: 0 },
            { id: 2, text: 'What does JS stand for?', options: ['JavaScript', 'JustScript'], correct_option: 0 }
        ]
    };

    beforeEach(() => {
        // Clear userAnswers and results before each test
        userAnswers.clear();
        (global as any).results = []; // Reset results to an empty array

        // Mock getQuizById to return the mock quiz
        (getQuizById as jest.Mock).mockImplementation((id) => {
            return id === mockQuiz.id ? mockQuiz : undefined;
        });
    });

    it('should return results for a user who has answered questions', () => {
        const userId = 1;
        const quizId = 1;

        const answers: Answer[] = [
            { user_id: userId, question_id: 1, selected_option: 0 }, // Correct answer
            { user_id: userId, question_id: 2, selected_option: 1 }  // Incorrect answer
        ];

        // Store answers in userAnswers map
        userAnswers.set(userId, answers);

        const result = getResultsByUserIdAndQuizId(userId, quizId);

        expect(result).toBeDefined();
        expect(result).toEqual({
            quiz_id: quizId,
            user_id: userId,
            score: 1,
            answers: [
                { ...answers[0], is_correct: true },
                { ...answers[1], is_correct: false }
            ]
        });
    });

    it('should return undefined if the quiz does not exist', () => {
        const userId = 1;
        const quizId = 999; // Non-existent quiz ID

        const result = getResultsByUserIdAndQuizId(userId, quizId);

        expect(result).toBeUndefined();
    });

    it('should return undefined if the user has no answers', () => {
        const userId = 1;
        const quizId = 1;

        const result = getResultsByUserIdAndQuizId(userId, quizId);

        expect(result).toBeUndefined();
    });
});
