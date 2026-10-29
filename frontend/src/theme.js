import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#4f46e5' },
    secondary: { main: '#0ea5e9' },
    background: { default: '#f6f7fb' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'Inter, Roboto, "Segoe UI", Arial, sans-serif',
    h6: { fontWeight: 700 },
  },
  components: {
    MuiPaper: { defaultProps: { elevation: 0 }, styleOverrides: { root: { border: '1px solid #e5e7eb' } } },
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } },
  },
});

export default theme;
