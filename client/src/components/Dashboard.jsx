// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
// Note: You'll need to install recharts: npm install recharts
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

function Dashboard({ userId }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real app, fetch from API endpoint
        // Mock data for demonstration
        const mockStats = {
          totalClicks: 1427,
          clickGrowth: 12.5,
          impressions: 34982,
          impressionGrowth: 8.3,
          ctr: 4.2,
          ctrChange: -0.3,
          trafficByDay: [
            { day: 'Mon', clicks: 210, impressions: 4980 },
            { day: 'Tue', clicks: 198, impressions: 4720 },
            { day: 'Wed', clicks: 245, impressions: 5620 },
            { day: 'Thu', clicks: 230, impressions: 5340 },
            { day: 'Fri', clicks: 215, impressions: 5100 },
            { day: 'Sat', clicks: 178, impressions: 4580 },
            { day: 'Sun', clicks: 151, impressions: 4642 }
          ],
          trafficSources: [
            { source: 'Direct', visits: 450 },
            { source: 'Search', visits: 380 },
            { source: 'Social', visits: 290 },
            { source: 'Referral', visits: 210 },
            { source: 'Email', visits: 97 }
          ],
          campaigns: [
            { id: 1, name: 'Summer Sale', clicks: 523, impressions: 12450, ctr: 4.2, status: 'Active' },
            { id: 2, name: 'New Product Launch', clicks: 398, impressions: 9230, ctr: 4.3, status: 'Active' },
            { id: 3, name: 'Brand Awareness', clicks: 287, impressions: 7640, ctr: 3.8, status: 'Paused' },
            { id: 4, name: 'Holiday Special', clicks: 219, impressions: 5662, ctr: 3.9, status: 'Scheduled' }
          ]
        };
        
        setStats(mockStats);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [userId]);
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        padding: '2rem' 
      }}>
        Loading dashboard data...
      </div>
    );
  }
  
  if (!stats) {
    return <div style={{ padding: '2rem' }}>No data available.</div>;
  }
  
  const tabStyle = (tab) => ({
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    borderBottom: activeTab === tab ? '2px solid #3b82f6' : 'none',
    color: activeTab === tab ? '#3b82f6' : '#4b5563'
  });
  
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      padding: '1.5rem'
    }}>
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #e5e7eb',
        marginBottom: '1.5rem'
      }}>
        <button
          style={tabStyle('overview')}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          style={tabStyle('traffic')}
          onClick={() => setActiveTab('traffic')}
        >
          Traffic Sources
        </button>
        <button
          style={tabStyle('campaigns')}
          onClick={() => setActiveTab('campaigns')}
        >
          Campaigns
        </button>
      </div>
      
      {activeTab === 'overview' && (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              padding: '1rem',
              backgroundColor: '#eff6ff',
              borderRadius: '0.5rem'
            }}>
              <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Total Clicks</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalClicks}</p>
              <p style={{ fontSize: '0.75rem', color: '#16a34a' }}>+{stats.clickGrowth}% from last month</p>
            </div>
            <div style={{
              padding: '1rem',
              backgroundColor: '#f5f3ff',
              borderRadius: '0.5rem'
            }}>
              <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Impressions</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.impressions}</p>
              <p style={{ fontSize: '0.75rem', color: '#16a34a' }}>+{stats.impressionGrowth}% from last month</p>
            </div>
            <div style={{
              padding: '1rem',
              backgroundColor: '#ecfdf5',
              borderRadius: '0.5rem'
            }}>
              <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>CTR</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.ctr}%</p>
              <p style={{ fontSize: '0.75rem', color: '#dc2626' }}>{stats.ctrChange}% from last month</p>
            </div>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              marginBottom: '1rem'
            }}>Traffic Overview</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.trafficByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="clicks" stroke="#3b82f6" />
                  <Line type="monotone" dataKey="impressions" stroke="#8b5cf6" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
      
      {activeTab === 'traffic' && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            marginBottom: '1rem'
          }}>Traffic Sources</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.trafficSources}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="source" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="visits" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
      {activeTab === 'campaigns' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                  Campaign
                </th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                  Clicks
                </th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                  Impressions
                </th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                  CTR
                </th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.campaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb', fontWeight: '500' }}>
                    {campaign.name}
                  </td>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>
                    {campaign.clicks}
                  </td>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>
                    {campaign.impressions}
                  </td>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>
                    {campaign.ctr}%
                  </td>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      borderRadius: '9999px',
                      backgroundColor: campaign.status === 'Active' ? '#dcfce7' : '#fef9c3',
                      color: campaign.status === 'Active' ? '#166534' : '#854d0e'
                    }}>
                      {campaign.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;