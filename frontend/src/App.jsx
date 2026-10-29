import { useEffect, useState } from 'react';
import { Alert, Box, CircularProgress, Container, CssBaseline, Grid, Paper, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme.js';
import { api, errorMessage } from './api.js';
import ProgressTracker from './components/ProgressTracker.jsx';
import ChatInterface from './components/ChatInterface.jsx';
import CodeEditor from './components/CodeEditor.jsx';

export default function App() {
  const [topics, setTopics] = useState([]);
  const [topicIndex, setTopicIndex] = useState(0);
  const [sessionKey, setSessionKey] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    api.topics().then(setTopics).catch((e) => setError(errorMessage(e)));
  }, []);

  const topic = topics[topicIndex];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          AI Programming Tutor
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          42 topics from variables to binary exponentiation, with explanations, chat and AI-reviewed exercises.
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}
        {!error && !topic && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {topic && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2.5, position: { md: 'sticky' }, top: 24 }}>
                <ProgressTracker
                  topics={topics}
                  topicIndex={topicIndex}
                  onSelect={setTopicIndex}
                  onRestart={() => setSessionKey((k) => k + 1)}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={9}>
              <Paper sx={{ p: 2.5, mb: 3 }}>
                <ChatInterface topic={topic} sessionKey={sessionKey} />
              </Paper>
              {topic.has_exercises && (
                <Paper sx={{ p: 2.5 }}>
                  <CodeEditor topic={topic} />
                </Paper>
              )}
            </Grid>
          </Grid>
        )}
      </Container>
    </ThemeProvider>
  );
}
