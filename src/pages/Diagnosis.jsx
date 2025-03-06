import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import axios from 'axios';
import config from '../config';

function Diagnosis() {
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState([]);
  const [availableSymptoms, setAvailableSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response = await axios.get(`${config.apiBaseUrl}/api/get_symptoms`);
        setAvailableSymptoms(response.data.symptoms);
      } catch (error) {
        setError('Failed to load symptoms. Please try again later.');
        console.error('Error fetching symptoms:', error);
      }
    };

    fetchSymptoms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (symptoms.length === 0) {
      setError('Please enter at least one symptom');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${config.apiBaseUrl}/api/predict`, {
        symptoms: symptoms.join(', '),
      });

      navigate('/results', { state: { diagnosis: response.data } });
    } catch (error) {
      setError('Failed to get diagnosis. Please try again.');
      console.error('Error getting diagnosis:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Symptom Diagnosis
        </Typography>
        <Typography color="text.secondary" paragraph>
          Enter your symptoms below for an AI-powered diagnosis
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 4, mt: 4 }} elevation={2}>
          <form onSubmit={handleSubmit}>
            <Autocomplete
              multiple
              value={symptoms}
              onChange={(event, newValue) => {
                setSymptoms(newValue);
                setError('');
              }}
              inputValue={inputValue}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              options={availableSymptoms}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                    color="primary"
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Enter Symptoms"
                  placeholder="Type your symptoms"
                  fullWidth
                  error={!!error}
                />
              )}
            />

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={symptoms.length === 0 || loading}
                sx={{ minWidth: 200 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Get Diagnosis'
                )}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default Diagnosis; 