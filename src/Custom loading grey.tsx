import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { styled, keyframes } from '@mui/system';

// Define a keyframe animation for the pulsating effect
const pulse = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
`;

// Styled component for the pulsating LinearProgress
const PulsatingLinearProgress = styled(LinearProgress)(({ theme }) => ({
  backgroundColor: theme.palette.grey[300], // Light grey background
  '& .MuiLinearProgress-bar': {
    backgroundColor: theme.palette.grey[500], // Slightly darker grey for the bar
    animation: `${pulse} 1.5s ease-in-out infinite`,
  },
}));

const CustomLoading: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#f4f6f8',
        padding: '20px',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <img
          src="/path-to-your-logo.png" // Replace with your logo's path
          alt="Loading"
          style={{ height: '40px', marginRight: '10px' }}
        />
        <Typography variant="h6" sx={{ color: '#3f51b5' }}>
          Generating...
        </Typography>
      </Box>
      <PulsatingLinearProgress
        sx={{
          width: '100%',
          maxWidth: '600px',
          height: '10px', // Increase thickness if desired
          borderRadius: '5px',
        }}
      />
    </Box>
  );
};

export default CustomLoading;
