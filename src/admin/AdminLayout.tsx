import React, { useState, useEffect } from 'react';
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
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const EXPANDED_WIDTH = 260;
const COLLAPSED_WIDTH = 80;

export const AdminLayout: React.FC = () => {
  // Persisted desktop sidebar collapse state
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('adminSidebarCollapsed') === 'true';
    } catch {
      return false;
    }
  });

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, isDemoMode } = useAuth();

  useEffect(() => {
    try {
      localStorage.setItem('adminSidebarCollapsed', String(sidebarCollapsed));
    } catch {
      // ignore
    }
  }, [sidebarCollapsed]);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleToggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
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

  const currentDesktopWidth = sidebarCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  // Sidebar contents for desktop (supports both expanded and collapsed modes)
  const renderDesktopSidebarContent = () => (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        overflowX: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Brand Header */}
      <Box
        sx={{
          p: sidebarCollapsed ? 2 : 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarCollapsed ? 'center' : 'space-between',
          minHeight: 70,
          borderBottom: '1px solid #F1F5F9',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden' }}>
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
              flexShrink: 0,
            }}
          >
            <Code2 size={20} />
          </Box>
          {!sidebarCollapsed && (
            <Box sx={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2, color: '#0F172A' }}>
                CodeChef <span style={{ color: '#4F46E5' }}>ABES</span>
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                Admin Portal
              </Typography>
            </Box>
          )}
        </Box>

        {/* Collapse toggle button on sidebar header */}
        {!sidebarCollapsed && (
          <Tooltip title="Collapse sidebar (80px)">
            <IconButton size="small" onClick={handleToggleSidebar} sx={{ color: '#64748B' }}>
              <ChevronLeft size={18} />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Demo Mode / Status Pill */}
      {isDemoMode && !sidebarCollapsed && (
        <Box sx={{ px: 2.5, mt: 1.5 }}>
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
      <Box sx={{ px: sidebarCollapsed ? 1 : 2, py: 2 }}>
        {!sidebarCollapsed && (
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
              whiteSpace: 'nowrap',
            }}
          >
            Main Navigation
          </Typography>
        )}
        <List sx={{ p: 0 }}>
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));

            const button = (
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  borderRadius: 2.5,
                  py: 1.2,
                  px: sidebarCollapsed ? 0 : 1.8,
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
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
                    minWidth: sidebarCollapsed ? 0 : 36,
                    justifyContent: 'center',
                    color: isActive ? '#4F46E5' : '#64748B',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!sidebarCollapsed && (
                  <ListItemText
                    primary={
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: isActive ? 700 : 500, whiteSpace: 'nowrap' }}>
                        {item.label}
                      </Typography>
                    }
                  />
                )}
              </ListItemButton>
            );

            return (
              <ListItem key={item.label} disablePadding sx={{ mb: 0.8 }}>
                {sidebarCollapsed ? (
                  <Tooltip title={item.label} placement="right" arrow>
                    <Box sx={{ width: '100%' }}>{button}</Box>
                  </Tooltip>
                ) : (
                  button
                )}
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Divider sx={{ mx: 2, my: 1, borderColor: '#F1F5F9' }} />

      {/* Secondary Links & Public Site */}
      <Box sx={{ px: sidebarCollapsed ? 1 : 2 }}>
        <List sx={{ p: 0 }}>
          <ListItem disablePadding sx={{ mb: 0.8 }}>
            {sidebarCollapsed ? (
              <Tooltip title="Public Site" placement="right" arrow>
                <ListItemButton
                  component={Link}
                  to="/"
                  sx={{
                    borderRadius: 2.5,
                    py: 1,
                    px: 0,
                    justifyContent: 'center',
                    color: '#475569',
                    '&:hover': { backgroundColor: '#F8FAFC', color: '#0F172A' },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', color: '#64748B' }}>
                    <Globe size={18} />
                  </ListItemIcon>
                </ListItemButton>
              </Tooltip>
            ) : (
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
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, whiteSpace: 'nowrap' }}>
                      Public Site
                    </Typography>
                  }
                />
              </ListItemButton>
            )}
          </ListItem>
        </List>
      </Box>

      {/* Bottom Profile / Collapse Bar */}
      <Box sx={{ mt: 'auto', p: sidebarCollapsed ? 1 : 2, borderTop: '1px solid #F1F5F9' }}>
        {sidebarCollapsed ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
            <Tooltip title="Expand sidebar (260px)" placement="right" arrow>
              <IconButton size="small" onClick={handleToggleSidebar} sx={{ color: '#4F46E5', backgroundColor: '#EEF2FF' }}>
                <ChevronRight size={18} />
              </IconButton>
            </Tooltip>
            <Tooltip title={`Signed in as ${user?.email || 'Admin'}`} placement="right" arrow>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: '#4F46E5',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
                onClick={(e) => setProfileAnchor(e.currentTarget)}
              >
                {(user?.email?.[0] || 'A').toUpperCase()}
              </Avatar>
            </Tooltip>
          </Box>
        ) : (
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
                  flexShrink: 0,
                }}
              >
                {(user?.email?.[0] || 'A').toUpperCase()}
              </Avatar>
              <Box sx={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: '#0F172A',
                    fontSize: '0.8rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
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
        )}
      </Box>
    </Box>
  );

  // Mobile Drawer Content (always expanded with labels)
  const renderMobileDrawerContent = () => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF', p: 2 }}>
      <Box sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
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
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A' }}>
            CodeChef ABES
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
            Admin Portal
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ mb: 2 }} />

      <List sx={{ p: 0 }}>
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
          return (
            <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  backgroundColor: isActive ? '#EEF2FF' : 'transparent',
                  color: isActive ? '#4F46E5' : '#475569',
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: isActive ? '#4F46E5' : '#64748B' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: '0.95rem', fontWeight: isActive ? 700 : 500 }}>
                      {item.label}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ my: 2 }} />

      <List sx={{ p: 0 }}>
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            component={Link}
            to="/"
            onClick={() => setMobileOpen(false)}
            sx={{ borderRadius: 2, py: 1 }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: '#64748B' }}>
              <Globe size={18} />
            </ListItemIcon>
            <ListItemText primary={<Typography sx={{ fontSize: '0.9rem' }}>Public Site</Typography>} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              setMobileOpen(false);
              handleLogout();
            }}
            sx={{ borderRadius: 2, py: 1, color: '#EF4444' }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: '#EF4444' }}>
              <LogOut size={18} />
            </ListItemIcon>
            <ListItemText primary={<Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>Logout</Typography>} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100%',
        overflowX: 'hidden',
        backgroundColor: '#F8FAFC',
        boxSizing: 'border-box',
      }}
    >
      {/* 1. Desktop Fixed Sidebar */}
      <Box
        component="aside"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: `${currentDesktopWidth}px`,
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1100,
          borderRight: '1px solid #E2E8F0',
          transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          boxSizing: 'border-box',
        }}
      >
        {renderDesktopSidebarContent()}
      </Box>

      {/* 2. Mobile Drawer (Overlay) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        slotProps={{
          paper: {
            sx: {
              width: EXPANDED_WIDTH,
              boxSizing: 'border-box',
              borderRight: '1px solid #E2E8F0',
            },
          },
        }}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        {renderMobileDrawerContent()}
      </Drawer>

      {/* 3. Main Wrapper (TopBar + Main Content) */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          width: { xs: '100%', md: `calc(100% - ${currentDesktopWidth}px)` },
          ml: { xs: 0, md: `${currentDesktopWidth}px` },
          transition: 'margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1), width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          boxSizing: 'border-box',
        }}
      >
        {/* Sticky Topbar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            top: 0,
            zIndex: 1000,
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            borderBottom: '1px solid #E2E8F0',
            color: '#0F172A',
            boxSizing: 'border-box',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
            {/* Left Controls: Hamburger on mobile / Collapse Toggle on Desktop */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {/* Mobile Hamburger */}
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                aria-label="open mobile navigation drawer"
                sx={{ display: { md: 'none' }, color: '#334155' }}
              >
                <MenuIcon size={22} />
              </IconButton>

              {/* Desktop Toggle Button */}
              <Tooltip title={sidebarCollapsed ? 'Expand sidebar (260px)' : 'Collapse sidebar (80px)'}>
                <IconButton
                  onClick={handleToggleSidebar}
                  aria-label="toggle desktop sidebar"
                  sx={{
                    display: { xs: 'none', md: 'inline-flex' },
                    color: '#475569',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    '&:hover': { backgroundColor: '#F1F5F9', color: '#4F46E5' },
                  }}
                  size="small"
                >
                  <MenuIcon size={18} />
                </IconButton>
              </Tooltip>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    color: '#334155',
                    fontSize: { xs: '0.85rem', sm: '0.95rem' },
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  CodeChef ABES • Event Management
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    color: '#334155',
                    fontSize: '0.85rem',
                    display: { xs: 'block', sm: 'none' },
                  }}
                >
                  Event Portal
                </Typography>
              </Box>
            </Box>

            {/* Right Controls: Notifications & Profile */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
              <Tooltip title="Notifications">
                <IconButton
                  size="small"
                  sx={{
                    color: '#64748B',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    width: 34,
                    height: 34,
                  }}
                >
                  <Badge color="primary" variant="dot">
                    <Bell size={16} />
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
                <MenuItem
                  onClick={() => {
                    setProfileAnchor(null);
                    navigate('/');
                  }}
                >
                  <Globe size={16} style={{ marginRight: 8 }} /> Public Site
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => {
                    setProfileAnchor(null);
                    handleLogout();
                  }}
                  sx={{ color: '#EF4444' }}
                >
                  <LogOut size={16} style={{ marginRight: 8 }} /> Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content Viewport */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: '100%',
            maxWidth: '100%',
            minWidth: 0,
            p: { xs: 2, sm: 3, md: 4 },
            boxSizing: 'border-box',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
