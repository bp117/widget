import React, { useState, KeyboardEvent } from 'react';
import {
  TextField,
  Box,
  Typography,
  List,
  Divider,
  Button,
  AppBar,
  Toolbar,
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
  task: 'IR' | 'RAG';
}

interface IRResult {
  book: string;
  presentation_context: string;
  id: string;
  hyperlink: string;
}

interface RAGResult {
  generated_resp: string[];
  citations: {
    book: string;
    passage_id: string;
    hyperlink: string;
    context: string;
  }[];
}

interface Conversation {
  query: string;
  results: (IRResult | RAGResult)[];
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
  task,
}) => {
  const [useCaseId, setUseCaseId] = useState<string>(initialUseCaseId);
  const [promptId, setPromptId] = useState<string>(initialPromptId);
  const [apiKey, setApiKey] = useState<string>(initialApiKey);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isAppending, setIsAppending] = useState<boolean>(false);

  const mockIRData: IRResult[] = [
    {
      book: 'Mock Section Title 1',
      presentation_context: 'This is some mock presentation context with <b>HTML</b> tags.',
      id: 'Mock Book 1',
      hyperlink: 'https://example.com/book1',
    },
  ];

  const mockRAGData: RAGResult = {
    generated_resp: ['This is a mock generated response.'],
    citations: [
      {
        book: 'Mock Book Title',
        passage_id: 'Mock Passage 1',
        hyperlink: 'https://example.com/mock',
        context: 'This is some mock presentation context with <b>HTML</b> tags.',
      },
    ],
  };

  const handleSearch = async (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setLoading(true);

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
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

        let newResults: (IRResult | RAGResult)[] = [];

        if (task === 'IR' && Array.isArray(data.result)) {
          // Handle IR task response
          newResults = data.result;
        } else if (task === 'RAG' && data.result.generated_resp) {
          // Handle RAG task response
          newResults = data.result.generated_resp.map((resp: string, index: number) => ({
            generated_resp: [resp],
            citations: data.result.citations ? [data.result.citations[index]] : [],
          }));
        }

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
          results: task === 'IR' ? mockIRData : [mockRAGData],
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
    <Box sx={{ width: '100%', backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ backgroundColor: '#3f51b5' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <img
              src="/path-to-your-logo.png" // Replace with your logo's path
              alt="Logo"
              style={{ height: '40px', marginRight: '10px' }}
            />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
              Use Case: {useCaseId || 'N/A'}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          padding: '20px',
          boxSizing: 'border-box',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          marginTop: '20px',
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
              {conversation.results.map((result, resultIndex) => {
                if (task === 'IR') {
                  const irResult = result as IRResult;
                  return (
                    <ResultBox key={resultIndex}>
                      <SectionTitle>{irResult.book}</SectionTitle>
                      <ContextText dangerouslySetInnerHTML={{ __html: irResult.presentation_context }} />
                      <ReferenceLink component="a" href={irResult.hyperlink} target="_blank" rel="noopener noreferrer">
                        <BookIcon sx={{ marginRight: '5px' }} />
                        {irResult.book}
                      </ReferenceLink>
                      {resultIndex < conversation.results.length - 1 && <Divider sx={{ marginTop: '20px' }} />}
                    </ResultBox>
                  );
                } else if (task === 'RAG') {
                  const ragResult = result as RAGResult;
                  return (
                    <ResultBox key={resultIndex}>
                      {ragResult.generated_resp.map((resp, respIndex) => (
                        <ContextText key={respIndex}>{resp}</ContextText>
                      ))}
                      {ragResult.citations.map((citation, citationIndex) => (
                        <React.Fragment key={citationIndex}>
                          <SectionTitle>{citation.book}</SectionTitle>
                          <ContextText dangerouslySetInnerHTML={{ __html: citation.context }} />
                          <ReferenceLink component="a" href={citation.hyperlink} target="_blank" rel="noopener noreferrer">
                            <BookIcon sx={{ marginRight: '5px' }} />
                            {citation.book}
                          </ReferenceLink>
                        </React.Fragment>
                      ))}
                      {resultIndex < conversation.results.length - 1 && <Divider sx={{ marginTop: '20px' }} />}
                    </ResultBox>
                  );
                }
                return null;
              })}
              {index < conversations.length - 1 && <Divider sx={{ margin: '20px 0' }} />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default FancySearchWidget;
