import React from 'react';
import { TextField, InputAdornment, IconButton, Box } from '@mui/material';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  fullWidth?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search events by name, topic, or venue...',
  fullWidth = true,
}) => {
  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <TextField
        fullWidth={fullWidth}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        size="small"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} color="#64748B" />
              </InputAdornment>
            ),
            endAdornment: value ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => onChange('')} aria-label="clear search">
                  <X size={16} />
                </IconButton>
              </InputAdornment>
            ) : null,
            sx: {
              backgroundColor: '#FFFFFF',
              borderRadius: 2.5,
              fontSize: '0.9rem',
              '& fieldset': {
                borderColor: '#E2E8F0',
              },
              '&:hover fieldset': {
                borderColor: '#CBD5E1',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#4F46E5',
              },
            },
          },
        }}
      />
    </Box>
  );
};
