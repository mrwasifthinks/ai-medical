import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

function Navbar() {
  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <LocalHospitalIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AI Medical Diagnosis
          </Typography>
          <Box>
            <Button
              color="inherit"
              component={RouterLink}
              to="/"
            >
              Home
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/diagnosis"
            >
              Start Diagnosis
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar; 