import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container, Grid, Paper } from '@mui/material';
import ChatInterface from './components/ChatInterface';
import ProgressTracker from './components/ProgressTracker';
import CodeEditor from './components/CodeEditor';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [codingQuestion, setCodingQuestion] = useState('');
  const [userCode, setUserCode] = useState('');
  const [codeFeedback, setCodeFeedback] = useState('');
  const [showCompiler, setShowCompiler] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl">
        <Box sx={{ flexGrow: 1, mt: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <ProgressTracker
                  currentTopicIndex={currentTopicIndex}
                  setCurrentTopicIndex={setCurrentTopicIndex}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={9}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper elevation={3} sx={{ p: 2 }}>
                    <ChatInterface
                      messages={messages}
                      setMessages={setMessages}
                      currentTopicIndex={currentTopicIndex}
                    />
                  </Paper>
                </Grid>
                {showCompiler && (
                  <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                      <CodeEditor
                        codingQuestion={codingQuestion}
                        setCodingQuestion={setCodingQuestion}
                        userCode={userCode}
                        setUserCode={setUserCode}
                        codeFeedback={codeFeedback}
                        setCodeFeedback={setCodeFeedback}
                      />
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App; 