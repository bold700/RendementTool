import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box, Typography } from '@mui/material';
import CalculatorForm from './components/CalculatorForm';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#006A6A',
      light: '#4C9A9A',
      dark: '#004C4C',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4A6363',
      light: '#7A8F8F',
      dark: '#2C3B3B',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    error: {
      main: '#BA1A1A',
    },
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 400,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 24px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#4C9A9A',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h1" component="h1" gutterBottom align="center" color="primary">
            RendementTool
          </Typography>
          <Typography variant="h2" component="h2" gutterBottom align="center" color="text.secondary">
            Bereken het rendement op uw vastgoedinvestering
          </Typography>
          <CalculatorForm />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App; 