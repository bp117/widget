import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  createTheme,
  ThemeProvider,
  CssBaseline,
  CircularProgress,
  Drawer,
  Snackbar,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { Save, Edit } from '@mui/icons-material';
import axios from 'axios';

const App: React.FC = () => {
  const [useCase, setUseCase] = useState<string>('');
  const [useCases, setUseCases] = useState<string[]>([]);
  const [isDropdownLoading, setIsDropdownLoading] = useState<boolean>(true);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false); // To differentiate between Create and Edit
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [contentOption, setContentOption] = useState<string>('Generic');
  const [useCaseId, setUseCaseId] = useState<string>(''); // Separate use case ID
  const [useCaseName, setUseCaseName] = useState<string>('');
  const [chatAnswer, setChatAnswer] = useState<string>('');
  const [chatWork, setChatWork] = useState<string>('');

  // Load use cases when the component mounts
  useEffect(() => {
    const loadUseCases = async () => {
      setIsDropdownLoading(true);
      try {
        const response = await axios.get('your-api-url-for-usecases');
        setUseCases(response.data); // Assuming the data is a list of use cases
      } catch (error) {
        console.error('Error loading use cases', error);
      } finally {
        setIsDropdownLoading(false);
      }
    };

    loadUseCases();
  }, []);

  // Handle drawer open for Create App
  const handleCreateApp = () => {
    setDrawerOpen(true);
    setIsEditMode(false); // Switch to Create mode
    setUseCaseId(''); // Clear form fields
    setUseCaseName('');
    setChatAnswer('');
    setChatWork('');
    setContentOption('Generic');
  };

  // Handle drawer open for Edit App
  const handleEditApp = async (selectedUseCase: string) => {
    setIsEditMode(true); // Switch to Edit mode
    setDrawerOpen(true);
    try {
      const response = await axios.get(`your-api-url-for-app-details/${selectedUseCase}`);
      const appDetails = response.data;
      setUseCaseId(appDetails.useCaseId);
      setUseCaseName(appDetails.useCaseName);
      setChatAnswer(appDetails.chatAnswer);
      setChatWork(appDetails.chatWork);
      setContentOption(appDetails.contentOption);
    } catch (error) {
      console.error('Error loading app details', error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const dataToSave = {
      useCaseId,
      useCaseName,
      chatAnswer,
      chatWork,
      contentOption,
    };

    try {
      if (isEditMode) {
        // Call the API to update the app if in Edit mode
        await axios.put(`your-api-update-url/${useCaseId}`, dataToSave);
      } else {
        // Call the API to create a new app if in Create mode
        await axios.post('your-api-create-url', dataToSave);
      }

      setSnackbarOpen(true); // Show success snackbar
    } catch (error) {
      console.error('Error saving app data', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const theme = createTheme({
    palette: {
      mode: 'light', // Switch to 'dark' for dark mode
    },
  });

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box sx={{ padding: '20px' }}>
        {/* Use Case Dropdown */}
        <FormControl fullWidth sx={{ marginBottom: '20px' }}>
          <InputLabel>Use Case</InputLabel>
          <Select
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
            label="Use Case"
            disabled={isDropdownLoading}
            startAdornment={
              isDropdownLoading ? <CircularProgress size={20} sx={{ marginRight: '10px' }} /> : null
            }
          >
            {useCases.map((uc) => (
              <MenuItem key={uc} value={uc}>
                {uc}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Create and Edit App Buttons */}
        <Button
          variant="contained"
          onClick={handleCreateApp}
          sx={{ marginRight: '10px' }}
        >
          Create App
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleEditApp(useCase)}
          disabled={!useCase} // Disable if no use case is selected
          startIcon={<Edit />}
        >
          Edit App
        </Button>

        {/* Drawer for Create/Edit App */}
        <Drawer anchor="bottom" open={drawerOpen} onClose={handleDrawerClose}>
          <Box sx={{ padding: '20px' }}>
            <Typography variant="h6">
              {isEditMode ? 'Edit Use Case' : 'Create New Use Case'}
            </Typography>

            {/* Use Case ID */}
            <TextField
              fullWidth
              label="Use Case ID"
              value={useCaseId}
              onChange={(e) => setUseCaseId(e.target.value)}
              sx={{ marginBottom: '10px' }}
              helperText="Enter the use case ID."
              disabled={isEditMode} // Disable Use Case ID in Edit Mode
            />

            {/* Use Case Name */}
            <TextField
              fullWidth
              label="Use Case Name"
              value={useCaseName}
              onChange={(e) => setUseCaseName(e.target.value)}
              sx={{ marginBottom: '10px' }}
              helperText="Enter a friendly name for the use case."
            />

            {/* Textareas for Chatbot Information */}
            <TextField
              fullWidth
              label="This chatbot can answer questions related to..."
              value={chatAnswer}
              onChange={(e) => setChatAnswer(e.target.value)}
              multiline
              rows={4}
              sx={{ marginBottom: '10px' }}
              helperText="Describe what this chatbot can answer."
            />
            <TextField
              fullWidth
              label="How this bot works and responds..."
              value={chatWork}
              onChange={(e) => setChatWork(e.target.value)}
              multiline
              rows={4}
              sx={{ marginBottom: '10px' }}
              helperText="Describe how this chatbot responds and works."
            />

            {/* Content Option */}
            <Typography variant="subtitle1" sx={{ marginBottom: '10px' }}>
              Content
            </Typography>
            <RadioGroup
              aria-label="contentOption"
              name="contentOption"
              value={contentOption}
              onChange={(e) => setContentOption(e.target.value)}
            >
              <FormControlLabel
                value="Generic"
                control={<Radio />}
                label={
                  <>
                    <Typography variant="body1">Generic</Typography>
                    <Typography variant="body2" sx={{ color: 'grey' }}>
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
                    <Typography variant="body2" sx={{ color: 'grey' }}>
                      Search tailored for consumer-focused media platforms like audio or video streaming and digital publishing.
                    </Typography>
                  </>
                }
              />
            </RadioGroup>

            {/* Save Button with Loading */}
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={isSaving}
                startIcon={isSaving ? <CircularProgress size={20} /> : <Save />}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </Box>
          </Box>
        </Drawer>

        {/* Snackbar for
