import { submitAnswer, userAnswers } from '../controllers/answerController'; // Adjust the import path
import { Answer } from '../models/types';
import { createError } from '../utils/error';
jest.mock('../utils/error'); // Mocking createError function

describe('submitAnswer', () => {
    beforeEach(() => {
        // Clear the userAnswers map before each test
        userAnswers.clear();
    });

    it('should store an answer for a new user', () => {
        const answer: Answer = { user_id: 1, question_id: 101, selected_option: 2 };
        submitAnswer(answer);        
        expect(userAnswers.get(1)).toEqual([answer]);
    });

    it('should throw an error if the user has already answered the question', () => {
        const answer: Answer = { user_id: 1, question_id: 101, selected_option: 2 };
        
        submitAnswer(answer); // First submission

        // Mock createError to return an instance of Error
        (createError as jest.Mock).mockImplementation((code: number, message: string) => {
            const error = new Error(message);
            (error as any).code = code; // Attach custom properties if needed
            return error; // Return the Error instance
        });

        // Expecting submitAnswer to throw an error on second submission
        expect(() => submitAnswer(answer)).toThrow(Error);
        
        // Check for specific error message
        expect(() => submitAnswer(answer)).toThrow(`User ${answer.user_id} has already answered question ${answer.question_id}.`);
    });
});
