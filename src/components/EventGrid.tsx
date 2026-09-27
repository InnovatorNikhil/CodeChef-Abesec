import React from 'react';
import { Box } from '@mui/material';
import type { EventItem } from '../types/event';
import { EventCard } from './EventCard';
import { EmptyState } from './EmptyState';

interface EventGridProps {
  events: EventItem[];
  emptyTitle?: string;
  emptyDescription?: string;
  onReset?: () => void;
}

export const EventGrid: React.FC<EventGridProps> = ({
  events,
  emptyTitle = 'No events found',
  emptyDescription = 'Try adjusting your filters or search keywords.',
  onReset,
}) => {
  if (events.length === 0) {
    return (
      <EmptyState
        icon="search"
        title={emptyTitle}
        description={emptyDescription}
        actionText={onReset ? 'Reset Filters' : undefined}
        onAction={onReset}
      />
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: 3,
        width: '100%',
      }}
    >
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </Box>
  );
};
