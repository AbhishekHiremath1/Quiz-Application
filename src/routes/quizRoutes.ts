import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
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
    console.log("errors..... ", errors)

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

    // res.status(200).json({ ...quizWithoutAnswers, questions });
});

// Submit an answer for a specific question in a quiz
// router.post('/quizzes/:id/answers', (req: Request, res: Response) => {
//     const quizId = parseInt(req.params.id);

//     const { question_id, selected_option }: Answer = req.body;

//     const quiz = getQuizById(quizId);

//     if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

//     const question = quiz.questions.find(q => q.id === question_id);

//     if (!question) return res.status(404).json({ message: 'Question not found' });

//     // Check if the answer is correct
//     const is_correct = question.correct_option === selected_option;

//     res.status(200).json({
//         is_correct,
//         correct_answer: question.correct_option,
//         message: is_correct ? 'Correct answer!' : 'Incorrect answer!',
//     });
// });

// Submit an answer for a specific question in a quiz
router.post('/quizzes/:id/answers', answerValidations, (req: Request, res: Response) => {
    const errors = validationResult(req);
    console.log("errors..... ", errors)

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

        const userAnswers =submitAnswer(answer)
        console.log("Submitted Answer....", userAnswers);


        // if(!submittedAnswer) return res.status(400).json({ message: 'Answer not submitted' });

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

// Get results for a specific quiz by user ID (mock implementation)
// router.post('/quizzes/:id/results', (req: Request, res: Response) => {
//     const quizId = parseInt(req.params.id);

//     const { user_id, answers }: Result = req.body;

//     // Calculate score based on answers provided by the user
//     let score = 0;

//     answers.forEach(answer => {
//         const question = getQuizById(quizId)?.questions.find(q => q.id === answer.question_id);

//         if (question && question.correct_option === answer.selected_option) {
//             score++;
//             answer.is_correct = true; // Mark as correct if it matches
//         } else {
//             answer.is_correct = false; // Mark as incorrect otherwise
//         }

//         // Ensure that we store the result correctly.
//         submitResult({
//             quiz_id: quizId,
//             user_id,
//             score,
//             answers,
//         });

//         res.status(200).json({
//             score,
//             summary: answers,
//         });

//         return; // Exit after processing to avoid multiple responses.

//      });

//      // If no answers were processed.
//      res.status(400).json({ message: 'No answers provided.' });
// });

// Get results for a specific quiz by user ID
router.get('/quizzes/:quizId/results/:userId', (req: Request, res: Response) => {
    const quizId = parseInt(req.params.quizId);
    const user_id = parseInt(req.params.userId) // Get user_id from query parameters
    const result = getResultsByUserIdAndQuizId(user_id, quizId);
    if (!result) return res.status(404).json({ message: 'Results not found for this user and quiz.' });
    res.status(200).json(result);
});

export default router;
