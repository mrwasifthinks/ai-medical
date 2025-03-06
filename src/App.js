import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div>
          <h1>AI Medical Diagnosis</h1>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App; 