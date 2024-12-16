export interface Question {
    id: number;
    text: string;
    options: string[];
    correct_option: number;
}

export interface Quiz {
    id: number;
    title: string;
    questions: Question[];
}

export interface Answer {
    user_id: number;
    question_id: number;
    selected_option: number;
    is_correct?: boolean; // Optional property
}

export interface Result {
    quiz_id: number;
    user_id: number;
    score: number;
    answers: Answer[];
}

export interface AnswerResponse {
    message: string;
    is_correct: boolean;
    correct_answer_index?: number; // Optional property
}
