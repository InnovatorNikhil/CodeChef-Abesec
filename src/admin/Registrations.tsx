import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
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
  MenuItem,
  Select,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { Eye, Download, CheckCircle2 } from 'lucide-react';
import { useRegistrations } from '../hooks/useRegistrations';
import { useEvents } from '../hooks/useEvents';
import { SearchBar } from '../components/SearchBar';
import { TableSkeleton } from '../components/LoadingState';
import type { RegistrationItem } from '../types/registration';

const YEARS = ['All Years', '1st Year', '2nd Year', '3rd Year', '4th Year'];

export const Registrations: React.FC = () => {
  const { registrations, isLoading } = useRegistrations();
  const { events } = useEvents();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All Years');

  // Modal Detail View
  const [activeReg, setActiveReg] = useState<RegistrationItem | null>(null);

  // Filtered List
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.phone.includes(searchTerm);

      const matchesEvent =
        selectedEventId === 'All' || reg.event_id === selectedEventId;

      const matchesYear =
        selectedYear === 'All Years' || reg.year === selectedYear;

      return matchesSearch && matchesEvent && matchesYear;
    });
  }, [registrations, searchTerm, selectedEventId, selectedYear]);

  // Export to CSV utility for admin
  const handleExportCSV = () => {
    if (filteredRegistrations.length === 0) return;
    const headers = ['Student Name', 'Email', 'College', 'Year', 'Phone', 'Event', 'Registration Date'];
    const rows = filteredRegistrations.map((r) => [
      `"${r.name}"`,
      `"${r.email}"`,
      `"${r.college}"`,
      `"${r.year}"`,
      `"${r.phone}"`,
      `"${r.events?.name || 'N/A'}"`,
      `"${r.created_at ? new Date(r.created_at).toLocaleDateString() : ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `abes_codechef_registrations_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ width: '100%', pb: 6 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 3.5, gap: 2 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.025em' }}>
            Registrations
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
            Total of {registrations.length} student registrations recorded across all chapter events.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<Download size={16} />}
          onClick={handleExportCSV}
          disabled={filteredRegistrations.length === 0}
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          Export CSV ({filteredRegistrations.length})
        </Button>
      </Box>

      {/* Filter Card */}
      <Card sx={{ p: 2.5, mb: 3.5, borderRadius: 3.5, border: '1px solid #E2E8F0' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'center' }}>
          <Box sx={{ flexGrow: 1, width: '100%' }}>
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by student name, email, or phone..."
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5, width: { xs: '100%', md: 'auto' }, flexShrink: 0 }}>
            {/* Filter by Event */}
            <FormControl size="small" sx={{ minWidth: 160, flex: 1 }}>
              <Select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                sx={{ borderRadius: 2, fontSize: '0.85rem' }}
              >
                <MenuItem value="All">All Events</MenuItem>
                {events.map((ev) => (
                  <MenuItem key={ev.id} value={ev.id} sx={{ fontSize: '0.85rem' }}>
                    {ev.name.length > 24 ? `${ev.name.slice(0, 24)}...` : ev.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Filter by Year */}
            <FormControl size="small" sx={{ minWidth: 130, flex: 1 }}>
              <Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                sx={{ borderRadius: 2, fontSize: '0.85rem' }}
              >
                {YEARS.map((yr) => (
                  <MenuItem key={yr} value={yr} sx={{ fontSize: '0.85rem' }}>
                    {yr}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Card>

      {/* Table Card */}
      <Card sx={{ borderRadius: 3.5, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        {isLoading ? (
          <TableSkeleton rows={7} columns={7} />
        ) : filteredRegistrations.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center', color: '#64748B' }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
              No registrations found
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Try adjusting your search query or year/event filters.
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setSearchTerm('');
                setSelectedEventId('All');
                setSelectedYear('All Years');
              }}
            >
              Clear Filters
            </Button>
          </Box>
        ) : (
          <>
            {/* Desktop / Tablet Table View */}
            <TableContainer sx={{ width: '100%', maxWidth: '100%', overflowX: 'auto', display: { xs: 'none', md: 'block' } }}>
              <Table sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>College</TableCell>
                    <TableCell>Year</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Event</TableCell>
                    <TableCell>Registered At</TableCell>
                    <TableCell align="right">Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRegistrations.map((reg) => (
                    <TableRow key={reg.id} hover>
                      <TableCell sx={{ py: 1.8 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F172A' }}>
                          {reg.name}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ py: 1.8 }}>
                        <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.85rem' }}>
                          {reg.email}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ py: 1.8 }}>
                        <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.85rem' }}>
                          {reg.college}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ py: 1.8 }}>
                        <Chip
                          label={reg.year}
                          size="small"
                          sx={{
                            backgroundColor: '#EEF2FF',
                            color: '#4F46E5',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                          }}
                        />
                      </TableCell>

                      <TableCell sx={{ py: 1.8 }}>
                        <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.85rem' }}>
                          {reg.phone}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ py: 1.8 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B', fontSize: '0.85rem' }}>
                          {reg.events?.name || 'Associated Event'}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ py: 1.8 }}>
                        <Typography variant="caption" sx={{ color: '#64748B' }}>
                          {reg.created_at ? new Date(reg.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                        </Typography>
                      </TableCell>

                      <TableCell align="right" sx={{ py: 1.8 }}>
                        <Tooltip title="View Attendee Card">
                          <IconButton
                            size="small"
                            onClick={() => setActiveReg(reg)}
                            sx={{ color: '#4F46E5', backgroundColor: '#EEF2FF', '&:hover': { backgroundColor: '#E0E7FF' } }}
                          >
                            <Eye size={16} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Mobile Cards View (< 768px) */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2, p: 2 }}>
              {filteredRegistrations.map((reg) => (
                <Box
                  key={reg.id}
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
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A' }}>
                        {reg.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                        {reg.email}
                      </Typography>
                    </Box>
                    <Chip
                      label={reg.year}
                      size="small"
                      sx={{ backgroundColor: '#EEF2FF', color: '#4F46E5', fontWeight: 700, fontSize: '0.7rem' }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, fontSize: '0.8rem', color: '#475569' }}>
                    <Typography variant="caption">
                      <strong>Event:</strong> {reg.events?.name || 'Associated Event'}
                    </Typography>
                    <Typography variant="caption">
                      <strong>College:</strong> {reg.college}
                    </Typography>
                    <Typography variant="caption">
                      <strong>Phone:</strong> {reg.phone}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                      Registered: {reg.created_at ? new Date(reg.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                    </Typography>
                  </Box>

                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Eye size={14} />}
                    onClick={() => setActiveReg(reg)}
                    sx={{ alignSelf: 'flex-end', borderRadius: 2 }}
                  >
                    View Details
                  </Button>
                </Box>
              ))}
            </Box>
          </>
        )}
      </Card>

      {/* Attendee Details Modal */}
      <Dialog
        open={Boolean(activeReg)}
        onClose={() => setActiveReg(null)}
        slotProps={{ paper: { sx: { borderRadius: 3.5, p: 1, maxWidth: 500, width: '100%' } } }}
      >
        {activeReg && (
          <>
            <DialogTitle sx={{ fontWeight: 800, color: '#0F172A', pb: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  backgroundColor: '#EEF2FF',
                  color: '#4F46E5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircle2 size={20} />
              </Box>
              Student Registration Record
            </DialogTitle>
            <DialogContent>
              <Box sx={{ p: 2.5, borderRadius: 3, backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', mb: 2.5 }}>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                  REGISTERED EVENT
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#4F46E5', mb: 0.5 }}>
                  {activeReg.events?.name || 'Assigned Event'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#475569' }}>
                  Venue: {activeReg.events?.venue || 'Campus Venue'}
                </Typography>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>FULL NAME</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: '#0F172A' }}>{activeReg.name}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>YEAR OF STUDY</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: '#0F172A' }}>{activeReg.year}</Typography>
                </Box>

                <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>EMAIL ADDRESS</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#334155' }}>{activeReg.email}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>PHONE NUMBER</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#334155' }}>{activeReg.phone}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>COLLEGE</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#334155' }}>{activeReg.college}</Typography>
                </Box>

                <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>TIMESTAMP</Typography>
                  <Typography variant="body2" sx={{ color: '#64748B' }}>
                    {activeReg.created_at ? new Date(activeReg.created_at).toLocaleString() : 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5 }}>
              <Button onClick={() => setActiveReg(null)} variant="contained" sx={{ borderRadius: 2 }}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};
