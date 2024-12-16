import { Router, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { createQuiz, getQuizById } from '../controllers/quizController';
import { Quiz, Answer, AnswerResponse } from '../models/types';
import { submitAnswer } from '../controllers/answerController';
import { getResultsByUserIdAndQuizId } from '../controllers/resultController';
import { createQuizValidations, answerValidations } from '../utils/inputValidations';
import { createError } from '../utils/error';

const router: any = Router();

// Create a new quiz with validation
router.post('/quizzes', createQuizValidations, (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, questions }: Quiz = req.body;

    // Create a new quiz object with an auto-generated ID
    const newQuiz: Quiz = {
        id: Date.now(), // Simple ID generation using timestamp (not recommended for production)
        title,
        questions,
    };

    createQuiz(newQuiz);

    res.status(201).json({ id: newQuiz.id });
});


// Get a quiz by ID without revealing correct answers
router.get('/quizzes/:id', (req: Request, res: Response) => {
    const quizId = parseInt(req.params.id);

    const quiz = getQuizById(quizId);

    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // Return the quiz without revealing correct answers
    const sanitizedQuestions = quiz.questions.map(({ id, text, options }) => ({
        id,
        text,
        options,
    }));

    res.status(200).json({ id: quiz.id, title: quiz.title, questions: sanitizedQuestions });
});

// Submit an answer for a specific question in a quiz
router.post('/quizzes/:id/answers', answerValidations, (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const quizId = parseInt(req.params.id);

    try {
        const quiz = getQuizById(quizId);
        if (!quiz) {
            throw createError(404, 'Quiz not found');
        }


        const { user_id, question_id, selected_option }: Answer = req.body;
        const question = quiz.questions.find(q => q.id === question_id);
        if (!question) {
            throw createError(404, 'Question not found');
        }

        const answer: Answer = {
            user_id,
            question_id,
            selected_option
        }

        submitAnswer(answer)

        const response: AnswerResponse = {
            message: 'Answer submitted successfully.',
            is_correct: question.correct_option === selected_option,
        };

        // Conditionally add correct_answer_index if selected_option is not correct
        if (!response.is_correct) {
            response.correct_answer_index = question.correct_option;
        }
        res.status(200).json(response)
    } catch (error: any) {
        return res.status(error.code).json({ message: error.message })
    }

});

// Get results for a specific quiz by user ID
router.get('/quizzes/:quizId/results/:userId', (req: Request, res: Response) => {
    const quizId = parseInt(req.params.quizId);
    const user_id = parseInt(req.params.userId) // Get user_id from query parameters
    const result = getResultsByUserIdAndQuizId(user_id, quizId);
    if (!result) return res.status(404).json({ message: 'Results not found for this user and quiz.' });
    res.status(200).json(result);
});

export default router;
