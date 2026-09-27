import React from 'react';
import { Card, Box, Typography } from '@mui/material';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  context?: string;
  iconBgColor?: string;
  iconColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  context,
  iconBgColor = '#EEF2FF',
  iconColor = '#4F46E5',
}) => {
  return (
    <Card
      sx={{
        p: 2.8,
        borderRadius: 3.5,
        border: '1px solid #E2E8F0',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 20px rgba(15, 23, 42, 0.05)',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748B', fontSize: '0.875rem' }}>
          {label}
        </Typography>
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: 2.5,
            backgroundColor: iconBgColor,
            color: iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
      </Box>

      <Box>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: '#0F172A',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            mb: 0.8,
          }}
        >
          {value}
        </Typography>
        {context && (
          <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500, display: 'block' }}>
            {context}
          </Typography>
        )}
      </Box>
    </Card>
  );
};
