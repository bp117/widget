import React from 'react';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import InsertChartIcon from '@mui/icons-material/InsertChart';

interface TemplateCardProps {
  title: string;
  description: string;
  darkMode: boolean;
  selected: boolean;
  onClick: () => void;
  onGraphClick: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  title,
  description,
  darkMode,
  selected,
  onClick,
  onGraphClick,
}) => (
  <Card
    onClick={onClick}
    sx={{
      minWidth: 275,
      maxWidth: 300,
      height: 180, // Fixed height for uniformity
      marginRight: 2,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      borderRadius: '8px',
      boxShadow: selected
        ? '0px 0px 10px 2px rgba(0, 123, 255, 0.5)'
        : '0px 4px 8px rgba(0, 0, 0, 0.1)',
      backgroundColor: darkMode ? '#2c2c2c' : '#f5f5f5',
      color: darkMode ? '#ffffff' : '#000000',
      transition: 'transform 0.3s ease',
      '&:hover': {
        transform: 'scale(1.05)',
      },
      position: 'relative',
    }}
  >
    <CardContent>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        {title}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {description}
      </Typography>
    </CardContent>
    <IconButton
      onClick={(e) => {
        e.stopPropagation(); // Prevent card selection on icon click
        onGraphClick();
      }}
      sx={{
        position: 'absolute',
        bottom: 8,
        right: 8,
        color: darkMode ? '#ffffff' : '#000000',
      }}
    >
      <InsertChartIcon />
    </IconButton>
  </Card>
);

export default TemplateCard;
