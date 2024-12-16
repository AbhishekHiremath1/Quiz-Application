
import { body } from 'express-validator';

const isValidOption = (value: number) => [0, 1, 2, 3].includes(value)

export const createQuizValidations = [
    body('title')
        .isString().withMessage('Title must be a string'),

    body('questions')
        .isArray().withMessage('Questions must be an array')
        .custom((value) => {
            if (value.length === 0) {
                throw new Error('Questions array cannot be empty');
            }
            return true;
        }),

    body('questions.*.id')
        .custom((value) => {
            if (typeof value !== 'number') {
                throw new Error('Question ID must be a number');
            }
            return true;
        }),

    body('questions.*.text')
        .isString().withMessage('Question text must be a string'),

    body('questions.*.options')
        .isArray().withMessage('Options must be an array')
        .custom((value) => {
            if (value.length === 0) {
                throw new Error('Options array cannot be empty');
            }else if(value.length!==4){
                throw new Error('Options array must have 4 elements');
            }
            return true;
        }),

    body('questions.*.correct_option').custom(isValidOption).withMessage('Correct option must be one of 0, 1, 2, 3')
];

export const answerValidations = [
    body('user_id').custom((value) => {
        if (typeof value !== 'number') {
            throw new Error('User ID must be a number');
        }
        return true;
    }),
    body('question_id').custom((value) => {
        if (typeof value !== 'number') {
            throw new Error('Question ID must be a number');
        }
        return true;
    }),
    body('selected_option').custom(isValidOption).withMessage('Correct option must be one of 0, 1, 2, 3')
]