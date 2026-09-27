import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  Chip,
} from '@mui/material';
import {
  Sparkles,
  ArrowRight,
  Code,
  Terminal,
  Trophy,
  Users,
  Compass,
  Cpu,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import type { EventItem } from '../types/event';
import { EventCard } from '../components/EventCard';
import { EventCardsSkeleton } from '../components/LoadingState';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [featuredEvent, setFeaturedEvent] = useState<EventItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [allEvents, featured] = await Promise.all([
          eventService.getEvents(),
          eventService.getFeaturedEvent(),
        ]);
        setEvents(allEvents);
        setFeaturedEvent(featured || allEvents[0] || null);
      } catch (err) {
        console.error('Failed to load homepage events:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const upcomingEvents = events
    .filter((e) => new Date(e.date + 'T23:59:59') >= new Date() && e.registration_open)
    .slice(0, 3);

  const pillars = [
    {
      icon: <Terminal size={24} color="#4F46E5" />,
      title: 'Competitive Programming',
      desc: 'Weekly algorithm contests, rating ladders, and expert editorial sessions to sharpen your problem-solving grit.',
      bg: '#EEF2FF',
    },
    {
      icon: <Cpu size={24} color="#0EA5E9" />,
      title: 'Technical Workshops',
      desc: 'Hands-on bootcamps diving deep into modern web architectures, DevOps, cloud computing, and AI engineering.',
      bg: '#E0F2FE',
    },
    {
      icon: <Trophy size={24} color="#8B5CF6" />,
      title: 'High-Stakes Hackathons',
      desc: 'Multi-day sprints where student developers collaborate, build impactful prototypes, and win prize pools.',
      bg: '#F5F3FF',
    },
    {
      icon: <Users size={24} color="#10B981" />,
      title: 'Inclusive Community',
      desc: 'A vibrant peer-to-peer network of coders, designers, and open-source contributors supporting your growth.',
      bg: '#ECFDF5',
    },
  ];

  const whyJoin = [
    {
      icon: <Compass size={22} color="#4F46E5" />,
      title: 'Learn',
      description: 'Master data structures, algorithms, and real-world system engineering from high-performing seniors.',
    },
    {
      icon: <Trophy size={22} color="#F59E0B" />,
      title: 'Compete',
      description: 'Challenge your peers in time-constrained coding rounds designed to mirror ICPC and top tech interviews.',
    },
    {
      icon: <Code size={22} color="#0EA5E9" />,
      title: 'Build',
      description: 'Transform concepts into shipped open-source applications, bots, and full-stack projects for your resume.',
    },
    {
      icon: <Users size={22} color="#10B981" />,
      title: 'Connect',
      description: 'Network with alumni working at tier-1 product companies and build lifelong engineering bonds.',
    },
  ];

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden' }}>
      {/* SECTION 1 — HERO */}
      <Box sx={{ pt: { xs: 4, md: 6 }, pb: { xs: 6, md: 8 }, backgroundColor: '#F8FAFC' }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              position: 'relative',
              borderRadius: { xs: 4, md: 6 },
              background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 40%, #1E3A8A 75%, #0F172A 100%)',
              color: '#FFFFFF',
              p: { xs: 4, sm: 6, md: 8 },
              overflow: 'hidden',
              boxShadow: '0 20px 40px -15px rgba(30, 27, 75, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            {/* Ambient Glows */}
            <Box
              sx={{
                position: 'absolute',
                top: '-20%',
                right: '-10%',
                width: 500,
                height: 500,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, rgba(59, 130, 246, 0) 70%)',
                filter: 'blur(50px)',
                pointerEvents: 'none',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: '-25%',
                left: '20%',
                width: 400,
                height: 400,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(14, 165, 233, 0.25) 0%, rgba(16, 185, 129, 0) 70%)',
                filter: 'blur(50px)',
                pointerEvents: 'none',
              }}
            />

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1.2fr 0.8fr' },
                gap: 4,
                alignItems: 'center',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <Box>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 1.8,
                    py: 0.6,
                    borderRadius: 999,
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    mb: 3,
                  }}
                >
                  <Sparkles size={16} color="#818CF8" />
                  <Typography variant="caption" sx={{ fontWeight: 600, letterSpacing: '0.02em', color: '#E0E7FF' }}>
                    ABES Engineering College • Official Student Chapter
                  </Typography>
                </Box>

                <Typography
                  variant="h1"
                  sx={{
                    color: '#FFFFFF',
                    fontSize: { xs: '2.25rem', sm: '3rem', md: '3.5rem' },
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.15,
                    mb: 2.5,
                  }}
                >
                  Discover.{' '}
                  <span
                    style={{
                      background: 'linear-gradient(90deg, #818CF8 0%, #38BDF8 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Participate.
                  </span>{' '}
                  Connect.
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: '#CBD5E1',
                    fontSize: { xs: '1rem', md: '1.15rem' },
                    maxWidth: 540,
                    lineHeight: 1.6,
                    mb: 4,
                  }}
                >
                  Explore coding competitions, workshops, hackathons and technical events happening across our college community.
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/events')}
                    endIcon={<ArrowRight size={18} />}
                    sx={{
                      backgroundColor: '#FFFFFF',
                      color: '#1E1B4B',
                      fontWeight: 700,
                      px: 3.5,
                      py: 1.3,
                      borderRadius: 2.5,
                      '&:hover': {
                        backgroundColor: '#F1F5F9',
                        color: '#312E81',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Explore Events
                  </Button>

                  {featuredEvent && (
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate(`/events/${featuredEvent.id}`)}
                      sx={{
                        color: '#FFFFFF',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        borderRadius: 2.5,
                        px: 3,
                        py: 1.3,
                        backdropFilter: 'blur(8px)',
                        '&:hover': {
                          borderColor: '#FFFFFF',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      View Featured Event
                    </Button>
                  )}
                </Box>
              </Box>

              {/* Abstract Tech Visual */}
              <Box
                sx={{
                  position: 'relative',
                  p: 3,
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5, pb: 1.5, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <Box sx={{ display: 'flex', gap: 0.8 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#EF4444' }} />
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10B981' }} />
                  </Box>
                  <Typography variant="caption" sx={{ color: '#94A3B8', fontFamily: 'monospace' }}>
                    chapter_stats.json
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ p: 2, borderRadius: 2.5, background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>Active Students</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#FFFFFF', my: 0.2 }}>1,450+</Typography>
                    <Typography variant="caption" sx={{ color: '#38BDF8' }}>Across Computer Science & IT</Typography>
                  </Box>

                  <Box sx={{ p: 2, borderRadius: 2.5, background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>Contests & Hackathons Hosted</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#FFFFFF', my: 0.2 }}>35+ Edition Events</Typography>
                    <Typography variant="caption" sx={{ color: '#34D399' }}>Verified Certificate Endorsements</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* SECTION 2 — CLUB INTRODUCTION */}
      <Box id="about" sx={{ py: { xs: 8, md: 10 }, backgroundColor: '#FFFFFF' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 720, mx: 'auto', mb: 7 }}>
            <Chip
              label="ABOUT OUR CHAPTER"
              size="small"
              sx={{
                backgroundColor: '#EEF2FF',
                color: '#4F46E5',
                fontWeight: 700,
                fontSize: '0.75rem',
                mb: 1.5,
              }}
            />
            <Typography variant="h2" sx={{ fontWeight: 800, color: '#0F172A', mb: 2 }}>
              Built by Students. Driven by Technology.
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748B', fontSize: '1.05rem', lineHeight: 1.6 }}>
              ABES CodeChef Chapter is a student-driven technical community focused on competitive programming, development, innovation and collaborative learning.
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
              gap: 3.5,
            }}
          >
            {pillars.map((pillar) => (
              <Card
                key={pillar.title}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3.5,
                  border: '1px solid #E2E8F0',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px -4px rgba(15, 23, 42, 0.06)',
                    borderColor: '#CBD5E1',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 3,
                    backgroundColor: pillar.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2.5,
                  }}
                >
                  {pillar.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#0F172A', fontSize: '1.1rem' }}>
                  {pillar.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.6 }}>
                  {pillar.desc}
                </Typography>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* SECTION 3 — UPCOMING EVENTS */}
      <Box sx={{ py: { xs: 8, md: 10 }, backgroundColor: '#F8FAFC' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'flex-end' }, mb: 5, gap: 2 }}>
            <Box>
              <Chip
                label="DON'T MISS OUT"
                size="small"
                sx={{
                  backgroundColor: '#EFF6FF',
                  color: '#2563EB',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  mb: 1.5,
                }}
              />
              <Typography variant="h2" sx={{ fontWeight: 800, color: '#0F172A' }}>
                Upcoming Events
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
                Reserve your seat before spots fill up to maximum capacity.
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={() => navigate('/events')}
              endIcon={<ChevronRight size={16} />}
              sx={{ fontWeight: 600 }}
            >
              View All Events
            </Button>
          </Box>

          {isLoading ? (
            <EventCardsSkeleton count={3} />
          ) : upcomingEvents.length > 0 ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                gap: 3,
              }}
            >
              {upcomingEvents.map((ev) => (
                <EventCard key={ev.id} event={ev} />
              ))}
            </Box>
          ) : (
            <Box sx={{ p: 6, textAlign: 'center', background: '#FFFFFF', borderRadius: 3, border: '1px dashed #CBD5E1' }}>
              <Typography variant="h6" sx={{ color: '#64748B' }}>
                No upcoming events right now. Check back soon!
              </Typography>
            </Box>
          )}
        </Container>
      </Box>

      {/* SECTION 4 — FEATURED EVENT */}
      {featuredEvent && (
        <Box sx={{ py: { xs: 8, md: 10 }, backgroundColor: '#FFFFFF' }}>
          <Container maxWidth="lg">
            <Box
              sx={{
                borderRadius: { xs: 4, md: 5 },
                background: 'linear-gradient(135deg, #312E81 0%, #1E40AF 60%, #0369A1 100%)',
                color: '#FFFFFF',
                overflow: 'hidden',
                boxShadow: '0 20px 40px -10px rgba(49, 46, 129, 0.3)',
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1.2fr 0.8fr' },
                }}
              >
                <Box sx={{ p: { xs: 4, sm: 6, md: 7 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5 }}>
                    <Chip
                      label="FEATURED FLAGSHIP"
                      size="small"
                      sx={{
                        backgroundColor: '#FEF08A',
                        color: '#854D0E',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                      }}
                    />
                    <Chip
                      label={featuredEvent.category}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        color: '#FFFFFF',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        backdropFilter: 'blur(8px)',
                      }}
                    />
                  </Box>

                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 800,
                      color: '#FFFFFF',
                      fontSize: { xs: '1.8rem', md: '2.5rem' },
                      letterSpacing: '-0.02em',
                      lineHeight: 1.2,
                      mb: 2,
                    }}
                  >
                    {featuredEvent.name}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      color: '#E0E7FF',
                      lineHeight: 1.6,
                      mb: 3.5,
                      fontSize: '1rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {featuredEvent.description || featuredEvent.short_description}
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4, py: 2, borderTop: '1px solid rgba(255,255,255,0.15)', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Calendar size={18} color="#93C5FD" />
                      <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                        {new Date(featuredEvent.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Clock size={18} color="#93C5FD" />
                      <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                        {featuredEvent.time.slice(0, 5)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MapPin size={18} color="#93C5FD" />
                      <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                        {featuredEvent.venue}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate(`/register/${featuredEvent.id}`)}
                      endIcon={<ArrowRight size={18} />}
                      sx={{
                        backgroundColor: '#FFFFFF',
                        color: '#1E3A8A',
                        fontWeight: 700,
                        px: 3.5,
                        py: 1.2,
                        borderRadius: 2.5,
                        '&:hover': {
                          backgroundColor: '#F8FAFC',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      Register Now
                    </Button>
                    <Typography variant="body2" sx={{ color: '#BAE6FD', fontWeight: 600 }}>
                      {featuredEvent.registration_count || 0} already registered
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Box
                    component="img"
                    src={featuredEvent.banner_url || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80'}
                    alt={featuredEvent.name}
                    sx={{
                      width: '100%',
                      height: '100%',
                      minHeight: { xs: 260, md: '100%' },
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>
      )}

      {/* SECTION 5 — WHY JOIN */}
      <Box sx={{ py: { xs: 8, md: 10 }, backgroundColor: '#F8FAFC' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 640, mx: 'auto', mb: 7 }}>
            <Chip
              label="ADVANTAGES"
              size="small"
              sx={{
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                fontWeight: 700,
                fontSize: '0.75rem',
                mb: 1.5,
              }}
            />
            <Typography variant="h2" sx={{ fontWeight: 800, color: '#0F172A', mb: 1.5 }}>
              Why Participate?
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748B' }}>
              Equip yourself with practical engineering skills, competitive rank badges, and a supportive collegiate community.
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
              gap: 3,
            }}
          >
            {whyJoin.map((item) => (
              <Card
                key={item.title}
                sx={{
                  p: 3,
                  height: '100%',
                  borderRadius: 3.5,
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2.5,
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  {item.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', mb: 1 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.55 }}>
                  {item.description}
                </Typography>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* SECTION 6 — CTA */}
      <Box sx={{ py: { xs: 8, md: 10 }, backgroundColor: '#FFFFFF', borderTop: '1px solid #F1F5F9' }}>
        <Container maxWidth="md">
          <Box
            sx={{
              p: { xs: 4, sm: 6 },
              textAlign: 'center',
              borderRadius: 4,
              backgroundColor: '#EEF2FF',
              border: '1px solid #C7D2FE',
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#1E1B4B', mb: 1.5 }}>
              Ready for the next event?
            </Typography>
            <Typography variant="body1" sx={{ color: '#475569', maxWidth: 500, mx: 'auto', mb: 3.5 }}>
              Check out all scheduled workshops, coding contests, and keynote talks. Registration is free and open to all students.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/events')}
              endIcon={<ArrowRight size={18} />}
              sx={{
                backgroundColor: '#4F46E5',
                color: '#FFFFFF',
                px: 4,
                py: 1.4,
                fontWeight: 700,
                borderRadius: 2.5,
                '&:hover': {
                  backgroundColor: '#4338CA',
                },
              }}
            >
              Explore All Events
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
