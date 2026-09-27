import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  LinearProgress,
} from '@mui/material';
import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { EventItem } from '../types/event';

interface EventCardProps {
  event: EventItem;
}

export const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'coding':
      return { bg: '#EEF2FF', text: '#4F46E5', border: '#C7D2FE' };
    case 'workshop':
      return { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' };
    case 'hackathon':
      return { bg: '#FAF5FF', text: '#9333EA', border: '#E9D5FF' };
    case 'seminar':
      return { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' };
    case 'cultural':
      return { bg: '#FFF1F2', text: '#E11D48', border: '#FECDD3' };
    case 'sports':
      return { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' };
    default:
      return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' };
  }
};

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();

  const isPast = new Date(event.date + 'T23:59:59') < new Date();
  const regCount = event.registration_count || 0;
  const maxCap = event.max_participants || 100;
  const isFull = regCount >= maxCap;
  const isClosed = !event.registration_open || isPast;

  const categoryStyle = getCategoryColor(event.category);

  // Status badge styling
  let statusLabel = 'Registration Open';
  let statusColor = { bg: '#DCFCE7', text: '#15803D' };

  if (isFull) {
    statusLabel = 'Registration Full';
    statusColor = { bg: '#FEE2E2', text: '#B91C1C' };
  } else if (isClosed) {
    statusLabel = 'Registration Closed';
    statusColor = { bg: '#F1F5F9', text: '#64748B' };
  }

  // Format date
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3.5,
        border: '1px solid #E2E8F0',
        transition: 'all 0.25s ease-in-out',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px -4px rgba(15, 23, 42, 0.08), 0 8px 16px -6px rgba(15, 23, 42, 0.04)',
          borderColor: '#CBD5E1',
        },
      }}
    >
      {/* Banner Image */}
      <Box sx={{ position: 'relative', height: 180, overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="180"
          image={
            event.banner_url ||
            'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'
          }
          alt={event.name}
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
            '&:hover': { transform: 'scale(1.04)' },
          }}
        />

        {/* Category Pill */}
        <Chip
          label={event.category}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            backgroundColor: categoryStyle.bg,
            color: categoryStyle.text,
            border: `1px solid ${categoryStyle.border}`,
            fontWeight: 700,
            fontSize: '0.75rem',
            backdropFilter: 'blur(8px)',
          }}
        />

        {/* Status Pill */}
        <Chip
          label={statusLabel}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: statusColor.bg,
            color: statusColor.text,
            fontWeight: 600,
            fontSize: '0.75rem',
          }}
        />
      </Box>

      {/* Content */}
      <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: '1.15rem',
            lineHeight: 1.3,
            color: '#0F172A',
            mb: 1.2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.6em',
          }}
        >
          {event.name}
        </Typography>

        {/* Meta Info */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#475569', fontSize: '0.85rem' }}>
            <Calendar size={15} color="#6366F1" />
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#334155' }}>
              {formattedDate}
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8' }}>•</Typography>
            <Clock size={15} color="#6366F1" />
            <Typography variant="body2" sx={{ color: '#64748B' }}>
              {event.time.slice(0, 5)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#64748B', fontSize: '0.85rem' }}>
            <MapPin size={15} color="#6366F1" style={{ flexShrink: 0 }} />
            <Typography
              variant="body2"
              sx={{
                color: '#64748B',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {event.venue}
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: '#64748B',
            mb: 2.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontSize: '0.875rem',
            lineHeight: 1.5,
          }}
        >
          {event.short_description || event.description}
        </Typography>

        {/* Capacity / Registrations Bar */}
        <Box sx={{ mt: 'auto', mb: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: '#64748B' }}>
              <Users size={14} />
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#475569' }}>
                Capacity
              </Typography>
            </Box>
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
                borderRadius: 3,
                backgroundColor: isFull ? '#EF4444' : '#4F46E5',
              },
            }}
          />
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1.5, pt: 0.5 }}>
          <Button
            variant="outlined"
            size="small"
            fullWidth
            onClick={() => navigate(`/events/${event.id}`)}
            sx={{
              borderColor: '#E2E8F0',
              color: '#334155',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            View Details
          </Button>

          <Button
            variant="contained"
            size="small"
            fullWidth
            disabled={isFull || isClosed}
            onClick={() => navigate(`/register/${event.id}`)}
            endIcon={<ArrowRight size={14} />}
            sx={{
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            {isFull ? 'Full' : isClosed ? 'Closed' : 'Register'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
