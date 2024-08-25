import React from 'react';
import { Box,Typography, LinearProgress } from '@mui/material';
import { styled } from '@mui/system';

const ProgressBarContainer = styled(Box)(({ width }) => ({
  width: width || '100%',
  marginBottom: '15px', // Spacing between progress bars
  '& .MuiLinearProgress-root': {
    height: '20px', // Increase the height for a thicker progress bar
    borderRadius: '10px', // Increase the border-radius for rounded corners
    '& .MuiLinearProgress-bar': {
              borderRadius: '20px', // Apply the same rounding to the inner bar
              height: '20px', // Increase the height for a thicker inner bar
              
            },

  },
  
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

const CustomLoading = () => {
  return (
    <Box width="100%" marginTop="20px">
        <LogoContainer>
        <LogoImage src="bot-icon.png" alt="Loading Logo" />
        <Typography variant="h6">Generating...</Typography>
      </LogoContainer>

      {/* First indeterminate progress bar - full width */}
      <ProgressBarContainer width="100%">
        <LinearProgress variant="indeterminate"
/>
      </ProgressBarContainer>

      {/* Second indeterminate progress bar - full width */}
      <ProgressBarContainer width="100%">
        <LinearProgress variant="indeterminate" sx={{
    "--LinearProgress-radius": "20px",
    "--LinearProgress-thickness": "26px"
  }}/>
      </ProgressBarContainer>

      {/* Third indeterminate progress bar - half width */}
      <ProgressBarContainer width="50%">
        <LinearProgress variant="indeterminate" sx={{
    "--LinearProgress-radius": "20px",
    "--LinearProgress-thickness": "26px"
  }} />
      </ProgressBarContainer>
    </Box>
  );
};

export default CustomLoading;
