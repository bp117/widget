import React from 'react';
import { Box, LinearProgress } from '@mui/material';
import { styled, keyframes } from '@mui/system';

// Define a keyframe animation for the skeleton loading effect
const skeletonLoading = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

// Styled component for the skeleton loading LinearProgress
const SkeletonLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: '10px', // Thickness of the bar
  borderRadius: '5px',
  backgroundColor: '#f0f0f0', // Light grey background for the skeleton
  '& .MuiLinearProgress-bar': {
    backgroundImage: `linear-gradient(90deg, #f0f0f0 0px, #e0e0e0 40px, #f0f0f0 80px)`,
    backgroundSize: '200px 100%',
    animation: `${skeletonLoading} 1.5s infinite ease-in-out`,
  },
}));

const SkeletonLoading: React.FC = () => {
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
      <SkeletonLinearProgress
        sx={{
          width: '100%',
          maxWidth: '600px',
          marginBottom: '8px', // Space between bars if needed
        }}
      />
      {/* Add more SkeletonLinearProgress components if you want multiple bars */}
    </Box>
  );
};

export default SkeletonLoading;
