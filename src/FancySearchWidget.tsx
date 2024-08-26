import React, { useState, KeyboardEvent } from 'react';
import {
  TextField,
  Box,
  Typography,
  List,
  Paper,
  Divider,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import BookIcon from '@mui/icons-material/Book';
import { styled } from '@mui/system';
import CustomLoading from './CustomLoading';

interface FancySearchWidgetProps {
  useCaseId?: string;
  promptId?: string;
  apiKey?: string;
  apiUrl: string;
}

interface SearchResult {
  section_title: string;
  context: string;
  book: string;
  book_hyperlink: string;
}

interface Conversation {
  query: string;
  results: SearchResult[];
}

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

const QuestionBox = styled(Box)({
  backgroundColor: '#e8f0fe',
  padding: '10px 15px',
  borderRadius: '12px',
  marginBottom: '10px',
  border: '1px solid #c5cae9',
  display: 'inline-block',
  textAlign: 'right',
});

const ResultBox = styled(Box)({
  backgroundColor: '#f9f9f9',
  padding: '15px',
  borderRadius: '12px',
  marginBottom: '10px',
  border: '1px solid #e0e0e0',
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

const FancySearchWidget: React.FC<FancySearchWidgetProps> = ({
  useCaseId: initialUseCaseId = '',
  promptId: initialPromptId = '',
  apiKey: initialApiKey = '',
  apiUrl,
}) => {
  const [useCaseId, setUseCaseId] = useState<string>(initialUseCaseId);
  const [promptId, setPromptId] = useState<string>(initialPromptId);
  const [apiKey, setApiKey] = useState<string>(initialApiKey);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isAppending, setIsAppending] = useState<boolean>(false);

  const mockData: SearchResult[] = [
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
  ];

  const handleSearch = async (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setLoading(true);

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            useCaseId: useCaseId,
            promptId: promptId,
            query: searchQuery,
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const newResults = data.result as SearchResult[]; // Assuming the API returns a 'result' array

        const newConversation: Conversation = {
          query: searchQuery,
          results: newResults,
        };

        if (isAppending) {
          setConversations((prevConversations) => [...prevConversations, newConversation]);
        } else {
          setConversations([newConversation]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Use mock data in case of an error
        const newConversation: Conversation = {
          query: searchQuery,
          results: mockData,
        };
        if (isAppending) {
          setConversations((prevConversations) => [...prevConversations, newConversation]);
        } else {
          setConversations([newConversation]);
        }
      } finally {
        setLoading(false);
        setIsAppending(false); // Reset appending state after search
      }
    }
  };

  const handleAskFollowUp = () => {
    setIsAppending(true);
    setSearchQuery(''); // Clear the search input field
  };

  const handleAskNewQuestion = () => {
    setSearchQuery(''); // Clear the search input field
    setConversations([]); // Clear previous conversations
    setIsAppending(false);
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
            onKeyDown={handleSearch}
          />
        </SearchContainer>
      </form>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAskFollowUp}
          sx={{ borderRadius: '24px', padding: '10px 20px' }}
        >
          Ask A Follow-Up
        </Button>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleAskNewQuestion}
          sx={{ borderRadius: '24px', padding: '10px 20px' }}
        >
          Ask A New Question
        </Button>
      </Box>
      {loading && <CustomLoading />}
      <List>
        {conversations.map((conversation, index) => (
          <React.Fragment key={index}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <QuestionBox>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
                  {conversation.query}
                </Typography>
              </QuestionBox>
            </Box>
            {conversation.results.map((result, resultIndex) => (
              <ResultBox key={resultIndex}>
                <SectionTitle>{result.section_title}</SectionTitle>
                <ContextText dangerouslySetInnerHTML={{ __html: result.context }} />
                {result.book_hyperlink && (
                  <ReferenceLink component="a" href={result.book_hyperlink} target="_blank" rel="noopener noreferrer">
                    <BookIcon sx={{ marginRight: '5px' }} />
                    {result.book}
                  </ReferenceLink>
                )}
                {resultIndex < conversation.results.length - 1 && <Divider sx={{ marginTop: '20px' }} />}
              </ResultBox>
            ))}
            {index < conversations.length - 1 && <Divider sx={{ margin: '20px 0' }} />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default FancySearchWidget;
