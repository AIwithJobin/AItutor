import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 60_000,
});

/** Turns any axios error into a short, user-friendly message. */
export function errorMessage(error) {
  if (error.response?.data?.detail) {
    const { detail } = error.response.data;
    return typeof detail === 'string' ? detail : 'The request was not valid.';
  }
  if (error.code === 'ECONNABORTED') return 'The tutor took too long to answer. Please try again.';
  return 'Could not reach the tutor backend. Is it running?';
}

export const api = {
  topics: () => client.get('/api/topics').then((r) => r.data),
  intro: (topicId) => client.post(`/api/topics/${topicId}/intro`).then((r) => r.data.message),
  chat: (topicId, message, history) =>
    client.post('/api/chat', { topic_id: topicId, message, history }).then((r) => r.data.message),
  exercise: (topicId, language) =>
    client.post('/api/exercises', { topic_id: topicId, language }).then((r) => r.data.message),
  review: (topicId, question, code, language) =>
    client.post('/api/submissions', { topic_id: topicId, question, code, language }).then((r) => r.data.message),
};
