import { Answer, Result } from "../models/types";
import { getQuizById } from "./quizController";

import { userAnswers } from "./answerController";
let results: Result[] = []; // In-memory storage for results

export const getResultsByUserIdAndQuizId = (userId: number, quizId: number): Result | undefined => {
    const answers = userAnswers.has(userId)?userAnswers.get(userId):null;
    const quiz = getQuizById(quizId);

    if (!quiz || !answers) return undefined;

    let score = 0;
    const answerSummary: Answer[] = answers.map(answer => {
        const question = quiz.questions.find(q => q.id === answer.question_id);
        const is_correct = question && question.correct_option === answer.selected_option;
        if (is_correct) score++;
        return { ...answer, is_correct };
    });

    const result:Result = {
        quiz_id: quizId,
        user_id: userId,
        score,
        answers: answerSummary,
    }

    results.push(result)
    return result
};