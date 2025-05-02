import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ReactMarkdown from 'react-markdown';

const ChatInterface = ({ messages, setMessages, currentTopicIndex }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Generate initial topic introduction
    if (messages.length === 0) {
      generateInitialMessage();
    }
  }, [currentTopicIndex]);

  const generateInitialMessage = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/generate-intro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topicIndex: currentTopicIndex }),
      });
      const data = await response.json();
      setMessages([{ role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error generating initial message:', error);
    }
    setIsLoading(false);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          topicIndex: currentTopicIndex,
          conversationHistory: messages,
        }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
    setIsLoading(false);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        🧠 Chat with AI Tutor
      </Typography>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          mb: 2,
          p: 2,
          bgcolor: 'background.default',
          borderRadius: 1,
        }}
      >
        {messages.map((message, index) => (
          <Paper
            key={index}
            elevation={1}
            sx={{
              p: 2,
              mb: 2,
              bgcolor: message.role === 'user' ? 'primary.light' : 'background.paper',
              color: message.role === 'user' ? 'white' : 'text.primary',
            }}
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </Paper>
        ))}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress />
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={isLoading}
        />
        <IconButton
          color="primary"
          onClick={handleSendMessage}
          disabled={isLoading || !input.trim()}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatInterface; 