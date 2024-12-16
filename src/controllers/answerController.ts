import { Answer } from "../models/types";
import { createError } from "../utils/error";

export const userAnswers: Map<number, Answer[]> = new Map()

export const submitAnswer = (answer: Answer) => {
    if (!userAnswers.has(answer.user_id)) {
        userAnswers.set(answer.user_id, []);
    }
    
    const answers = userAnswers.get(answer.user_id)!;
     // Check if the question has already been answered by this user
     const hasAnswered = answers.some(existingAnswer => existingAnswer.question_id === answer.question_id);
    
     if (hasAnswered) {
         // Prevent submission if the question has been answered
         throw createError(400,`User ${answer.user_id} has already answered question ${answer.question_id}.`);
     }

    answers.push(answer);
};