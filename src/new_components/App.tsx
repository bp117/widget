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
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import TemplateCard from './components/TemplateCard';
import FancySearchWidget from './components/FancySearchWidget';
import Lightbox from 'react-18-image-lightbox';
import 'react-18-image-lightbox/style.css'; // Import lightbox styles
interface ParametersProps {
  [key: string]: string;
}

const App: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [parameters, setParameters] = useState<ParametersProps>({});
  const [useCase, setUseCase] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxImage, setLightboxImage] = useState<string>('');

  const handleGraphClick = (template: string) => {
    let imagePath = '';
    if (template === 'IR') {
      imagePath = 'langgraph1.png';
    } else if (template === 'RAG') {
      imagePath = 'langgraph2.png';
    } else if (template === 'ChatBot') {
      imagePath = 'langgraph3.png';
    }
    setLightboxImage(imagePath);
    setLightboxOpen(true);
  };

  const handleTemplateClick = (template: string) => {
    setSelectedTemplate(template);
    if (template === 'IR') {
      setParameters({ 'Search Type': '', 'Results Limit': '' });
    } else if (template === 'RAG') {
      setParameters({ 'Document ID': '', 'Context Size': '', 'Model Type': '' });
    } else if (template === 'ChatBot') {
      setParameters({ 'Bot Name': '', 'Language': '' });
    }
  };

  const handleParameterChange = (param: string, value: string) => {
    setParameters((prev) => ({ ...prev, [param]: value }));
  };

  const handleDownload = () => {
    alert("Download button clicked");
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
        default: darkMode ? '#121212' : '#ffffff',
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
                  flexWrap: 'nowrap', // Prevent wrapping
                  overflowX: 'auto', // Allow horizontal scrolling
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

            {selectedTemplate && (
              <Box sx={{ marginTop: '20px' }}>
                <Typography variant="h6">{selectedTemplate} Parameters</Typography>
                {Object.keys(parameters).map((param) => (
                  <TextField
                    key={param}
                    label={param}
                    fullWidth
                    variant="outlined"
                    value={parameters[param]}
                    onChange={(e) => handleParameterChange(param, e.target.value)}
                    sx={{ marginBottom: '10px' }}
                  />
                ))}
              </Box>
            )}
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
        <Lightbox
          mainSrc={lightboxImage}
          onCloseRequest={() => setLightboxOpen(false)}
        />
      )}
    </ThemeProvider>
  );
};

export default App;
