import React, { useState, useMemo } from 'react';
import { Container, Typography, Box, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';
import { SearchBar } from '../components/SearchBar';
import { EventFilters } from '../components/EventFilters';
import { EventGrid } from '../components/EventGrid';
import { EventCardsSkeleton } from '../components/LoadingState';
import type { EventCategory, EventStatusFilter } from '../types/event';

export const Events: React.FC = () => {
  const { events, isLoading } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('All');
  const [selectedStatus, setSelectedStatus] = useState<EventStatusFilter>('All');

  // Filter events dynamically
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // Search matching (event name, venue, description)
      const matchesSearch =
        searchTerm.trim() === '' ||
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.short_description && event.short_description.toLowerCase().includes(searchTerm.toLowerCase()));

      // Category matching
      const matchesCategory =
        selectedCategory === 'All' ||
        event.category.toLowerCase() === selectedCategory.toLowerCase();

      // Status matching
      const isPast = new Date(event.date + 'T23:59:59') < new Date();
      const regCount = event.registration_count || 0;
      const maxCap = event.max_participants || 100;
      const isFull = regCount >= maxCap;
      const isOpen = Boolean(event.registration_open !== false && !isPast && !isFull);

      let matchesStatus = true;
      if (selectedStatus === 'Upcoming') {
        matchesStatus = !isPast;
      } else if (selectedStatus === 'Past') {
        matchesStatus = isPast;
      } else if (selectedStatus === 'Registration Open') {
        matchesStatus = isOpen;
      } else if (selectedStatus === 'Registration Closed') {
        matchesStatus = !isOpen;
      }

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [events, searchTerm, selectedCategory, selectedStatus]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedStatus('All');
  };

  return (
    <Box sx={{ py: { xs: 4, md: 6 }, minHeight: '80vh', backgroundColor: '#F8FAFC' }}>
      <Container maxWidth="lg">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs sx={{ mb: 2, fontSize: '0.85rem' }}>
          <MuiLink component={Link} to="/" underline="hover" color="inherit">
            Home
          </MuiLink>
          <Typography color="text.primary" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
            Events
          </Typography>
        </Breadcrumbs>

        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.025em',
              mb: 1,
            }}
          >
            Explore Events
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748B', maxWidth: 600 }}>
            Find workshops, competitions, hackathons and community events organized by the ABES CodeChef Chapter.
          </Typography>
        </Box>

        {/* Filter Controls Card */}
        <Box
          sx={{
            p: 2.5,
            mb: 4,
            backgroundColor: '#FFFFFF',
            borderRadius: 3.5,
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by event name, category, or venue..."
          />
          <EventFilters
            category={selectedCategory}
            onCategoryChange={setSelectedCategory}
            status={selectedStatus}
            onStatusChange={setSelectedStatus}
          />
        </Box>

        {/* Events Grid or Skeleton */}
        {isLoading ? (
          <EventCardsSkeleton count={6} />
        ) : (
          <EventGrid
            events={filteredEvents}
            emptyTitle={searchTerm ? 'No matching events found' : 'No events available'}
            emptyDescription={
              searchTerm
                ? `No events match "${searchTerm}". Try adjusting your keywords or category filters.`
                : 'No events match the selected criteria.'
            }
            onReset={handleResetFilters}
          />
        )}
      </Container>
    </Box>
  );
};
