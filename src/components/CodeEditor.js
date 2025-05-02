import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeEditor = ({
  codingQuestion,
  setCodingQuestion,
  userCode,
  setUserCode,
  codeFeedback,
  setCodeFeedback,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateProblem = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/generate-problem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setCodingQuestion(data.question);
      setUserCode('');
      setCodeFeedback('');
    } catch (error) {
      console.error('Error generating problem:', error);
    }
    setIsLoading(false);
  };

  const handleSubmitCode = async () => {
    if (!userCode.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/submit-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: codingQuestion,
          code: userCode,
        }),
      });
      const data = await response.json();
      setCodeFeedback(data.feedback);
    } catch (error) {
      console.error('Error submitting code:', error);
    }
    setIsLoading(false);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        💻 Coding Practice
      </Typography>

      {!codingQuestion ? (
        <Button
          variant="contained"
          onClick={handleGenerateProblem}
          disabled={isLoading}
        >
          Generate New Problem
        </Button>
      ) : (
        <>
          <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Problem Statement
            </Typography>
            <ReactMarkdown>{codingQuestion}</ReactMarkdown>
          </Paper>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Your Solution
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={10}
              variant="outlined"
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              sx={{
                '& .MuiInputBase-root': {
                  fontFamily: 'monospace',
                  fontSize: '14px',
                },
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button
              variant="contained"
              onClick={handleSubmitCode}
              disabled={isLoading || !userCode.trim()}
            >
              Submit Code
            </Button>
            <Button
              variant="outlined"
              onClick={handleGenerateProblem}
              disabled={isLoading}
            >
              New Problem
            </Button>
          </Box>

          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress />
            </Box>
          )}

          {codeFeedback && (
            <Paper elevation={1} sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Feedback
              </Typography>
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {codeFeedback}
              </ReactMarkdown>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
};

export default CodeEditor; 