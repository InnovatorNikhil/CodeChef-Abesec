import React from 'react';
import {
  Box,
  Chip,
  FormControl,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import type { EventCategory, EventStatusFilter } from '../types/event';

interface EventFiltersProps {
  category: EventCategory;
  onCategoryChange: (cat: EventCategory) => void;
  status: EventStatusFilter;
  onStatusChange: (status: EventStatusFilter) => void;
}

const CATEGORIES: EventCategory[] = [
  'All',
  'Coding',
  'Workshop',
  'Hackathon',
  'Seminar',
  'Cultural',
  'Sports',
  'Other',
];

const STATUSES: EventStatusFilter[] = [
  'All',
  'Upcoming',
  'Past',
  'Registration Open',
  'Registration Closed',
];

export const EventFilters: React.FC<EventFiltersProps> = ({
  category,
  onCategoryChange,
  status,
  onStatusChange,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        width: '100%',
        py: 1,
      }}
    >
      {/* Category Pills (horizontal scrollable on mobile) */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          overflowX: 'auto',
          maxWidth: '100%',
          py: 0.5,
          '::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
        }}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = category === cat;
          return (
            <Chip
              key={cat}
              label={cat}
              clickable
              onClick={() => onCategoryChange(cat)}
              sx={{
                fontWeight: 600,
                fontSize: '0.82rem',
                borderRadius: '8px',
                px: 0.5,
                backgroundColor: isSelected ? '#4F46E5' : '#FFFFFF',
                color: isSelected ? '#FFFFFF' : '#475569',
                border: isSelected ? '1px solid #4F46E5' : '1px solid #E2E8F0',
                transition: 'all 0.18s ease-in-out',
                '&:hover': {
                  backgroundColor: isSelected ? '#4338CA' : '#F1F5F9',
                },
              }}
            />
          );
        })}
      </Box>

      {/* Status Filter Dropdown */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0, width: { xs: '100%', sm: 'auto' } }}>
        <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.85rem' }}>
          Status:
        </Typography>
        <FormControl size="small" sx={{ minWidth: 160, width: { xs: '100%', sm: 'auto' } }}>
          <Select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as EventStatusFilter)}
            sx={{
              backgroundColor: '#FFFFFF',
              borderRadius: 2,
              fontSize: '0.85rem',
              fontWeight: 500,
              '& fieldset': { borderColor: '#E2E8F0' },
            }}
          >
            {STATUSES.map((st) => (
              <MenuItem key={st} value={st} sx={{ fontSize: '0.85rem' }}>
                {st}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};
