import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Markdown from './Markdown.jsx';
import { api, errorMessage } from '../api.js';

const LANGUAGES = [
  { value: 'python', label: 'Python' },
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' },
  { value: 'java', label: 'Java' },
  { value: 'javascript', label: 'JavaScript' },
];

export default function CodeEditor({ topic }) {
  const [language, setLanguage] = useState('python');
  const [question, setQuestion] = useState('');
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset the practice area when the topic changes.
  useEffect(() => {
    setQuestion('');
    setCode('');
    setFeedback('');
    setError('');
  }, [topic.id]);

  const run = async (action) => {
    setLoading(true);
    setError('');
    try {
      await action();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const newExercise = () =>
    run(async () => {
      setQuestion(await api.exercise(topic.id, language));
      setCode('');
      setFeedback('');
    });

  const submit = () => run(async () => setFeedback(await api.review(topic.id, question, code, language)));

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h6">💻 Coding practice</Typography>
        <TextField
          select
          size="small"
          label="Language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          sx={{ minWidth: 140 }}
        >
          {LANGUAGES.map((l) => (
            <MenuItem key={l.value} value={l.value}>
              {l.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {!question ? (
        <Button variant="contained" onClick={newExercise} disabled={loading}>
          Generate an exercise
        </Button>
      ) : (
        <>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Markdown>{question}</Markdown>
          </Paper>

          <TextField
            fullWidth
            multiline
            minRows={10}
            label="Your solution"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            sx={{ mb: 2, '& textarea': { fontFamily: 'ui-monospace, Consolas, monospace', fontSize: 14 } }}
          />

          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Button variant="contained" onClick={submit} disabled={loading || !code.trim()}>
              Get feedback
            </Button>
            <Button variant="outlined" onClick={newExercise} disabled={loading}>
              New exercise
            </Button>
          </Stack>
        </>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress size={28} />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {feedback && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            Feedback
          </Typography>
          <Markdown>{feedback}</Markdown>
        </Paper>
      )}
    </Box>
  );
}
