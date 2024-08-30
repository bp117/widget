import React from 'react';
import { Box, Skeleton } from '@mui/material';

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
        padding: '20px',
        backgroundColor: '#f4f6f8',
      }}
    >
      {/* First Skeleton */}
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          width: '100%',
          maxWidth: '600px',
          height: '10px', // Thickness of the skeleton bar
          marginBottom: '8px', // Space between skeletons
          borderRadius: '5px',
        }}
      />

      {/* Second Skeleton */}
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          width: '100%',
          maxWidth: '600px',
          height: '10px', // Thickness of the skeleton bar
          marginBottom: '8px', // Space between skeletons
          borderRadius: '5px',
        }}
      />

      {/* Third Skeleton (50% width) */}
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          width: '50%', // 50% width for the third skeleton
          height: '10px', // Thickness of the skeleton bar
          borderRadius: '5px',
        }}
      />
    </Box>
  );
};

export default CustomLoading;
