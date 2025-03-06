import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
} from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SecurityIcon from '@mui/icons-material/Security';

const features = [
  {
    icon: <HealthAndSafetyIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Accurate Diagnosis',
    description: 'Advanced AI algorithms analyze your symptoms for precise medical diagnosis.',
  },
  {
    icon: <SmartToyIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'AI-Powered',
    description: 'State-of-the-art machine learning models trained on extensive medical data.',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Secure & Private',
    description: 'Your health information is protected with industry-standard security.',
  },
];

function Home() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to AI Medical Diagnosis
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Get instant, AI-powered medical diagnosis based on your symptoms
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/diagnosis')}
          sx={{ mt: 4 }}
        >
          Start Your Diagnosis
        </Button>
      </Box>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3,
                },
              }}
              elevation={2}
            >
              {feature.icon}
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                {feature.title}
              </Typography>
              <Typography color="text.secondary">
                {feature.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Home; 