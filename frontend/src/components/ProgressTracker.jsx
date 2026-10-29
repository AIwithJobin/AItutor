import { Box, Button, Chip, Divider, LinearProgress, Stack, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

export default function ProgressTracker({ topics, topicIndex, onSelect, onRestart }) {
  const topic = topics[topicIndex];
  const percent = topics.length > 1 ? (topicIndex / (topics.length - 1)) * 100 : 0;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        📚 Learning path
      </Typography>

      <LinearProgress variant="determinate" value={percent} sx={{ height: 10, borderRadius: 5 }} />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Topic {topicIndex + 1} of {topics.length}
      </Typography>

      <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 3 }}>
        Current topic
      </Typography>
      <Typography variant="body1" fontWeight={600} sx={{ mb: 1 }}>
        {topic.title}
      </Typography>
      {topic.has_exercises && <Chip size="small" color="secondary" label="Includes coding exercises" />}

      <Divider sx={{ my: 2 }} />

      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          disabled={topicIndex === 0}
          onClick={() => onSelect(topicIndex - 1)}
        >
          Back
        </Button>
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          disabled={topicIndex >= topics.length - 1}
          onClick={() => onSelect(topicIndex + 1)}
          fullWidth
        >
          Next topic
        </Button>
      </Stack>
      <Button startIcon={<RestartAltIcon />} onClick={onRestart} sx={{ mt: 1 }} fullWidth>
        Restart this topic
      </Button>
    </Box>
  );
}
