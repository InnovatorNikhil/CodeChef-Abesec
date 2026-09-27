import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  MenuItem,
  Alert,
  Breadcrumbs,
  Link as MuiLink,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  CheckCircle2,
  Calendar,
  MapPin,
  ArrowLeft,
  Clock,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/registrationService';
import type { EventItem } from '../types/event';
import type { StudentYear } from '../types/registration';

const YEARS: StudentYear[] = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

export const Register: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('ABES Engineering College');
  const [year, setYear] = useState<StudentYear>('2nd Year');
  const [phone, setPhone] = useState('');

  // Validation & Submission State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    async function loadEvent() {
      if (!eventId) return;
      setIsLoadingEvent(true);
      try {
        const data = await eventService.getEventById(eventId);
        setEvent(data);
      } catch (err) {
        console.error('Error fetching event for registration:', err);
      } finally {
        setIsLoadingEvent(false);
      }
    }
    loadEvent();
  }, [eventId]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please provide a valid email address';
    }
    if (!college.trim()) errs.college = 'College/University is required';
    if (!year) errs.year = 'Academic year is required';
    if (!phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!/^\+?[0-9\s\-()]{10,15}$/.test(phone.trim())) {
      errs.phone = 'Please provide a valid phone number (at least 10 digits)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) return;
    if (!eventId || !event) return;

    // Check capacity
    const currentCount = event.registration_count || 0;
    const maxCap = event.max_participants || 100;
    if (currentCount >= maxCap) {
      setErrorMessage('Registration Full. This event has reached capacity.');
      return;
    }

    setIsSubmitting(true);
    try {
      await registrationService.registerStudent({
        event_id: eventId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        college: college.trim(),
        year,
        phone: phone.trim(),
      });

      setIsSuccess(true);
    } catch (err: any) {
      console.error('Registration failed:', err);
      setErrorMessage(err?.message || 'An error occurred during registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingEvent) {
    return (
      <Box sx={{ py: 8, display: 'flex', justifyContent: 'center', backgroundColor: '#F8FAFC', minHeight: '80vh' }}>
        <CircularProgress size={40} sx={{ color: '#4F46E5' }} />
      </Box>
    );
  }

  if (!event) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Event Not Found
        </Typography>
        <Button variant="contained" onClick={() => navigate('/events')}>
          Back to Events
        </Button>
      </Container>
    );
  }

  const isPast = new Date(event.date + 'T23:59:59') < new Date();
  const isFull = (event.registration_count || 0) >= (event.max_participants || 100);
  const isClosed = !event.registration_open || isPast;

  // SUCCESS STATE VIEW
  if (isSuccess) {
    return (
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#F8FAFC', minHeight: '85vh' }}>
        <Container maxWidth="sm">
          <Card
            sx={{
              p: { xs: 4, sm: 5 },
              textAlign: 'center',
              borderRadius: 4,
              border: '1px solid #E2E8F0',
              boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
              backgroundColor: '#FFFFFF',
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                backgroundColor: '#DCFCE7',
                color: '#16A34A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2.5,
              }}
            >
              <CheckCircle2 size={40} />
            </Box>

            <Typography variant="h3" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
              You're Registered!
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748B', mb: 4 }}>
              A confirmation receipt and event instructions have been recorded.
            </Typography>

            <Box
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                textAlign: 'left',
                mb: 4,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                  PARTICIPANT NAME
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F172A' }}>
                  {name}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                  EVENT
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#4F46E5', textAlign: 'right' }}>
                  {event.name}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                  DATE & TIME
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A' }}>
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {event.time.slice(0, 5)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                  VENUE
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A' }}>
                  {event.venue}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                  CONFIRMATION EMAIL
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A' }}>
                  {email}
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={() => navigate('/events')}
              sx={{ py: 1.3, fontWeight: 700 }}
            >
              Back to Events
            </Button>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: { xs: 4, md: 6 }, backgroundColor: '#F8FAFC', minHeight: '85vh' }}>
      <Container maxWidth="md">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs sx={{ mb: 3, fontSize: '0.85rem' }}>
          <MuiLink component={Link} to="/" underline="hover" color="inherit">
            Home
          </MuiLink>
          <MuiLink component={Link} to="/events" underline="hover" color="inherit">
            Events
          </MuiLink>
          <MuiLink component={Link} to={`/events/${event.id}`} underline="hover" color="inherit">
            {event.name}
          </MuiLink>
          <Typography color="text.primary" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
            Register
          </Typography>
        </Breadcrumbs>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '0.8fr 1.2fr' },
            gap: 4,
            alignItems: 'start',
          }}
        >
          {/* Left Column: Event Summary Brief */}
          <Box>
            <Card
              sx={{
                p: 3,
                borderRadius: 3.5,
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                mb: 3,
              }}
            >
              <Chip
                label={event.category}
                size="small"
                sx={{
                  backgroundColor: '#EEF2FF',
                  color: '#4F46E5',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  mb: 1.5,
                }}
              />
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mb: 2 }}>
                {event.name}
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#475569' }}>
                  <Calendar size={16} color="#6366F1" />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B' }}>
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#475569' }}>
                  <Clock size={16} color="#6366F1" />
                  <Typography variant="body2" sx={{ color: '#64748B' }}>
                    {event.time.slice(0, 5)} IST
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#475569' }}>
                  <MapPin size={16} color="#6366F1" />
                  <Typography variant="body2" sx={{ color: '#64748B' }}>
                    {event.venue}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ pt: 2, borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShieldCheck size={18} color="#10B981" />
                <Typography variant="caption" sx={{ color: '#047857', fontWeight: 600 }}>
                  Free Registration • Certificate Included
                </Typography>
              </Box>
            </Card>

            <Button
              variant="text"
              startIcon={<ArrowLeft size={16} />}
              onClick={() => navigate(`/events/${event.id}`)}
              sx={{ color: '#64748B' }}
            >
              Back to Details
            </Button>
          </Box>

          {/* Right Column: Registration Form */}
          <Box>
            <Card
              sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: 4,
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
                Student Registration
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
                Enter your details accurately. Your name will appear on the certificate of participation.
              </Typography>

              {/* Closed or Capacity Alert */}
              {isFull ? (
                <Alert severity="error" icon={<AlertTriangle size={20} />} sx={{ mb: 3, borderRadius: 2 }}>
                  Registration Full. Maximum participant capacity reached for this event.
                </Alert>
              ) : isClosed ? (
                <Alert severity="warning" icon={<AlertTriangle size={20} />} sx={{ mb: 3, borderRadius: 2 }}>
                  Registration Closed. This event is no longer accepting new participants.
                </Alert>
              ) : null}

              {/* Dynamic Error Message */}
              {errorMessage && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {errorMessage}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    placeholder="e.g. Aarav Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={!!errors.name}
                    helperText={errors.name}
                    disabled={isSubmitting || isFull || isClosed}
                    required
                  />

                  <TextField
                    fullWidth
                    type="email"
                    label="Email Address"
                    placeholder="e.g. your.name@abes.ac.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email || 'We will send your entry pass here.'}
                    disabled={isSubmitting || isFull || isClosed}
                    required
                  />

                  <TextField
                    fullWidth
                    label="College / University"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    error={!!errors.college}
                    helperText={errors.college}
                    disabled={isSubmitting || isFull || isClosed}
                    required
                  />

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                    <TextField
                      fullWidth
                      select
                      label="Year of Study"
                      value={year}
                      onChange={(e) => setYear(e.target.value as StudentYear)}
                      error={!!errors.year}
                      helperText={errors.year}
                      disabled={isSubmitting || isFull || isClosed}
                      required
                    >
                      {YEARS.map((yr) => (
                        <MenuItem key={yr} value={yr}>
                          {yr}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      fullWidth
                      label="Phone Number"
                      placeholder="e.g. +91 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      error={!!errors.phone}
                      helperText={errors.phone}
                      disabled={isSubmitting || isFull || isClosed}
                      required
                    />
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={isSubmitting || isFull || isClosed}
                    sx={{
                      py: 1.4,
                      fontWeight: 700,
                      fontSize: '1rem',
                      mt: 1,
                    }}
                  >
                    {isSubmitting ? (
                      <CircularProgress size={24} sx={{ color: '#FFFFFF' }} />
                    ) : (
                      'Complete Registration'
                    )}
                  </Button>
                </Box>
              </Box>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
