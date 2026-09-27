import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  Button,
  Breadcrumbs,
  Link as MuiLink,
  Alert,
  CircularProgress,
} from '@mui/material';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';
import type { EventCategory, EventFormData } from '../types/event';

const CATEGORIES: EventCategory[] = [
  'Coding',
  'Workshop',
  'Hackathon',
  'Seminar',
  'Cultural',
  'Sports',
  'Other',
];

export const AddEvent: React.FC = () => {
  const navigate = useNavigate();
  const { createEvent } = useEvents();

  // Form State
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    category: 'Coding',
    date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    time: '14:00',
    venue: '',
    short_description: '',
    description: '',
    banner_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    registration_deadline: new Date(Date.now() + 6 * 86400000).toISOString().slice(0, 16),
    max_participants: 100,
    is_featured: false,
    registration_open: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Event name is required';
    if (!formData.venue.trim()) errs.venue = 'Venue location is required';
    if (!formData.date) errs.date = 'Event date is required';
    if (!formData.time) errs.time = 'Event time is required';
    if (!formData.short_description?.trim()) errs.short_description = 'Brief summary is required';
    if (!formData.max_participants || formData.max_participants <= 0) {
      errs.max_participants = 'Capacity must be at least 1';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await createEvent({
        ...formData,
        registration_deadline: formData.registration_deadline
          ? new Date(formData.registration_deadline).toISOString()
          : undefined,
      });

      navigate('/admin/events');
    } catch (err: any) {
      console.error('Failed to create event:', err);
      setErrorMessage(err?.message || 'Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1050, mx: 'auto', pb: 8, boxSizing: 'border-box' }}>
      {/* Breadcrumb Navigation */}
      <Breadcrumbs sx={{ mb: 2.5, fontSize: '0.85rem' }}>
        <MuiLink component={Link} to="/admin/dashboard" underline="hover" color="inherit">
          Dashboard
        </MuiLink>
        <MuiLink component={Link} to="/admin/events" underline="hover" color="inherit">
          Events
        </MuiLink>
        <Typography color="text.primary" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
          New Event
        </Typography>
      </Breadcrumbs>

      {/* Responsive Page Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          mb: 3.5,
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.025em', fontSize: { xs: '1.75rem', sm: '2.25rem' } }}>
            Create New Event
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
            Fill in the details to publish a new technical program for the club.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<ArrowLeft size={16} />}
          onClick={() => navigate('/admin/events')}
          sx={{ borderRadius: 2, alignSelf: { xs: 'flex-start', sm: 'center' } }}
        >
          Cancel
        </Button>
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        {/* GROUP 1: Event Information */}
        <Card sx={{ p: { xs: 2.5, sm: 3.5 }, mb: 3.5, borderRadius: 3.5, border: '1px solid #E2E8F0' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
            1. Event Information
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
            Primary title, category classification, and descriptive overviews.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 2.5 }}>
              <TextField
                fullWidth
                label="Event Name"
                placeholder="e.g. CodeChef Algorithmic Sprint 2026"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={!!errors.name}
                helperText={errors.name}
                required
              />

              <TextField
                fullWidth
                select
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                {CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <TextField
              fullWidth
              label="Short Description"
              placeholder="One or two sentences summarizing the event for card previews"
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              error={!!errors.short_description}
              helperText={errors.short_description}
              required
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Full Description & Agenda"
              placeholder="Detailed explanation, prerequisites, rounds, and eligibility rules..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Box>
        </Card>

        {/* GROUP 2: Schedule & Venue */}
        <Card sx={{ p: { xs: 2.5, sm: 3.5 }, mb: 3.5, borderRadius: 3.5, border: '1px solid #E2E8F0' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
            2. Schedule & Venue
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
            Specify the timeline, campus venue location, and room number.
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2.5 }}>
            <TextField
              fullWidth
              type="date"
              label="Event Date"
              slotProps={{ inputLabel: { shrink: true } }}
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              error={!!errors.date}
              helperText={errors.date}
              required
            />

            <TextField
              fullWidth
              type="time"
              label="Event Time"
              slotProps={{ inputLabel: { shrink: true } }}
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              error={!!errors.time}
              helperText={errors.time}
              required
            />

            <TextField
              fullWidth
              label="Venue / Location"
              placeholder="e.g. ABES Computer Lab 3"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              error={!!errors.venue}
              helperText={errors.venue}
              sx={{ gridColumn: { xs: 'span 1', sm: 'span 2', md: 'span 1' } }}
              required
            />
          </Box>
        </Card>

        {/* GROUP 3: Registration Settings */}
        <Card sx={{ p: { xs: 2.5, sm: 3.5 }, mb: 3.5, borderRadius: 3.5, border: '1px solid #E2E8F0' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
            3. Registration Settings
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
            Manage capacity limits, deadlines, and open registration status.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
              <TextField
                fullWidth
                type="number"
                label="Maximum Participants"
                value={formData.max_participants}
                onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) || 0 })}
                error={!!errors.max_participants}
                helperText={errors.max_participants}
                required
              />

              <TextField
                fullWidth
                type="datetime-local"
                label="Registration Deadline"
                slotProps={{ inputLabel: { shrink: true } }}
                value={formData.registration_deadline}
                onChange={(e) => setFormData({ ...formData, registration_deadline: e.target.value })}
              />
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.registration_open}
                  onChange={(e) => setFormData({ ...formData, registration_open: e.target.checked })}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F172A' }}>
                    Registration Open
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>
                    Allow students to submit new registrations
                  </Typography>
                </Box>
              }
            />
          </Box>
        </Card>

        {/* GROUP 4: Display Settings & Banner */}
        <Card sx={{ p: { xs: 2.5, sm: 3.5 }, mb: 4, borderRadius: 3.5, border: '1px solid #E2E8F0' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
            4. Display Settings
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
            Configure featured status and banner visual imagery.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              fullWidth
              label="Banner Image URL"
              placeholder="https://images.unsplash.com/..."
              value={formData.banner_url}
              onChange={(e) => setFormData({ ...formData, banner_url: e.target.value })}
              helperText="Provide a valid direct image URL for the card and banner"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F172A' }}>
                    Featured Flagship Event
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>
                    Display in prominent homepage banner spotlight
                  </Typography>
                </Box>
              }
            />
          </Box>
        </Card>

        {/* Action Controls */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column-reverse', sm: 'row' },
            justifyContent: 'flex-end',
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate('/admin/events')}
            sx={{ px: 3, py: 1.2, borderRadius: 2.5, width: { xs: '100%', sm: 'auto' } }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <Save size={18} />}
            sx={{ px: 4, py: 1.2, fontWeight: 700, borderRadius: 2.5, width: { xs: '100%', sm: 'auto' } }}
          >
            {isSubmitting ? 'Creating Event...' : 'Create Event'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
