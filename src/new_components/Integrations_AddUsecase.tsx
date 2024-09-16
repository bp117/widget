import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Snackbar,
  Alert,
  Drawer,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const App: React.FC = () => {
  const [useCase, setUseCase] = useState<string>('');
  const [useCases, setUseCases] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [useCaseId, setUseCaseId] = useState<string>('');
  const [useCaseName, setUseCaseName] = useState<string>('');
  const [chatbotRelatedTo, setChatbotRelatedTo] = useState<string>('');
  const [botDescription, setBotDescription] = useState<string>('');
  const [contentOption, setContentOption] = useState<string>('Generic'); // Radio button state

  const fetchUseCases = async () => {
    try {
      const response = await axios.get('http://localhost:8000/get-usecases');
      setUseCases(response.data.useCases);
    } catch (error) {
      console.error('Failed to fetch use cases:', error);
    }
  };

  useEffect(() => {
    fetchUseCases();
  }, []);

  const handleCreateAppClick = () => {
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleSaveApp = async () => {
    const newUseCase = { useCaseId, useCaseName, chatbotRelatedTo, botDescription, contentOption };

    // Add the new use case to the dropdown list
    setUseCases((prevUseCases) => [...prevUseCases, useCaseName]);

    // Close the drawer
    handleCloseDrawer();

    // Reset form fields
    setUseCaseId('');
    setUseCaseName('');
    setChatbotRelatedTo('');
    setBotDescription('');

    // Set the new use case as the selected one
    setUseCase(useCaseName);
  };

  return (
    <ThemeProvider theme={createTheme({ palette: { mode: darkMode ? 'dark' : 'light' } })}>
      <CssBaseline />
      <Box sx={{ height: '100vh', padding: '20px' }}>
        <Grid container spacing={2} justifyContent="space-between" alignItems="center">
          <Grid item xs={8}>
            <FormControl fullWidth variant="outlined" sx={{ marginBottom: '20px' }}>
              <InputLabel>Use Case</InputLabel>
              <Select
                value={useCase}
                onChange={(e) => setUseCase(e.target.value as string)}
                label="Use Case"
              >
                {useCases.map((useCaseOption, index) => (
                  <MenuItem key={index} value={useCaseOption}>
                    {useCaseOption}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateAppClick}>
              Create App
            </Button>
          </Grid>
        </Grid>

        {/* Full-screen Drawer for Create App */}
        <Drawer
          anchor="bottom"
          open={drawerOpen}
          onClose={handleCloseDrawer}
          PaperProps={{
            sx: { padding: '20px', height: '100vh', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' },
          }}
          transitionDuration={400}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Create New App</Typography>
            <IconButton onClick={handleCloseDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ marginBottom: '20px' }} />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Use Case ID"
                variant="outlined"
                value={useCaseId}
                onChange={(e) => setUseCaseId(e.target.value)}
              />
              <Typography variant="caption" sx={{ color: 'grey' }}>
                A unique identifier for the use case.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Use Case Name"
                variant="outlined"
                value={useCaseName}
                onChange={(e) => setUseCaseName(e.target.value)}
              />
              <Typography variant="caption" sx={{ color: 'grey' }}>
                A descriptive name for the use case.
              </Typography>
            </Grid>

            {/* Content Option with Radio Buttons */}
            <Grid item xs={12}>
              <Typography variant="h6">Content</Typography>
              <RadioGroup
                value={contentOption}
                onChange={(e) => setContentOption(e.target.value)}
              >
                <FormControlLabel
                  value="Generic"
                  control={<Radio />}
                  label={
                    <>
                      <Typography variant="body1">Generic</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Powerful search out-of-the-box, utilizing advanced AI for accurate, intent-focused search results.
                      </Typography>
                    </>
                  }
                />
                <FormControlLabel
                  value="Media"
                  control={<Radio />}
                  label={
                    <>
                      <Typography variant="body1">Media</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Search tailored for consumer-focused media platforms, like audio or video streaming and digital publishing. Media search leverages user interactions for content discovery.
                      </Typography>
                    </>
                  }
                />
              </RadioGroup>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="This chatbot can answer questions related to"
                variant="outlined"
                value={chatbotRelatedTo}
                onChange={(e) => setChatbotRelatedTo(e.target.value)}
              />
              <Typography variant="caption" sx={{ color: 'grey' }}>
                Provide a brief description of what topics this chatbot can answer.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="How this bot works and responds"
                variant="outlined"
                value={botDescription}
                onChange={(e) => setBotDescription(e.target.value)}
              />
              <Typography variant="caption" sx={{ color: 'grey' }}>
                Explain how the bot works and how it processes and responds to user questions.
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ marginTop: '20px', textAlign: 'right' }}>
            <Button variant="contained" onClick={handleSaveApp}>
              Save
            </Button>
          </Box>
        </Drawer>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity="error">
            Please select a use case before choosing a template!
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default App;
