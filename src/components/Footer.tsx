import React from 'react';
import { Box, Container, Typography, Link as MuiLink, IconButton } from '@mui/material';
import { Code2, Mail, MapPin, Globe, Share2, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E2E8F0',
        pt: 8,
        pb: 5,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '5fr 3fr 4fr' },
            gap: 4,
            mb: 6,
          }}
        >
          {/* Brand Col */}
          <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2', md: 'span 1' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                }}
              >
                <Code2 size={20} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A' }}>
                CodeChef <span style={{ color: '#4F46E5' }}>ABES</span>
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#64748B', maxWidth: 360, mb: 3, lineHeight: 1.6 }}>
              The premier student-driven competitive programming and software engineering community at ABES Engineering College. Fostering innovation, algorithmic problem solving, and collaborative hackathons.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                component="a"
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                size="small"
                sx={{ color: '#64748B', '&:hover': { color: '#0F172A', backgroundColor: '#F1F5F9' } }}
              >
                <Globe size={18} />
              </IconButton>
              <IconButton
                component="a"
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                size="small"
                sx={{ color: '#64748B', '&:hover': { color: '#0A66C2', backgroundColor: '#F1F5F9' } }}
              >
                <Share2 size={18} />
              </IconButton>
              <IconButton
                component="a"
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                size="small"
                sx={{ color: '#64748B', '&:hover': { color: '#1DA1F2', backgroundColor: '#F1F5F9' } }}
              >
                <Send size={18} />
              </IconButton>
            </Box>
          </Box>

          {/* Quick Links */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A', mb: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quick Navigation
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <MuiLink component={Link} to="/" sx={{ color: '#64748B', fontSize: '0.9rem', '&:hover': { color: '#4F46E5' } }}>
                Home
              </MuiLink>
              <MuiLink component={Link} to="/events" sx={{ color: '#64748B', fontSize: '0.9rem', '&:hover': { color: '#4F46E5' } }}>
                All Events
              </MuiLink>
              <MuiLink component={Link} to="/#about" sx={{ color: '#64748B', fontSize: '0.9rem', '&:hover': { color: '#4F46E5' } }}>
                About the Chapter
              </MuiLink>
              <MuiLink component={Link} to="/admin/login" sx={{ color: '#64748B', fontSize: '0.9rem', '&:hover': { color: '#4F46E5' } }}>
                Admin Portal
              </MuiLink>
            </Box>
          </Box>

          {/* Contact */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A', mb: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Campus Contact
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2 }}>
                <MapPin size={18} color="#64748B" style={{ marginTop: 2, flexShrink: 0 }} />
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  ABES Engineering College, Campus 19th KM Stone, NH-09, Ghaziabad, UP 201009
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <Mail size={18} color="#64748B" style={{ flexShrink: 0 }} />
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  codechef.chapter@abes.ac.in
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            pt: 4,
            borderTop: '1px solid #F1F5F9',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.85rem' }}>
            © {new Date().getFullYear()} CodeChef ABES Chapter. Developed for student excellence.
          </Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.85rem' }}>
            Powered by Supabase & React
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
