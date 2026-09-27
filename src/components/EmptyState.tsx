import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { CalendarX, SearchX, Users, PlusCircle } from 'lucide-react';

interface EmptyStateProps {
  icon?: 'calendar' | 'search' | 'users' | 'plus';
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'calendar',
  title,
  description,
  actionText,
  onAction,
}) => {
  const renderIcon = () => {
    switch (icon) {
      case 'search':
        return <SearchX size={36} color="#6366F1" />;
      case 'users':
        return <Users size={36} color="#6366F1" />;
      case 'plus':
        return <PlusCircle size={36} color="#6366F1" />;
      case 'calendar':
      default:
        return <CalendarX size={36} color="#6366F1" />;
    }
  };

  return (
    <Box
      sx={{
        py: 8,
        px: 3,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FFFFFF',
        borderRadius: 4,
        border: '1px dashed #CBD5E1',
        maxWidth: 540,
        mx: 'auto',
        my: 4,
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          backgroundColor: '#EEF2FF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        {renderIcon()}
      </Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#0F172A' }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: '#64748B', maxWidth: 380, mb: actionText ? 3 : 0 }}>
        {description}
      </Typography>
      {actionText && onAction && (
        <Button variant="contained" color="primary" onClick={onAction} sx={{ mt: 2 }}>
          {actionText}
        </Button>
      )}
    </Box>
  );
};
