import request from 'supertest';
import express from 'express';
import quizRouter from '../routes/quizRoutes'; // Adjust the import path
import { submitAnswer } from '../controllers/answerController'; // Import userAnswers for mocking
import { createQuiz, getQuizById } from '../controllers/quizController'; // Import createQuiz to set up quizzes
import { getResultsByUserIdAndQuizId } from '../controllers/resultController';

const app = express();
app.use(express.json());
app.use('/api', quizRouter); // Use your router

// Mocking dependencies
jest.mock('../controllers/quizController');
jest.mock('../controllers/answerController');
jest.mock('../controllers/resultController');

describe('Quiz Routes', () => {

    it('should create a new quiz', async () => {
        const newQuiz = {
            title: 'JavaScript Basics',
            questions: [
                { id: 1, text: 'What is JavaScript?', options: ['A programming language', 'A coffee brand', 'A tourist destination', 'A sport'], correct_option: 0 },
            ],
        };

        const response = await request(app)
            .post('/api/quizzes')
            .send(newQuiz)
            .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(createQuiz).toHaveBeenCalledWith(expect.objectContaining(newQuiz));
    });

    it('should return 400 for invalid quiz creation', async () => {
        const invalidQuiz1 = {
            title: "java",
            questions: [
                {
                    id: 1,
                    text: 123,
                    options: [1, 2, 3, 4],
                    correct_option: 5
                },
                {
                    id: "123",
                    text: "Hello",
                    options: [],
                    correct_option: 2
                },
                {
                    id: "123",
                    text: "Hello",
                    options: [1, 2],
                    correct_option: 2
                }

            ]

        };

        const invalidQuiz2 = {
            title: "java",
            questions: []
        }

        const response1 = await request(app)
            .post('/api/quizzes')
            .send(invalidQuiz1)
            .expect(400);

        const response2 = await request(app)
            .post('/api/quizzes')
            .send(invalidQuiz2)
            .expect(400);

        expect(response1.body.errors).toBeDefined();
        expect(response2.body.errors).toBeDefined();
    });

    it('should get a quiz by ID', async () => {
        const mockQuiz = {
            id: 1,
            title: 'JavaScript Basics',
            questions: [
                { id: 1, text: 'What is JavaScript?', options: ['A programming language', 'A coffee brand'], correct_option: 0 },
            ],
        };

        (getQuizById as jest.Mock).mockReturnValue(mockQuiz);

        const response = await request(app)
            .get('/api/quizzes/1')
            .expect(200);

        expect(response.body).toEqual({
            id: mockQuiz.id,
            title: mockQuiz.title,
            questions: mockQuiz.questions.map(({ id, text, options }) => ({ id, text, options })),
        });
    });

    it('should return 404 for non-existent quiz', async () => {
        (getQuizById as jest.Mock).mockReturnValue(undefined);

        await request(app)
            .get('/api/quizzes/999')
            .expect(404);

    });

    it('should submit an answer and return success message', async () => {

        const answer = {
            user_id: 1,
            question_id: 1,
            selected_option: 0,
        };

        const answer2 = {
            user_id: 1,
            question_id: 1,
            selected_option: 2,
        };

        const mockQuiz = {
            id: 1734271132012,
            title: 'JavaScript Basics',
            questions: [
                { id: 1, text: 'What is JavaScript?', options: ['A programming language', 'A coffee brand', 'A tourist destination', 'A sport'], correct_option: 0 },
            ],
        };

        (getQuizById as jest.Mock).mockReturnValue(mockQuiz);
        const response1 = await request(app)
            .post('/api/quizzes/1734271132012/answers')
            .send(answer)
            .expect(200);

        const response2 = await request(app)
            .post('/api/quizzes/1734271132012/answers')
            .send(answer2)
            .expect(200);

        expect(response1.body).toEqual({
            message: 'Answer submitted successfully.',
            is_correct: true,
        });

        expect(response2.body).toEqual({
            message: 'Answer submitted successfully.',
            is_correct: false,
            correct_answer_index: 0
        })

        expect(submitAnswer).toHaveBeenCalledWith(expect.objectContaining(answer))
    });

    it('should return 404 if question does not exist', async () => {

        const answer = {
            user_id: 1,
            question_id: 1234,
            selected_option: 0,
        };

        const response1 = await request(app)
            .post('/api/quizzes/1/answers')
            .send(answer)
            .expect(404);

        expect(response1.body.message).toEqual("Question not found");

        (getQuizById as jest.Mock).mockReturnValue(undefined)
        const response2 = await request(app)
            .post('/api/quizzes/1/answers')
            .send(answer)
            .expect(404);

        expect(response2.body.message).toEqual("Quiz not found");


    });

    it('should return 400 for invalid answer submission', async () => {
        const invalidAnswer1 = {
            user_id: 'invalid', // Invalid user_id
            question_id: 1,
            selected_option: 0,
        };
        const invalidAnswer2 = {
            user_id: 1, 
            question_id: "123", // Invalid question_id
            selected_option: 0,
        };

        const response1 = await request(app)
            .post('/api/quizzes/1/answers')
            .send(invalidAnswer1)
            .expect(400);

        const response2 = await request(app)
            .post('/api/quizzes/1/answers')
            .send(invalidAnswer2)
            .expect(400);

        expect(response1.body.errors).toBeDefined();
        expect(response2.body.errors).toBeDefined();
    });

    it('should get results for a specific quiz by user ID', async () => {
        const mockResult = {
            quiz_id: 1,
            user_id: 1,
            score: 2,
            answers: [],
        };

        (getResultsByUserIdAndQuizId as jest.Mock).mockReturnValue(mockResult);

        const response = await request(app)
            .get('/api/quizzes/1/results/1')
            .expect(200);

        expect(response.body).toEqual(mockResult);
    });

    it('should return 404 for results not found', async () => {
        (getResultsByUserIdAndQuizId as jest.Mock).mockReturnValue(undefined);

        await request(app)
            .get('/api/quizzes/999/results/1')
            .expect(404);
    });
});
