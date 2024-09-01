import React, { useState, useRef } from 'react';
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
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import TemplateCard from './TemplateCard';
import FancySearchWidget from './FancySearchWidget';
import axios from 'axios';

const App: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [parameters, setParameters] = useState<any[]>([]);
  const [useCase, setUseCase] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [widgetParams, setWidgetParams] = useState<any>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchParameters = async (template: string) => {
    setLoading(true);
    try {
      // Check if there's a saved configuration in the DB
      const savedConfigResponse = await axios.get('http://localhost:8000/get-config', {
        params: {
          usecaseId: useCase,
          graphType: template,
        },
      });

      if (savedConfigResponse.status === 200) {
        // Pre-fill parameters with saved config
        const savedConfig = savedConfigResponse.data;
        const graphParams = Object.keys(savedConfig).filter(key => key !== "usecaseId" && key !== "graphType" && key !== "_id").map(key => ({
          fieldName: key,
          fieldDisplayName: savedConfig[key].fieldDisplayName || key,
          fieldType: typeof savedConfig[key],
          value: savedConfig[key],
        }));
        setParameters(graphParams);
      } else {
        // If no saved config, fetch default parameters
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
      alert("Please select a use case and a template.");
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
        alert("Configuration saved successfully!");
      }
    } catch (error) {
      console.error('Failed to save configuration:', error);
      alert("Failed to save configuration.");
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

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1d1d1d' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#000000',
        secondary: darkMode ? '#b0b0b0' : '#5f5f5f',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ height: '100vh', padding: '20px' }}>
        <Button
          variant="contained"
          onClick={handleThemeToggle}
          sx={{ marginBottom: '20px' }}
        >
          Toggle {darkMode ? 'Light' : 'Dark'} Mode
        </Button>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined" sx={{ marginBottom: '20px' }}>
              <InputLabel>Use Case</InputLabel>
              <Select
                value={useCase}
                onChange={(e) => setUseCase(e.target.value as string)}
                label="Use Case"
              >
                <MenuItem value="useCase1">Use Case 1</MenuItem>
                <MenuItem value="useCase2">Use Case 2</MenuItem>
                <MenuItem value="useCase3">Use Case 3</MenuItem>
              </Select>
            </FormControl>

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
                  onGraphClick={() => handleGraphClick('IR')}
                />
                <TemplateCard
                  title="Retriever Augmented Generation (RAG)"
                  description="Combine retrieval of documents with generative AI to produce accurate answers."
                  darkMode={darkMode}
                  selected={selectedTemplate === 'RAG'}
                  onClick={() => handleTemplateClick('RAG')}
                  onGraphClick={() => handleGraphClick('RAG')}
                />
                <TemplateCard
                  title="Conversational Chatbot"
                  description="Create a bot capable of engaging in natural language conversations with users."
                  darkMode={darkMode}
                  selected={selectedTemplate === 'ChatBot'}
                  onClick={() => handleTemplateClick('ChatBot')}
                  onGraphClick={() => handleGraphClick('ChatBot')}
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

            {/* Add the Save and Try Out buttons */}
            <Box sx={{ marginTop: '20px' }}>
              <Button variant="contained" color="primary" onClick={handleSaveConfiguration} sx={{ marginRight: '10px' }}>
                Save Configuration
              </Button>
              <Button variant="outlined" color="primary" onClick={handleTryOut}>
                Try Out
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                backgroundColor: theme.palette.background.paper,
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
              }}
            >
              <Typography variant="h5" sx={{ marginBottom: '20px', color: theme.palette.text.primary }}>
                Widget Preview
              </Typography>

              <Box
                sx={{
                  width: '100%',
                  maxHeight: '300px',
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: '8px',
                  marginBottom: '20px',
                  padding: '20px',
                  overflow: 'auto',
                  color: theme.palette.text.primary,
                }}
              >
                {selectedTemplate === 'IR' || selectedTemplate === 'RAG' ? (
                  <FancySearchWidget
                    apiUrl="your-api-url-here"
                    task={selectedTemplate === 'IR' ? 'IR' : 'RAG'}
                    useCaseId={useCase}
                    promptId="your-prompt-id-here"
                    apiKey="your-api-key-here"
                    darkMode={darkMode}
                    {...widgetParams} // Pass the widget parameters here
                  />
                ) : (
                  <Typography variant="body1" sx={{ padding: '20px', textAlign: 'center', color: theme.palette.text.primary }}>
                    Select a template to preview
                  </Typography>
                )}
              </Box>

              <Button variant="contained" color="primary" onClick={handleDownload}>
                Download Widget
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {lightboxOpen && (
        <Suspense fallback={<CircularProgress />}>
          <Lightbox
            mainSrc={lightboxImage}
            onCloseRequest={() => setLightboxOpen(false)}
          />
        </Suspense>
      )}
    </ThemeProvider>
  );
};

export default App;
