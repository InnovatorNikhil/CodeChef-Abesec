import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface RegistrationOverTimeData {
  date: string;
  registrations: number;
}

interface RegistrationByEventData {
  name: string;
  registrations: number;
}

interface DashboardChartsProps {
  timelineData: RegistrationOverTimeData[];
  byEventData: RegistrationByEventData[];
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  timelineData,
  byEventData,
}) => {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3, mb: 4 }}>
      {/* Registrations Over Time */}
      <Card sx={{ p: 2.5, borderRadius: 3.5, border: '1px solid #E2E8F0' }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', fontSize: '1.05rem' }}>
              Registrations Over Time
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              Cumulative daily student signups across all events
            </Typography>
          </Box>
          <Box sx={{ width: '100%', height: 260 }}>
            {timelineData.length === 0 ? (
              <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                <Typography variant="body2">No registration activity recorded yet</Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis
                    dataKey="date"
                    stroke="#94A3B8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#E2E8F0' }}
                  />
                  <YAxis
                    stroke="#94A3B8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#E2E8F0' }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="registrations"
                    stroke="#4F46E5"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#regGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Registrations by Event */}
      <Card sx={{ p: 2.5, borderRadius: 3.5, border: '1px solid #E2E8F0' }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', fontSize: '1.05rem' }}>
              Registrations by Event
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              Participant distribution across current programs
            </Typography>
          </Box>
          <Box sx={{ width: '100%', height: 260 }}>
            {byEventData.length === 0 ? (
              <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                <Typography variant="body2">No event registration data available</Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byEventData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis
                    dataKey="name"
                    stroke="#94A3B8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#E2E8F0' }}
                    tickFormatter={(val) => (val.length > 12 ? `${val.slice(0, 12)}...` : val)}
                  />
                  <YAxis
                    stroke="#94A3B8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#E2E8F0' }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                      fontSize: '12px',
                    }}
                  />
                  <Bar
                    dataKey="registrations"
                    fill="#3B82F6"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
