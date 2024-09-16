import React, { useState, useRef, Suspense } from 'react';
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
  createTheme,
  ThemeProvider,
  CssBaseline,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  Drawer,
  Divider,
  Switch,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import TemplateCard from './TemplateCard';
import FancySearchWidget from './FancySearchWidget';
import axios from 'axios';

const App: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [parameters, setParameters] = useState<any[]>([]);
  const [useCase, setUseCase] = useState<string>('');
  const [useCases, setUseCases] = useState<string[]>([]); // State for use case dropdown list
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [widgetParams, setWidgetParams] = useState<any>({});
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false); // Snackbar state
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false); // Drawer state
  const [isNewSystemPrompt, setIsNewSystemPrompt] = useState<boolean>(false); // Switch state
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch initial use case data
  const fetchUseCases = async () => {
    try {
      const response = await axios.get('http://localhost:8000/get-usecases');
      setUseCases(response.data.useCases);
    } catch (error) {
      console.error('Failed to fetch use cases:', error);
    }
  };

  // Initial fetch of use cases
  React.useEffect(() => {
    fetchUseCases();
  }, []);

  const fetchParameters = async (template: string) => {
    setLoading(true);
    try {
      const savedConfigResponse = await axios.get('http://localhost:8000/get-config', {
        params: {
          usecaseId: useCase,
          graphType: template,
        },
      });

      if (savedConfigResponse.status === 200) {
        const savedConfig = savedConfigResponse.data;
        const graphParams = Object.keys(savedConfig)
          .filter(key => key !== 'usecaseId' && key !== 'graphType' && key !== '_id')
          .map(key => ({
            fieldName: key,
            fieldDisplayName: savedConfig[key].fieldDisplayName || key,
            fieldType: typeof savedConfig[key],
            value: savedConfig[key],
          }));
        setParameters(graphParams);
      } else {
        const response = await axios.get(`your-api-url/${template}`);
        const { graphParams } = response.data.graph_template;
        setParameters(graphParams);
      }
    } catch (error) {
      console.error('Failed to fetch parameters:', error);
      setParameters([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateClick = (template: string) => {
    if (!useCase) {
      setSnackbarOpen(true);
      return;
    }
    setSelectedTemplate(template);
    fetchParameters(template);
  };

  const handleParameterChange = (paramIndex: number, value: any) => {
    setParameters((prev) => {
      const updatedParams = [...prev];
      updatedParams[paramIndex].value = value;
      return updatedParams;
    });
  };

  const handleSaveConfiguration = async () => {
    if (!selectedTemplate || !useCase) {
      alert('Please select a use case and a template.');
      return;
    }

    const config = {
      usecaseId: useCase,
      graphType: selectedTemplate,
      ...parameters.reduce((acc, param) => {
        acc[param.fieldName] = param.value;
        return acc;
      }, {}),
    };

    try {
      const response = await axios.post('http://localhost:8000/save-config', config);
      if (response.data.status === 'success') {
        alert('Configuration saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save configuration:', error);
      alert('Failed to save configuration.');
    }
  };

  const handleTryOut = () => {
    const params = parameters.reduce((acc, param) => {
      acc[param.fieldName] = param.value;
      return acc;
    }, {});

    setWidgetParams({
      ...params,
      useCaseId: useCase,
      graphType: selectedTemplate,
    });
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth',
      });
    }
  };

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Handle opening and closing of the drawer
  const handleCreateAppClick = () => {
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  // Handle Save in Create App Drawer and update use case dropdown
  const handleSaveApp = async () => {
    // Mock new use case (replace this with your API call to create a new use case)
    const newUseCase = 'New Use Case'; // Get this from the form input

    // Add the new use case to the dropdown list
    setUseCases((prevUseCases) => [...prevUseCases, newUseCase]);

    // Close the drawer
    handleCloseDrawer();

    // Optionally, set the new use case as the selected one
    setUseCase(newUseCase);
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
          <Grid item xs={4} sx={{ textAlign: 'right' }}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateAppClick}>
              Create App
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <IconButton onClick={() => handleScroll('left')}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'nowrap',
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              width: '100%',
              padding: '10px',
            }}
            ref={scrollRef}
          >
            <TemplateCard
              title="Information Retrieval (IR)"
              description="Fetch information quickly from a large dataset based on search queries."
              darkMode={darkMode}
              selected={selectedTemplate === 'IR'}
              onClick={() => handleTemplateClick('IR')}
            />
            <TemplateCard
              title="Retriever Augmented Generation (RAG)"
              description="Combine retrieval of documents with generative AI to produce accurate answers."
              darkMode={darkMode}
              selected={selectedTemplate === 'RAG'}
              onClick={() => handleTemplateClick('RAG')}
            />
            <TemplateCard
              title="Conversational Chatbot"
              description="Create a bot capable of engaging in natural language conversations with users."
              darkMode={darkMode}
              selected={selectedTemplate === 'ChatBot'}
              onClick={() => handleTemplateClick('ChatBot')}
            />
          </Box>
          <IconButton onClick={() => handleScroll('right')}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <CircularProgress />
          </Box>
        ) : (
          selectedTemplate && parameters.length > 0 && (
            <Box sx={{ marginTop: '20px' }}>
              <Typography variant="h6">{selectedTemplate} Parameters</Typography>
              {parameters.map((param, index) => (
                param.fieldType === 'boolean' ? (
                  <FormControlLabel
                    key={param.fieldName}
                    control={
                      <Checkbox
                        checked={param.value || false}
                        onChange={(e) => handleParameterChange(index, e.target.checked)}
                        name={param.fieldName}
                        color="primary"
                      />
                    }
                    label={param.fieldDisplayName}
                    sx={{ marginBottom: '10px' }}
                  />
                ) : (
                  <TextField
                    key={param.fieldName}
                    label={param.fieldDisplayName}
                    fullWidth
                    variant="outlined"
                    type={param.fieldType === 'int' ? 'number' : 'text'}
                    value={param.value || ''}
                    onChange={(e) => handleParameterChange(index, e.target.value)}
                    sx={{ marginBottom: '10px' }}
                  />
                )
              ))}
            </Box>
          )
        )}

        <Box sx={{ marginTop: '20px' }}>
          <Button variant="contained" color="primary" onClick={handleSaveConfiguration} sx={{ marginRight: '10px' }}>
            Save Configuration
          </Button>
          <Button variant="outlined" color="primary" onClick={handleTryOut}>
            Try Out
          </Button>
        </Box>

        {/* Drawer for Create App */}
        <Drawer
          anchor="bottom"
          open={drawerOpen}
          onClose={handleCloseDrawer}
          PaperProps={{
            sx: { padding: '20px', height: '60vh', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' },
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
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Use Case ID" variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Use Case Name" variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Model</InputLabel>
                <Select label="Model">
                  <MenuItem value="model1">Model 1</MenuItem>
                  <MenuItem value="model2">Model 2</MenuItem>
                  <MenuItem value="model3">Model 3</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Embedding Model</InputLabel>
                <Select label="Embedding Model">
                  <MenuItem value="embedding1">Embedding Model 1</MenuItem>
                  <MenuItem value="embedding2">Embedding Model 2</MenuItem>
                  <MenuItem value="embedding3">Embedding Model 3</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="System Prompt ID" variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="System Prompt Name" variant="outlined" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={4} label="System Prompt (User)" variant="outlined" />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch checked={isNewSystemPrompt} onChange={() => setIsNewSystemPrompt(!isNewSystemPrompt)} />
                }
                label="Is New System Prompt"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Prompt ID" variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Prompt Name" variant="outlined" />
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
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity="error">
            Please select a use case before choosing a template!
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default App;
