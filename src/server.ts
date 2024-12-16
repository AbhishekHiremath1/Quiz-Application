
import app from './app';

const PORT = process.env.PORT || 3000;

// Start listening on the defined port.
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});