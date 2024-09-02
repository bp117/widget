import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  List,
  ListItem,
  Paper,
  IconButton,
  CircularProgress,
  Button,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

interface ChatMessage {
  user: 'You' | 'Bot';
  text: string;
}

interface ChatbotWidgetProps {
  onLoad?: () => void;
}

const generateThreadId = () => {
  return Math.random().toString(36).substr(2, 9);
};

const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ onLoad }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [threadId, setThreadId] = useState<string>(generateThreadId()); // Generate initial thread ID

  useEffect(() => {
    if (onLoad) {
      onLoad();
    }
  }, [onLoad]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { user: 'You', text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('your-chat-api-url', {
        message: userMessage.text,
        threadId: threadId, // Send thread ID with the message
      });
      const botMessage: ChatMessage = { user: 'Bot', text: response.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { user: 'Bot', text: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewConversation = () => {
    setMessages([]); // Clear messages
    setThreadId(generateThreadId()); // Generate a new thread ID
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto', p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Chatbot
      </Typography>

      <Button
        variant="outlined"
        color="primary"
        onClick={handleNewConversation}
        sx={{ marginBottom: '10px' }}
      >
        New Conversation
      </Button>

      <Paper sx={{ maxHeight: 300, overflow: 'auto', p: 2, bgcolor: '#f5f5f5' }}>
        <List>
          {messages.map((message, index) => (
            <ListItem
              key={index}
              sx={{
                display: 'flex',
                justifyContent: message.user === 'You' ? 'flex-end' : 'flex-start',
                mb: 1,
              }}
            >
              <Box
                sx={{
                  maxWidth: '70%',
                  bgcolor: message.user === 'You' ? '#DCF8C6' : '#ECECEC',
                  p: 1.5,
                  borderRadius: 2,
                  wordBreak: 'break-word',
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: message.user === 'You' ? 'bold' : 'normal' }}>
                  {message.text}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress size={20} />
          </Box>
        )}
      </Paper>
      <Box sx={{ display: 'flex', mt: 2 }}>
        <TextField
          variant="outlined"
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <IconButton color="primary" onClick={handleSend} disabled={loading}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatbotWidget;
