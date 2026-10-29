import { useEffect, useRef, useState } from 'react';
import { Alert, Box, CircularProgress, IconButton, Paper, TextField, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Markdown from './Markdown.jsx';
import { api, errorMessage } from '../api.js';

export default function ChatInterface({ topic, sessionKey }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef(null);

  // Start a fresh conversation (with a generated introduction) whenever the topic or session changes.
  useEffect(() => {
    let cancelled = false;
    setMessages([]);
    setError('');
    setLoading(true);
    api
      .intro(topic.id)
      .then((text) => !cancelled && setMessages([{ role: 'assistant', content: text }]))
      .catch((e) => !cancelled && setError(errorMessage(e)))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [topic.id, sessionKey]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const history = messages;
    setMessages([...history, { role: 'user', content: text }]);
    setInput('');
    setError('');
    setLoading(true);
    try {
      const answer = await api.chat(topic.id, text, history);
      setMessages((prev) => [...prev, { role: 'assistant', content: answer }]);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 560 }}>
      <Typography variant="h6" gutterBottom>
        🧠 Chat with your AI tutor
      </Typography>

      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1.5, bgcolor: 'background.default', borderRadius: 2, mb: 2 }}>
        {messages.map((m, i) => (
          <Box key={i} sx={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', mb: 1.5 }}>
            <Paper
              sx={{
                px: 2,
                py: 1,
                maxWidth: '85%',
                bgcolor: m.role === 'user' ? 'primary.main' : 'background.paper',
                color: m.role === 'user' ? 'primary.contrastText' : 'text.primary',
              }}
            >
              <Markdown>{m.content}</Markdown>
            </Paper>
          </Box>
        ))}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress size={28} />
          </Box>
        )}
        <div ref={endRef} />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 1 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Ask a question about this topic…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          disabled={loading}
        />
        <IconButton color="primary" onClick={send} disabled={loading || !input.trim()} aria-label="Send message">
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
