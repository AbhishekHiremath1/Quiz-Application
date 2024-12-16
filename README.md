# Quiz Application

## Overview
The Quiz Application is a web-based platform that allows users to create quizzes, answer questions, and view results. It is built using TypeScript and Express.js, providing a robust and scalable solution for quiz management. The application supports input validation to ensure data integrity and provides a comprehensive API for interaction.

## Features
- Create quizzes with multiple-choice questions.
- Validate user inputs for quiz creation and answering.
- Retrieve quiz details and results.
- In-memory storage for quizzes and user answers.

## Technologies Used
- TypeScript
- Express JS
- Express Validator
- Jest for testing
- Nodemon for development

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (Node Package Manager)

### Installation
Clone the repository:
```bash
git clone https://github.com/yourusername/quiz-app.git
cd quiz-app
```
Install dependencies:
```bash
npm install
```

### Running the Application
To run the application, use the following command:
```bash
npm run dev
```
This will start the server in development mode, and you can access the application at http://localhost:3000.

### API Endpoints
## 1. Create a Quiz

**Endpoint**: `POST /api/quizzes`

### Request Body:
```json
{
  "title": "Quiz Title",
  "questions": [
    {
      "id": 1,
      "text": "Question text?",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correct_option": 0
    }
  ]
}
```
### Input Validations:
- **title**: Must be a string.
- **questions**: Must be an array and cannot be empty.
  - Each question must have:
    - **id**: Must be a number.
    - **text**: Must be a string.
    - **options**: Must be an array with exactly 4 elements.
    - **correct_option**: Must be one of the indices (0, 1, 2, 3).

### Sample Response:
```json
{
  "id": 1234567890
}
```

## 2. Get a Quiz by ID
**Endpoint**:  `GET /api/quizzes/:quizId`
### Sample Response:
```json
{
  "id": 1,
  "title": "Quiz Title",
  "questions": [
    {
      "id": 1,
      "text": "Question text?",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"]
    }
  ]
}
```

## 3. Submit an Answer
**Endpoint**:  `POST /api/quizzes/:quizId/answers`

### Request Body:
```json
{
  "user_id": 1,
  "question_id": 1,
  "selected_option": 0
}
```
### Input Validations:
- **user_id**: Must be a number.
- **question_id**: Must be a number.
- **selected_option**: Must be one of the indices (0, 1, 2, 3)

### Sample Response:
```json
{
  "message": "Answer submitted successfully.",
  "is_correct": true,
  "correct_answer_index": 0
}
```
## 4. Get Results for a Quiz
**Endpoint**:  `GET /api/quizzes/:quizId/results/:userId`
### Sample Response:
```json
{
  "quiz_id": 1,
  "user_id": 1,
  "score": 2,
  "answers": [
    {
      "question_id": 1,
      "selected_option": 0,
      "is_correct": true
    }
  ]
}
```
### Running Tests
To run the test cases, use the following command:

```bash
npm run test
```
This will execute all the test cases defined in the __tests__ directory.
This will generate a coverage report in the coverage directory, which you can view in your browser





