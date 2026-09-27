import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  Calendar,
  CalendarCheck,
  Users,
  History,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/registrationService';
import type { EventItem } from '../types/event';
import type { RegistrationItem } from '../types/registration';
import { StatCard } from '../components/StatCard';
import { DashboardCharts } from '../components/DashboardChart';
import { StatCardSkeleton, TableSkeleton } from '../components/LoadingState';
import { getCategoryColor } from '../components/EventCard';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setIsLoading(true);
      try {
        const [evList, regList] = await Promise.all([
          eventService.getEvents(),
          registrationService.getRegistrations(),
        ]);
        setEvents(evList);
        setRegistrations(regList);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const now = new Date();
  const totalEvents = events.length;
  const upcomingEventsList = events.filter((e) => new Date(e.date + 'T23:59:59') >= now);
  const pastEventsList = events.filter((e) => new Date(e.date + 'T23:59:59') < now);
  const totalRegistrations = registrations.length;

  const timelineMap: Record<string, number> = {};
  registrations.forEach((r) => {
    const d = r.created_at ? new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recent';
    timelineMap[d] = (timelineMap[d] || 0) + 1;
  });
  const timelineData = Object.entries(timelineMap).map(([date, registrations]) => ({
    date,
    registrations,
  }));

  const byEventData = events.slice(0, 5).map((e) => ({
    name: e.name,
    registrations: e.registration_count || 0,
  }));

  const recentRegistrations = registrations.slice(0, 5);

  return (
    <Box sx={{ width: '100%', pb: 6 }}>
      {/* Top Heading */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 3.5, gap: 2 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.025em' }}>
            Dashboard Overview
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
            Here's what's happening with your club events.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => navigate('/admin/events/new')}
          sx={{
            borderRadius: 2.5,
            px: 2.5,
            py: 1,
            fontWeight: 700,
          }}
        >
          Create Event
        </Button>
      </Box>

      {/* Large Rounded Hero Banner */}
      <Box
        sx={{
          borderRadius: 4,
          background: 'linear-gradient(135deg, #312E81 0%, #4338CA 45%, #2563EB 85%, #0284C7 100%)',
          color: '#FFFFFF',
          p: { xs: 3.5, sm: 4.5 },
          mb: 4,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 12px 28px -6px rgba(49, 46, 129, 0.25)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            right: '-10%',
            top: '-30%',
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <Box sx={{ maxWidth: 640, position: 'relative', zIndex: 1 }}>
          <Chip
            label="CAMPUS MANAGEMENT PORTAL"
            size="small"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.18)',
              backdropFilter: 'blur(8px)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.7rem',
              mb: 1.5,
            }}
          />
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#FFFFFF', mb: 1, letterSpacing: '-0.02em' }}>
            Manage your events. Grow your community.
          </Typography>
          <Typography variant="body2" sx={{ color: '#E0E7FF', mb: 2.5, maxWidth: 520, lineHeight: 1.6 }}>
            Track real-time student signups, configure capacity constraints, monitor attendance records, and publish new technical workshops with ease.
          </Typography>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate('/admin/events')}
              sx={{
                backgroundColor: '#FFFFFF',
                color: '#312E81',
                fontWeight: 700,
                borderRadius: 2,
                px: 2,
                '&:hover': { backgroundColor: '#F1F5F9', color: '#1E1B4B' },
              }}
            >
              Manage Events
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate('/admin/registrations')}
              sx={{
                color: '#FFFFFF',
                borderColor: 'rgba(255, 255, 255, 0.4)',
                borderRadius: 2,
                px: 2,
                '&:hover': { borderColor: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              }}
            >
              View Registrations
            </Button>
          </Box>
        </Box>
      </Box>

      {/* STATISTICS CARDS */}
      <Box sx={{ mb: 4 }}>
        {isLoading ? (
          <StatCardSkeleton count={4} />
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
              gap: 2.5,
            }}
          >
            <StatCard
              label="Total Events"
              value={totalEvents}
              icon={<Calendar size={20} />}
              context="Lifetime active chapter programs"
              iconBgColor="#EEF2FF"
              iconColor="#4F46E5"
            />

            <StatCard
              label="Upcoming Events"
              value={upcomingEventsList.length}
              icon={<CalendarCheck size={20} />}
              context="Scheduled in coming weeks"
              iconBgColor="#ECFDF5"
              iconColor="#10B981"
            />

            <StatCard
              label="Total Registrations"
              value={totalRegistrations}
              icon={<Users size={20} />}
              context="Verified student participants"
              iconBgColor="#E0F2FE"
              iconColor="#0284C7"
            />

            <StatCard
              label="Past Events"
              value={pastEventsList.length}
              icon={<History size={20} />}
              context="Archived club sessions"
              iconBgColor="#FEF3C7"
              iconColor="#D97706"
            />
          </Box>
        )}
      </Box>

      {/* CHARTS */}
      {!isLoading && (
        <DashboardCharts timelineData={timelineData} byEventData={byEventData} />
      )}

      {/* LOWER SECTION: UPCOMING EVENTS & RECENT REGISTRATIONS */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: 3,
        }}
      >
        {/* Upcoming Events Section */}
        <Card sx={{ p: 3, borderRadius: 3.5, border: '1px solid #E2E8F0', height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A' }}>
                Upcoming Events
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>
                Next scheduled technical events
              </Typography>
            </Box>
            <Button
              size="small"
              onClick={() => navigate('/admin/events')}
              endIcon={<ArrowRight size={14} />}
              sx={{ fontWeight: 600 }}
            >
              All Events
            </Button>
          </Box>

          {isLoading ? (
            <TableSkeleton rows={4} columns={3} />
          ) : upcomingEventsList.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center', color: '#94A3B8' }}>
              <Typography variant="body2">No upcoming events scheduled</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {upcomingEventsList.slice(0, 4).map((ev) => {
                const catStyle = getCategoryColor(ev.category);
                return (
                  <Box
                    key={ev.id}
                    sx={{
                      p: 1.8,
                      borderRadius: 2.5,
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'background-color 0.2s',
                      '&:hover': { backgroundColor: '#F1F5F9' },
                    }}
                  >
                    <Box sx={{ overflow: 'hidden', mr: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Chip
                          label={ev.category}
                          size="small"
                          sx={{
                            backgroundColor: catStyle.bg,
                            color: catStyle.text,
                            fontWeight: 700,
                            fontSize: '0.65rem',
                            height: 20,
                          }}
                        />
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 700,
                            color: '#0F172A',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {ev.name}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#64748B' }}>
                        <Typography variant="caption" sx={{ color: '#475569', fontWeight: 500 }}>
                          {new Date(ev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {ev.time.slice(0, 5)}
                        </Typography>
                        <Typography variant="caption">•</Typography>
                        <Typography variant="caption" sx={{ color: '#64748B' }}>
                          {ev.venue}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                      <Chip
                        label={`${ev.registration_count || 0} Registered`}
                        size="small"
                        sx={{
                          backgroundColor: '#EEF2FF',
                          color: '#4F46E5',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                        }}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
        </Card>

        {/* Recent Registrations Section */}
        <Card sx={{ p: 3, borderRadius: 3.5, border: '1px solid #E2E8F0', height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A' }}>
                Recent Registrations
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>
                Latest student admissions
              </Typography>
            </Box>
            <Button
              size="small"
              onClick={() => navigate('/admin/registrations')}
              endIcon={<ArrowRight size={14} />}
              sx={{ fontWeight: 600 }}
            >
              View All
            </Button>
          </Box>

          {isLoading ? (
            <TableSkeleton rows={4} columns={3} />
          ) : recentRegistrations.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center', color: '#94A3B8' }}>
              <Typography variant="body2">No student registrations recorded</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Event</TableCell>
                    <TableCell>Year</TableCell>
                    <TableCell align="right">Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentRegistrations.map((reg) => (
                    <TableRow key={reg.id} hover>
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F172A', fontSize: '0.85rem' }}>
                          {reg.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748B' }}>
                          {reg.email}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography variant="body2" sx={{ color: '#334155', fontSize: '0.85rem' }}>
                          {reg.events?.name || 'Assigned Event'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Chip label={reg.year} size="small" sx={{ fontSize: '0.7rem', height: 22 }} />
                      </TableCell>
                      <TableCell align="right" sx={{ py: 1.5 }}>
                        <Typography variant="caption" sx={{ color: '#64748B' }}>
                          {reg.created_at ? new Date(reg.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recent'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>
      </Box>
    </Box>
  );
};
