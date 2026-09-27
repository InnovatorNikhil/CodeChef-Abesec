import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { Lock, Mail, Code2, ArrowLeft, Shield } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signIn, isAuthenticated, isDemoMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please provide both admin email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signIn(email.trim(), password);
      if (res.error) {
        setError(res.error);
      } else {
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@abes.ac.in');
    setPassword('admin123');
    setError(null);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC',
        p: 2.5,
      }}
    >
      <Container maxWidth="xs">
        <Box sx={{ mb: 3 }}>
          <Button
            component={Link}
            to="/"
            startIcon={<ArrowLeft size={16} />}
            sx={{ color: '#64748B', fontWeight: 600 }}
          >
            Back to Public Site
          </Button>
        </Box>

        <Card
          sx={{
            p: { xs: 3.5, sm: 4.5 },
            borderRadius: 4,
            border: '1px solid #E2E8F0',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
            backgroundColor: '#FFFFFF',
          }}
        >
          {/* Brand header */}
          <Box sx={{ textAlign: 'center', mb: 3.5 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
              }}
            >
              <Code2 size={26} strokeWidth={2.5} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5 }}>
              Admin Sign In
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B' }}>
              ABES CodeChef Chapter Event Portal
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mb: 3 }}>
              <TextField
                fullWidth
                label="Admin Email"
                type="email"
                placeholder="admin@abes.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                slotProps={{
                  input: {
                    startAdornment: (
                      <Mail size={18} color="#94A3B8" style={{ marginRight: 8 }} />
                    ),
                  },
                }}
                required
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                slotProps={{
                  input: {
                    startAdornment: (
                      <Lock size={18} color="#94A3B8" style={{ marginRight: 8 }} />
                    ),
                  },
                }}
                required
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={isSubmitting}
              sx={{
                py: 1.3,
                fontWeight: 700,
                fontSize: '0.95rem',
                borderRadius: 2.5,
              }}
            >
              {isSubmitting ? <CircularProgress size={24} sx={{ color: '#FFFFFF' }} /> : 'Sign In'}
            </Button>
          </Box>

          {/* Demo Mode Quick Access for Evaluator */}
          <Divider sx={{ my: 3 }} />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 1 }}>
              {isDemoMode ? 'Evaluation Demo Credentials:' : 'Supabase Auth Enabled'}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={handleFillDemo}
              startIcon={<Shield size={14} />}
              sx={{
                fontSize: '0.75rem',
                borderColor: '#E2E8F0',
                color: '#4F46E5',
                borderRadius: 2,
              }}
            >
              Fill Demo Admin Credentials
            </Button>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};
