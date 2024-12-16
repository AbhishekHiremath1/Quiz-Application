
import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/quizRoutes';

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Define routes under /api endpoint
app.use('/api', routes);

// Handle 404 errors for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Export the app for use in server.ts file or testing purposes.
export default app;
