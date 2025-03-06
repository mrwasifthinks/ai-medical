import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import axios from 'axios';
import config from '../config';

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const [treatment, setTreatment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const diagnosis = location.state?.diagnosis?.diseases || [];

  useEffect(() => {
    if (diagnosis.length > 0) {
      const fetchTreatment = async () => {
        try {
          const response = await axios.get(
            `${config.apiBaseUrl}/api/get_treatment/${diagnosis[0].name}`
          );
          setTreatment(response.data);
        } catch (error) {
          setError('Failed to load treatment information.');
          console.error('Error fetching treatment:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchTreatment();
    } else {
      setLoading(false);
    }
  }, [diagnosis]);

  if (!diagnosis.length) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error">
            No diagnosis data available
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/diagnosis')}
            sx={{ mt: 2 }}
          >
            Return to Diagnosis
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Diagnosis Results
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 4, mt: 4 }} elevation={2}>
          <Typography variant="h6" gutterBottom>
            Possible Conditions
          </Typography>
          <List>
            {diagnosis.map((disease, index) => (
              <React.Fragment key={disease.name}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="subtitle1">{disease.name}</Typography>
                        <Chip
                          label={`${(disease.probability * 100).toFixed(1)}%`}
                          color="primary"
                          size="small"
                        />
                        <Chip
                          label={disease.severity}
                          color={
                            disease.severity === 'High'
                              ? 'error'
                              : disease.severity === 'Medium'
                              ? 'warning'
                              : 'success'
                          }
                          size="small"
                        />
                      </Box>
                    }
                  />
                </ListItem>
                {index < diagnosis.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          treatment && (
            <Paper sx={{ p: 4, mt: 4 }} elevation={2}>
              <Typography variant="h6" gutterBottom>
                Recommended Treatment
              </Typography>
              <Typography paragraph>{treatment.treatment}</Typography>

              <Typography variant="subtitle1" gutterBottom>
                Medications:
              </Typography>
              <List>
                {treatment.medications.map((medication) => (
                  <ListItem key={medication}>
                    <ListItemText primary={medication} />
                  </ListItem>
                ))}
              </List>

              <Typography variant="subtitle1" gutterBottom>
                Precautions:
              </Typography>
              <List>
                {treatment.precautions.map((precaution) => (
                  <ListItem key={precaution}>
                    <ListItemText primary={precaution} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )
        )}

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={() => navigate('/diagnosis')}
            sx={{ minWidth: 200 }}
          >
            Start New Diagnosis
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Results; 