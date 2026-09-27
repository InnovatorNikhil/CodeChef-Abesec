import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Badge,
  Chip,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  LayoutDashboard,
  Calendar,
  Users,
  LogOut,
  Menu as MenuIcon,
  Bell,
  Code2,
  Globe,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const DRAWER_WIDTH = 260;

export const AdminLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, isDemoMode } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Events', path: '/admin/events', icon: <Calendar size={20} /> },
    { label: 'Registrations', path: '/admin/registrations', icon: <Users size={20} /> },
  ];

  const sidebarContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF' }}>
      {/* Brand Header */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: 2.5,
            background: 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
          }}
        >
          <Code2 size={20} />
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2, color: '#0F172A' }}>
            CodeChef <span style={{ color: '#4F46E5' }}>ABES</span>
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
            Admin Portal
          </Typography>
        </Box>
      </Box>

      {/* Demo Mode / Status Pill */}
      {isDemoMode && (
        <Box sx={{ px: 3, mb: 1 }}>
          <Chip
            icon={<Sparkles size={12} color="#D97706" />}
            label="Local Storage Active"
            size="small"
            sx={{
              backgroundColor: '#FEF3C7',
              color: '#92400E',
              fontWeight: 700,
              fontSize: '0.7rem',
              width: '100%',
              justifyContent: 'flex-start',
            }}
          />
        </Box>
      )}

      {/* Navigation Links */}
      <Box sx={{ px: 2, py: 2 }}>
        <Typography
          variant="caption"
          sx={{
            px: 1.5,
            mb: 1,
            display: 'block',
            fontWeight: 700,
            color: '#94A3B8',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          Main Navigation
        </Typography>
        <List sx={{ p: 0 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
            return (
              <ListItem key={item.label} disablePadding sx={{ mb: 0.8 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  sx={{
                    borderRadius: 2.5,
                    py: 1.2,
                    px: 1.8,
                    backgroundColor: isActive ? '#EEF2FF' : 'transparent',
                    color: isActive ? '#4F46E5' : '#475569',
                    transition: 'all 0.18s ease-in-out',
                    '&:hover': {
                      backgroundColor: isActive ? '#EEF2FF' : '#F8FAFC',
                      color: isActive ? '#4F46E5' : '#0F172A',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 36,
                      color: isActive ? '#4F46E5' : '#64748B',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: isActive ? 700 : 500 }}>
                        {item.label}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Divider sx={{ mx: 2, my: 1, borderColor: '#F1F5F9' }} />

      {/* Secondary Links & Public Website */}
      <Box sx={{ px: 2 }}>
        <List sx={{ p: 0 }}>
          <ListItem disablePadding sx={{ mb: 0.8 }}>
            <ListItemButton
              component={Link}
              to="/"
              sx={{
                borderRadius: 2.5,
                py: 1,
                px: 1.8,
                color: '#475569',
                '&:hover': { backgroundColor: '#F8FAFC', color: '#0F172A' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: '#64748B' }}>
                <Globe size={18} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                    Public Site
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      {/* Bottom User Profile & Logout */}
      <Box sx={{ mt: 'auto', p: 2, borderTop: '1px solid #F1F5F9' }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2.5,
            backgroundColor: '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid #E2E8F0',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, overflow: 'hidden' }}>
            <Avatar
              sx={{
                width: 34,
                height: 34,
                backgroundColor: '#4F46E5',
                fontSize: '0.85rem',
                fontWeight: 700,
              }}
            >
              {(user?.email?.[0] || 'A').toUpperCase()}
            </Avatar>
            <Box sx={{ overflow: 'hidden' }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: '#0F172A',
                  fontSize: '0.8rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.email || 'Chapter Admin'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '0.7rem' }}>
                Club Moderator
              </Typography>
            </Box>
          </Box>

          <Tooltip title="Log out">
            <IconButton size="small" onClick={handleLogout} sx={{ color: '#64748B', '&:hover': { color: '#EF4444' } }}>
              <LogOut size={16} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      {/* Top Bar for Desktop and Mobile */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #E2E8F0',
          color: '#0F172A',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon size={22} />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155' }}>
              College Event Management
            </Typography>
          </Box>

          {/* Right Header Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Notifications">
              <IconButton size="small" sx={{ color: '#64748B', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <Badge color="primary" variant="dot">
                  <Bell size={18} />
                </Badge>
              </IconButton>
            </Tooltip>

            <Box
              onClick={(e) => setProfileAnchor(e.currentTarget)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                p: 0.5,
                borderRadius: 2,
                '&:hover': { backgroundColor: '#F1F5F9' },
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: '#4F46E5',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                }}
              >
                {(user?.email?.[0] || 'A').toUpperCase()}
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#0F172A', lineHeight: 1.1 }}>
                  Admin
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.7rem' }}>
                  Lead
                </Typography>
              </Box>
              <ChevronDown size={14} color="#64748B" />
            </Box>

            <Menu
              anchorEl={profileAnchor}
              open={Boolean(profileAnchor)}
              onClose={() => setProfileAnchor(null)}
              slotProps={{ paper: { sx: { borderRadius: 2.5, minWidth: 160, mt: 1 } } }}
            >
              <MenuItem onClick={() => { setProfileAnchor(null); navigate('/'); }}>
                <Globe size={16} style={{ marginRight: 8 }} /> Public Site
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => { setProfileAnchor(null); handleLogout(); }} sx={{ color: '#EF4444' }}>
                <LogOut size={16} style={{ marginRight: 8 }} /> Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, borderRight: '1px solid #E2E8F0' },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Desktop Persistent Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, borderRight: '1px solid #E2E8F0' },
        }}
        open
      >
        {sidebarContent}
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2.5, sm: 3.5, md: 4 },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: 8,
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: '#F8FAFC',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};
