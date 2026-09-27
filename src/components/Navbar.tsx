import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import { Menu as MenuIcon, X, Code2, Calendar, LayoutDashboard, LogIn, ArrowRight } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Events', path: '/events' },
    { label: 'About', path: '/#about' },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E2E8F0',
        color: '#0F172A',
        zIndex: 1100,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ height: 72, display: 'flex', justifyContent: 'space-between' }}>
          {/* Logo / Chapter Brand */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2.5,
                background: 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)',
              }}
            >
              <Code2 size={22} strokeWidth={2.5} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  color: '#0F172A',
                }}
              >
                CodeChef <span style={{ color: '#4F46E5' }}>ABES</span>
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#64748B',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Campus Chapter
              </Typography>
            </Box>
          </Box>

          {/* Desktop Navigation Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3.5 }}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Typography
                  key={link.label}
                  component={Link}
                  to={link.path}
                  sx={{
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#4F46E5' : '#475569',
                    position: 'relative',
                    transition: 'color 0.2s',
                    '&:hover': {
                      color: '#4F46E5',
                    },
                  }}
                >
                  {link.label}
                </Typography>
              );
            })}
          </Box>

          {/* Right Action Buttons */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate(isAuthenticated ? '/admin/dashboard' : '/admin/login')}
              startIcon={isAuthenticated ? <LayoutDashboard size={16} /> : <LogIn size={16} />}
              sx={{
                borderColor: '#E2E8F0',
                color: '#334155',
                borderRadius: '8px',
                px: 2,
                '&:hover': {
                  borderColor: '#CBD5E1',
                  backgroundColor: '#F8FAFC',
                },
              }}
            >
              {isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}
            </Button>

            <Button
              variant="contained"
              size="small"
              onClick={() => navigate('/events')}
              endIcon={<ArrowRight size={16} />}
              sx={{
                background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
                color: '#FFFFFF',
                borderRadius: '8px',
                px: 2.2,
                fontWeight: 600,
              }}
            >
              Explore Events
            </Button>
          </Box>

          {/* Mobile Hamburger Button */}
          <IconButton
            color="inherit"
            aria-label="open navigation menu"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ display: { xs: 'flex', md: 'none' }, color: '#334155' }}
          >
            {mobileOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </IconButton>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        slotProps={{
          paper: {
            sx: {
              width: 280,
              p: 3,
              backgroundColor: '#FFFFFF',
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
              }}
            >
              <Code2 size={18} />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              CodeChef ABES
            </Typography>
          </Box>
          <IconButton onClick={handleDrawerToggle} size="small">
            <X size={20} />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <List sx={{ px: 0 }}>
          {navLinks.map((link) => (
            <ListItem key={link.label} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                to={link.path}
                onClick={handleDrawerToggle}
                sx={{
                  borderRadius: 2,
                  py: 1,
                  backgroundColor: location.pathname === link.path ? '#EEF2FF' : 'transparent',
                  color: location.pathname === link.path ? '#4F46E5' : '#334155',
                }}
              >
                <ListItemText
                  primary={
                    <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                      {link.label}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 'auto' }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              handleDrawerToggle();
              navigate('/events');
            }}
            startIcon={<Calendar size={18} />}
          >
            Explore Events
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => {
              handleDrawerToggle();
              navigate(isAuthenticated ? '/admin/dashboard' : '/admin/login');
            }}
            startIcon={isAuthenticated ? <LayoutDashboard size={18} /> : <LogIn size={18} />}
          >
            {isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}
          </Button>
        </Box>
      </Drawer>
    </AppBar>
  );
};
