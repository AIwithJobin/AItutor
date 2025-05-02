import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Button,
  Divider,
  Alert,
} from '@mui/material';
import { PROGRESS_TRACKER } from '../data/progressTracker';

const ProgressTracker = ({ currentTopicIndex, setCurrentTopicIndex }) => {
  const currentTopic = PROGRESS_TRACKER[currentTopicIndex];
  const progressPercent = (currentTopicIndex / (PROGRESS_TRACKER.length - 1)) * 100;

  const handleNextTopic = () => {
    if (currentTopicIndex < PROGRESS_TRACKER.length - 1) {
      setCurrentTopicIndex(currentTopicIndex + 1);
    }
  };

  const handleResetTopic = () => {
    setCurrentTopicIndex(currentTopicIndex);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        📚 Learning Progress
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <LinearProgress
          variant="determinate"
          value={progressPercent}
          sx={{ height: 10, borderRadius: 5 }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Topic {currentTopic.progress} of {PROGRESS_TRACKER.length}
        </Typography>
      </Box>

      <Typography variant="subtitle1" gutterBottom>
        Current Topic
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        <strong>{currentTopic.topic}</strong>
      </Typography>
      
      {currentTopic.needs_coding && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Includes coding exercises
        </Alert>
      )}

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="contained"
          onClick={handleNextTopic}
          disabled={currentTopicIndex >= PROGRESS_TRACKER.length - 1}
          fullWidth
        >
          Next Topic
        </Button>
        <Button
          variant="outlined"
          onClick={handleResetTopic}
          fullWidth
        >
          Reset Topic
        </Button>
      </Box>
    </Box>
  );
};

export default ProgressTracker; 