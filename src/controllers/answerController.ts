import { Answer } from "../models/types";
import { createError } from "../utils/error";

export const userAnswers: Map<number, Answer[]> = new Map()

export const submitAnswer = (answer: Answer) => {
    if (!userAnswers.has(answer.user_id)) {
        userAnswers.set(answer.user_id, []);
    }
    console.log("userAnswers.....", userAnswers);
    
    const answers = userAnswers.get(answer.user_id)!;
    console.log("answers....", answers)

     // Check if the question has already been answered by this user
     const hasAnswered = answers.some(existingAnswer => existingAnswer.question_id === answer.question_id);
    
     if (hasAnswered) {
         throw createError(400,`User ${answer.user_id} has already answered question ${answer.question_id}.`);
         // Prevent submission if the question has been answered
     }

    answers.push(answer);
    console.log("ANSWER.....",answer);
};