import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  Divider,
} from '@mui/material';
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';
import { SearchBar } from '../components/SearchBar';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { TableSkeleton } from '../components/LoadingState';
import { getCategoryColor } from '../components/EventCard';
import type { EventCategory, EventStatusFilter, EventItem } from '../types/event';

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

export const AdminEvents: React.FC = () => {
  const navigate = useNavigate();
  const { events, isLoading, deleteEvent } = useEvents();

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<EventCategory>('All');
  const [status, setStatus] = useState<EventStatusFilter>('All');

  // Deletion Modal State
  const [deleteTarget, setDeleteTarget] = useState<EventItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat =
        category === 'All' || event.category.toLowerCase() === category.toLowerCase();

      const isPast = new Date(event.date + 'T23:59:59') < new Date();
      const regCount = event.registration_count || 0;
      const maxCap = event.max_participants || 100;
      const isFull = regCount >= maxCap;
      const isOpen = (event.registration_open !== false) && !isPast && !isFull;

      let matchesStatus = true;
      if (status === 'Upcoming') matchesStatus = !isPast;
      else if (status === 'Past') matchesStatus = isPast;
      else if (status === 'Registration Open') matchesStatus = isOpen;
      else if (status === 'Registration Closed') matchesStatus = !isOpen;

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [events, searchTerm, category, status]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteEvent(deleteTarget.id);
      setSnackbar({
        open: true,
        message: `Event "${deleteTarget.name}" deleted successfully.`,
        severity: 'success',
      });
      setDeleteTarget(null);
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err?.message || 'Failed to delete event.',
        severity: 'error',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Box sx={{ width: '100%', pb: 6 }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 3.5, gap: 2 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.025em' }}>
            Events
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
            Create, monitor, and configure all college chapter events.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => navigate('/admin/events/new')}
          sx={{ borderRadius: 2.5, px: 2.5, py: 1, fontWeight: 700 }}
        >
          Add Event
        </Button>
      </Box>

      {/* Filter and Search Bar */}
      <Card sx={{ p: 2.5, mb: 3.5, borderRadius: 3.5, border: '1px solid #E2E8F0' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'center' }}>
          <Box sx={{ flexGrow: 1, width: '100%' }}>
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by event title, venue..."
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5, width: { xs: '100%', md: 'auto' }, flexShrink: 0 }}>
            <FormControl size="small" sx={{ minWidth: 140, flex: 1 }}>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                sx={{ borderRadius: 2, fontSize: '0.85rem' }}
              >
                {CATEGORIES.map((c) => (
                  <MenuItem key={c} value={c} sx={{ fontSize: '0.85rem' }}>
                    {c === 'All' ? 'All Categories' : c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 140, flex: 1 }}>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as EventStatusFilter)}
                sx={{ borderRadius: 2, fontSize: '0.85rem' }}
              >
                {STATUSES.map((s) => (
                  <MenuItem key={s} value={s} sx={{ fontSize: '0.85rem' }}>
                    {s === 'All' ? 'All Statuses' : s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Card>

      {/* Events Table */}
      <Card sx={{ borderRadius: 3.5, border: '1px solid #E2E8F0', overflow: 'hidden', width: '100%', maxWidth: '100%' }}>
        {isLoading ? (
          <TableSkeleton rows={6} columns={7} />
        ) : filteredEvents.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center', color: '#64748B' }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
              No events match your criteria
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Try searching for something else or reset the category filters.
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setSearchTerm('');
                setCategory('All');
                setStatus('All');
              }}
            >
              Reset Filters
            </Button>
          </Box>
        ) : (
          <>
            {/* Desktop / Tablet Table View (>= 768px) */}
            <TableContainer sx={{ width: '100%', maxWidth: '100%', overflowX: 'auto', display: { xs: 'none', md: 'block' } }}>
              <Table sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Event</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Date & Time</TableCell>
                    <TableCell>Venue</TableCell>
                    <TableCell>Registrations</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEvents.map((ev) => {
                    const catStyle = getCategoryColor(ev.category);
                    const isPast = new Date(ev.date + 'T23:59:59') < new Date();
                    const regCount = ev.registration_count || 0;
                    const maxCap = ev.max_participants || 100;
                    const isFull = regCount >= maxCap;
                    const isClosed = ev.registration_open === false || isPast;

                    let statusText = 'Open';
                    let statusBg = '#DCFCE7';
                    let statusColor = '#15803D';
                    if (isFull) {
                      statusText = 'Full';
                      statusBg = '#FEE2E2';
                      statusColor = '#B91C1C';
                    } else if (isClosed) {
                      statusText = 'Closed';
                      statusBg = '#F1F5F9';
                      statusColor = '#64748B';
                    }

                    return (
                      <TableRow key={ev.id} hover>
                        {/* Event Column */}
                        <TableCell sx={{ py: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box
                              component="img"
                              src={
                                ev.banner_url ||
                                'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=200&q=80'
                              }
                              alt={ev.name}
                              sx={{
                                width: 44,
                                height: 44,
                                borderRadius: 2,
                                objectFit: 'cover',
                                border: '1px solid #E2E8F0',
                              }}
                            />
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F172A' }}>
                                  {ev.name}
                                </Typography>
                                {ev.is_featured && (
                                  <Chip
                                    label="Featured"
                                    size="small"
                                    sx={{
                                      backgroundColor: '#FEF08A',
                                      color: '#854D0E',
                                      fontWeight: 700,
                                      fontSize: '0.65rem',
                                      height: 18,
                                    }}
                                  />
                                )}
                              </Box>
                              <Typography variant="caption" sx={{ color: '#64748B' }}>
                                ID: {ev.id.slice(0, 8)}...
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        {/* Category */}
                        <TableCell sx={{ py: 2 }}>
                          <Chip
                            label={ev.category}
                            size="small"
                            sx={{
                              backgroundColor: catStyle.bg,
                              color: catStyle.text,
                              fontWeight: 700,
                              fontSize: '0.75rem',
                            }}
                          />
                        </TableCell>

                        {/* Date & Time */}
                        <TableCell sx={{ py: 2 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B' }}>
                            {new Date(ev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748B' }}>
                            {ev.time.slice(0, 5)}
                          </Typography>
                        </TableCell>

                        {/* Venue */}
                        <TableCell sx={{ py: 2 }}>
                          <Typography variant="body2" sx={{ color: '#475569' }}>
                            {ev.venue}
                          </Typography>
                        </TableCell>

                        {/* Registrations */}
                        <TableCell sx={{ py: 2 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F172A' }}>
                            {regCount} <span style={{ color: '#94A3B8', fontWeight: 500 }}>/ {maxCap}</span>
                          </Typography>
                        </TableCell>

                        {/* Status */}
                        <TableCell sx={{ py: 2 }}>
                          <Chip
                            label={statusText}
                            size="small"
                            sx={{
                              backgroundColor: statusBg,
                              color: statusColor,
                              fontWeight: 700,
                              fontSize: '0.75rem',
                            }}
                          />
                        </TableCell>

                        {/* Actions */}
                        <TableCell align="right" sx={{ py: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                            <Tooltip title="View Public Page">
                              <IconButton
                                size="small"
                                onClick={() => window.open(`/events/${ev.id}`, '_blank')}
                                sx={{ color: '#64748B', '&:hover': { color: '#4F46E5', backgroundColor: '#EEF2FF' } }}
                              >
                                <ExternalLink size={16} />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Edit Event">
                              <IconButton
                                size="small"
                                onClick={() => navigate(`/admin/events/edit/${ev.id}`)}
                                sx={{ color: '#64748B', '&:hover': { color: '#0284C7', backgroundColor: '#E0F2FE' } }}
                              >
                                <Edit2 size={16} />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Delete Event">
                              <IconButton
                                size="small"
                                onClick={() => setDeleteTarget(ev)}
                                sx={{ color: '#64748B', '&:hover': { color: '#EF4444', backgroundColor: '#FEE2E2' } }}
                              >
                                <Trash2 size={16} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Mobile Cards View (< 768px) */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2, p: 2 }}>
              {filteredEvents.map((ev) => {
                const catStyle = getCategoryColor(ev.category);
                const isPast = new Date(ev.date + 'T23:59:59') < new Date();
                const regCount = ev.registration_count || 0;
                const maxCap = ev.max_participants || 100;
                const isFull = regCount >= maxCap;
                const isClosed = ev.registration_open === false || isPast;

                let statusText = 'Open';
                let statusBg = '#DCFCE7';
                let statusColor = '#15803D';
                if (isFull) {
                  statusText = 'Full';
                  statusBg = '#FEE2E2';
                  statusColor = '#B91C1C';
                } else if (isClosed) {
                  statusText = 'Closed';
                  statusBg = '#F1F5F9';
                  statusColor = '#64748B';
                }

                return (
                  <Box
                    key={ev.id}
                    sx={{
                      p: 2,
                      borderRadius: 2.5,
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1.5,
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
                        <Chip
                          label={ev.category}
                          size="small"
                          sx={{ backgroundColor: catStyle.bg, color: catStyle.text, fontWeight: 700, fontSize: '0.7rem' }}
                        />
                        <Chip
                          label={statusText}
                          size="small"
                          sx={{ backgroundColor: statusBg, color: statusColor, fontWeight: 700, fontSize: '0.7rem' }}
                        />
                        {ev.is_featured && (
                          <Chip
                            label="Featured"
                            size="small"
                            sx={{ backgroundColor: '#FEF08A', color: '#854D0E', fontWeight: 700, fontSize: '0.65rem' }}
                          />
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                      <Box
                        component="img"
                        src={ev.banner_url || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=200&q=80'}
                        alt={ev.name}
                        sx={{ width: 44, height: 44, borderRadius: 2, objectFit: 'cover', border: '1px solid #E2E8F0', flexShrink: 0 }}
                      />
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
                          {ev.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748B' }}>
                          📍 {ev.venue}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#64748B' }}>
                      <Typography variant="caption" sx={{ color: '#475569' }}>
                        📅 {new Date(ev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {ev.time.slice(0, 5)}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#4F46E5', fontWeight: 700 }}>
                        👥 {regCount} / {maxCap}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 0.5 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<ExternalLink size={14} />}
                        onClick={() => window.open(`/events/${ev.id}`, '_blank')}
                        sx={{ borderRadius: 2, fontSize: '0.75rem', py: 0.5, px: 1.2 }}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Edit2 size={14} />}
                        onClick={() => navigate(`/admin/events/edit/${ev.id}`)}
                        sx={{ borderRadius: 2, fontSize: '0.75rem', py: 0.5, px: 1.2 }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        startIcon={<Trash2 size={14} />}
                        onClick={() => setDeleteTarget(ev)}
                        sx={{ borderRadius: 2, fontSize: '0.75rem', py: 0.5, px: 1.2 }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </>
        )}
      </Card>

      {/* Delete Confirmation Modal Dialog */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Event?"
        message="This action cannot be undone. Are you sure you want to delete this event?"
        confirmText="Delete Event"
        cancelText="Cancel"
        isDestructive={true}
        isLoading={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
