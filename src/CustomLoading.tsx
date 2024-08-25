import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { styled } from '@mui/system';

// Define styled components with TypeScript
const ProgressBarContainer = styled(Box)<{ width?: string }>(({ width }) => ({
  width: width || '100%',
  marginBottom: '10px', // Spacing between progress bars
}));

const LogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '20px',
});

const LogoImage = styled('img')({
  width: '40px', // Adjust the size of the logo as needed
  height: '40px',
  marginRight: '10px',
});

const CustomLoading: React.FC = () => {
  return (
    <Box width="100%" marginTop="20px" textAlign="center">
      {/* Logo and Generating text */}
      <LogoContainer>
        <LogoImage src="/mnt/data/bot-icon.png" alt="Loading Logo" />
        <Typography variant="h6">Generating...</Typography>
      </LogoContainer>

      {/* First indeterminate progress bar - full width */}
      <ProgressBarContainer width="100%">
        <LinearProgress
          variant="indeterminate"
          sx={{
            height: '6px', // Adjust the thickness of the bar
            borderRadius: '5px', // Optional: round the corners
          }}
        />
      </ProgressBarContainer>

      {/* Second indeterminate progress bar - full width */}
      <ProgressBarContainer width="100%">
        <LinearProgress
          variant="indeterminate"
          sx={{
            height: '6px',
            borderRadius: '5px',
          }}
        />
      </ProgressBarContainer>

      {/* Third indeterminate progress bar - half width */}
      <ProgressBarContainer width="50%">
        <LinearProgress
          variant="indeterminate"
          sx={{
            height: '6px',
            borderRadius: '5px',
          }}
        />
      </ProgressBarContainer>
    </Box>
  );
};

export default CustomLoading;
