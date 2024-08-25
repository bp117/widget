import React, { useState } from 'react';
import {
  TextField,
  Box,
  Typography,
  List,
  ListItem,
  Divider,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BookIcon from '@mui/icons-material/Book';
import { styled } from '@mui/system';
import CustomLoading from './CustomLoading';  // Import the loading component

const SearchContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#f1f3f4',
  borderRadius: '24px',
  padding: '10px',
  width: '100%',
  maxWidth: '600px',
  margin: '0 auto',
  marginBottom: '20px',
});

const SearchInput = styled(TextField)({
  flexGrow: 1,
  '& .MuiOutlinedInput-root': {
    borderRadius: '24px',
    backgroundColor: '#fff',
  },
});

const SectionTitle = styled(Typography)({
  fontWeight: 'bold',
  fontSize: '1.2rem',
  color: '#333',
});

const ContextText = styled(Box)({
  marginBottom: '10px',
  '& p': {
    margin: 0,
  },
  color: '#555',
});

const ReferenceLink = styled(Typography)({
  fontSize: '0.875rem',
  color: 'grey',
  textDecoration: 'underline',
  display: 'flex',
  alignItems: 'center',
  marginTop: '10px',
});

const ResultCard = styled(Paper)({
  padding: '20px',
  marginBottom: '20px',
  borderRadius: '10px',
  backgroundColor: '#f9f9f9',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)',
  },
});

const SearchWidget = ({ useCaseId: initialUseCaseId, promptId: initialPromptId, apiKey: initialApiKey, apiUrl }) => {
  const [useCaseId, setUseCaseId] = useState(initialUseCaseId || '');
  const [promptId, setPromptId] = useState(initialPromptId || '');
  const [apiKey, setApiKey] = useState(initialApiKey || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setLoading(true);
      setResults([]); // Clear previous results

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`, // Use the apiKey in the headers
          },
          body: JSON.stringify({
            useCaseId: useCaseId,
            promptId: promptId,
            query: searchQuery, // The entered search string
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setResults(data.result); // Assuming the API returns a 'result' array
      } catch (error) {
        console.error('Error fetching data:', error);
        // Use mock data in case of error
        setResults([
          {
            section_title: 'Mock Section Title 1',
            context: 'This is some mock presentation context with <b>HTML</b> tags.',
            book: 'Mock Book 1',
            book_hyperlink: 'https://example.com/book1',
          },
          {
            section_title: 'Mock Section Title 2',
            context: 'Another mock context. <i>More HTML tags</i> can be included here.',
            book: 'Mock Book 2',
            book_hyperlink: 'https://example.com/book2',
          },
          {
            section_title: 'Mock Section Title 3',
            context: 'Final mock data. It includes <u>underline</u> and other tags.',
            book: 'Mock Book 3',
            book_hyperlink: 'https://example.com/book3',
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        padding: '20px',
        boxSizing: 'border-box',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <form>
        {!initialUseCaseId && (
          <TextField
            label="Use Case ID"
            variant="outlined"
            fullWidth
            value={useCaseId}
            onChange={(e) => setUseCaseId(e.target.value)}
            sx={{ marginBottom: '20px' }}
          />
        )}
        {!initialPromptId && (
          <TextField
            label="Prompt ID"
            variant="outlined"
            fullWidth
            value={promptId}
            onChange={(e) => setPromptId(e.target.value)}
            sx={{ marginBottom: '20px' }}
          />
        )}
        {!initialApiKey && (
          <TextField
            label="API Key"
            variant="outlined"
            fullWidth
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            sx={{ marginBottom: '20px' }}
          />
        )}
        <SearchContainer>
          <SearchIcon sx={{ marginRight: '10px', color: '#5f6368' }} />
          <SearchInput
            variant="outlined"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch} // Trigger search on Enter key
          />
        </SearchContainer>
      </form>
      {loading && <CustomLoading />}
      {!loading && results.length > 0 && (
        <Typography variant="body2" color="textSecondary" sx={{ marginBottom: '20px' }}>
          Showing {results.length} result{results.length > 1 ? 's' : ''}
        </Typography>
      )}
      <List>
        {results.map((result, index) => (
          <ResultCard key={index}>
            <SectionTitle>{result.section_title}</SectionTitle>
            <ContextText dangerouslySetInnerHTML={{ __html: result.context }} />
            {result.book_hyperlink && (
              <ReferenceLink component="a" href={result.book_hyperlink} target="_blank" rel="noopener noreferrer">
                <BookIcon sx={{ marginRight: '5px' }} />
                {result.book}
              </ReferenceLink>
            )}
            {index < results.length - 1 && <Divider sx={{ marginTop: '20px' }} />}
          </ResultCard>
        ))}
      </List>
    </Box>
  );
};

export default SearchWidget;
