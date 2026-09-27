import React from 'react';
import { Box, Skeleton, Card, CardContent } from '@mui/material';

export const EventCardsSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: 3,
        width: '100%',
      }}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <Card key={idx} sx={{ height: '100%', borderRadius: 3, border: '1px solid #E2E8F0' }}>
          <Skeleton variant="rectangular" height={180} animation="wave" />
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
              <Skeleton variant="rounded" width={70} height={24} />
              <Skeleton variant="rounded" width={90} height={24} />
            </Box>
            <Skeleton variant="text" sx={{ fontSize: '1.25rem', mb: 1 }} width="85%" />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="60%" sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Skeleton variant="text" width={80} />
              <Skeleton variant="rounded" width={90} height={36} />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 6,
}) => {
  return (
    <Box sx={{ p: 2 }}>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <Box
          key={rIdx}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            py: 1.5,
            borderBottom: '1px solid #F1F5F9',
          }}
        >
          {Array.from({ length: columns }).map((_, cIdx) => (
            <Skeleton
              key={cIdx}
              variant="rounded"
              height={24}
              sx={{ flex: cIdx === 0 ? 2 : 1 }}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
};

export const StatCardSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 2.5,
        width: '100%',
      }}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <Card key={idx} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E2E8F0' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
            <Skeleton variant="text" width={100} height={20} />
            <Skeleton variant="circular" width={36} height={36} />
          </Box>
          <Skeleton variant="text" width={60} height={42} sx={{ mb: 0.5 }} />
          <Skeleton variant="text" width={120} height={16} />
        </Card>
      ))}
    </Box>
  );
};
