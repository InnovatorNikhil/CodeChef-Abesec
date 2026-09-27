import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  Chip,
  Breadcrumbs,
  Link as MuiLink,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Share2,
} from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { eventService } from '../services/eventService';
import type { EventItem } from '../types/event';
import { getCategoryColor } from '../components/EventCard';

export const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    async function loadEvent() {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await eventService.getEventById(id);
        setEvent(data);
      } catch (err) {
        console.error('Error fetching event details:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadEvent();
  }, [id]);

  if (isLoading) {
    return (
      <Box sx={{ py: 8, display: 'flex', justifyContent: 'center', backgroundColor: '#F8FAFC', minHeight: '80vh' }}>
        <Container maxWidth="md">
          <Typography variant="body1" sx={{ color: '#64748B' }}>
            Loading event specifications...
          </Typography>
        </Container>
      </Box>
    );
  }

  if (!event) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <AlertCircle size={48} color="#EF4444" style={{ marginBottom: 16 }} />
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5 }}>
          Event Not Found
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748B', mb: 3 }}>
          The requested event could not be found or may have been removed.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/events')}>
          Back to Events
        </Button>
      </Container>
    );
  }

  const isPast = new Date(event.date + 'T23:59:59') < new Date();
  const regCount = event.registration_count || 0;
  const maxCap = event.max_participants || 100;
  const isFull = regCount >= maxCap;
  const isClosed = !event.registration_open || isPast;

  const categoryStyle = getCategoryColor(event.category);

  let statusLabel = 'Registration Open';
  let statusColor = { bg: '#DCFCE7', text: '#15803D' };
  if (isFull) {
    statusLabel = 'Registration Full';
    statusColor = { bg: '#FEE2E2', text: '#B91C1C' };
  } else if (isClosed) {
    statusLabel = 'Registration Closed';
    statusColor = { bg: '#F1F5F9', text: '#64748B' };
  }

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedDeadline = event.registration_deadline
    ? new Date(event.registration_deadline).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Day prior to event';

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  return (
    <Box sx={{ py: { xs: 4, md: 6 }, backgroundColor: '#F8FAFC', minHeight: '85vh' }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Breadcrumbs sx={{ fontSize: '0.85rem' }}>
            <MuiLink component={Link} to="/" underline="hover" color="inherit">
              Home
            </MuiLink>
            <MuiLink component={Link} to="/events" underline="hover" color="inherit">
              Events
            </MuiLink>
            <Typography color="text.primary" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
              {event.name}
            </Typography>
          </Breadcrumbs>

          <Button
            variant="text"
            size="small"
            startIcon={<ArrowLeft size={16} />}
            onClick={() => navigate('/events')}
            sx={{ color: '#475569', fontWeight: 600 }}
          >
            Back to Events
          </Button>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.4fr 0.8fr' },
            gap: 4,
            alignItems: 'start',
          }}
        >
          {/* Left Column: Banner, Details, Description */}
          <Box>
            {/* Banner Image Container */}
            <Box
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                position: 'relative',
                height: { xs: 240, sm: 360 },
                mb: 4,
                boxShadow: '0 8px 30px rgba(15, 23, 42, 0.08)',
                border: '1px solid #E2E8F0',
              }}
            >
              <Box
                component="img"
                src={
                  event.banner_url ||
                  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80'
                }
                alt={event.name}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(15, 23, 42, 0.7) 0%, transparent 60%)',
                }}
              />
              <Box sx={{ position: 'absolute', bottom: 20, left: 24, display: 'flex', gap: 1.5 }}>
                <Chip
                  label={event.category}
                  sx={{
                    backgroundColor: categoryStyle.bg,
                    color: categoryStyle.text,
                    fontWeight: 700,
                    border: `1px solid ${categoryStyle.border}`,
                  }}
                />
                <Chip
                  label={statusLabel}
                  sx={{
                    backgroundColor: statusColor.bg,
                    color: statusColor.text,
                    fontWeight: 700,
                  }}
                />
              </Box>
            </Box>

            {/* Event Name & Short Overview */}
            <Typography variant="h2" sx={{ fontWeight: 800, color: '#0F172A', mb: 2, letterSpacing: '-0.02em' }}>
              {event.name}
            </Typography>

            {event.short_description && (
              <Typography variant="subtitle1" sx={{ color: '#475569', fontSize: '1.1rem', mb: 3.5, lineHeight: 1.6 }}>
                {event.short_description}
              </Typography>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Detailed Description */}
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#0F172A', mb: 2 }}>
              About the Event
            </Typography>
            <Typography variant="body1" sx={{ color: '#334155', lineHeight: 1.8, fontSize: '1rem', whiteSpace: 'pre-line' }}>
              {event.description || event.short_description}
            </Typography>

            {/* Community Standards Box */}
            <Box
              sx={{
                mt: 5,
                p: 3,
                borderRadius: 3.5,
                backgroundColor: '#EEF2FF',
                border: '1px solid #C7D2FE',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
              }}
            >
              <ShieldCheck size={28} color="#4F46E5" style={{ flexShrink: 0, marginTop: 2 }} />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1E1B4B', mb: 0.5 }}>
                  Verified ABES Student Event
                </Typography>
                <Typography variant="body2" sx={{ color: '#4338CA', lineHeight: 1.6 }}>
                  Organized under the faculty supervision of the Department of Computer Science & Engineering. All attendees receive verified digital participation certificates.
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right Column: Event Meta & Registration Card */}
          <Box>
            <Card
              sx={{
                p: 3.5,
                borderRadius: 4,
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 20px rgba(15, 23, 42, 0.06)',
                position: { md: 'sticky' },
                top: { md: 96 },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 2.5 }}>
                Event Logistics
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mb: 3.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ p: 1.2, borderRadius: 2, backgroundColor: '#EEF2FF', color: '#4F46E5' }}>
                    <Calendar size={20} />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                      Date
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#0F172A' }}>
                      {formattedDate}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ p: 1.2, borderRadius: 2, backgroundColor: '#E0F2FE', color: '#0284C7' }}>
                    <Clock size={20} />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                      Time
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#0F172A' }}>
                      {event.time.slice(0, 5)} IST
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ p: 1.2, borderRadius: 2, backgroundColor: '#FEF3C7', color: '#D97706' }}>
                    <MapPin size={20} />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                      Venue
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#0F172A' }}>
                      {event.venue}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ p: 1.2, borderRadius: 2, backgroundColor: '#F3E8FF', color: '#9333EA' }}>
                    <Users size={20} />
                  </Box>
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                        Seats Registered
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#0F172A' }}>
                        {regCount} / {maxCap}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(100, (regCount / maxCap) * 100)}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: '#F1F5F9',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: isFull ? '#EF4444' : '#4F46E5',
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              <Box sx={{ p: 2, borderRadius: 2.5, backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', mb: 3 }}>
                <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 0.5 }}>
                  Registration Deadline
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B' }}>
                  {formattedDeadline}
                </Typography>
              </Box>

              {/* Action Button */}
              <Button
                variant="contained"
                size="large"
                fullWidth
                disabled={isFull || isClosed}
                onClick={() => navigate(`/register/${event.id}`)}
                endIcon={<ArrowRight size={18} />}
                sx={{
                  py: 1.4,
                  fontWeight: 700,
                  fontSize: '1rem',
                  mb: 2,
                }}
              >
                {isFull ? 'Registration Full' : isClosed ? 'Registration Closed' : 'Register Now'}
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={handleShare}
                startIcon={copySuccess ? <CheckCircle size={16} color="#10B981" /> : <Share2 size={16} />}
                sx={{ borderColor: '#E2E8F0', color: '#475569', fontWeight: 600 }}
              >
                {copySuccess ? 'Link Copied!' : 'Share Event Link'}
              </Button>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
