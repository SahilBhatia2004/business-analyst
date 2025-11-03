import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import VisualizationPanel from './VisualizationPanel';
import { AlertCircle } from 'lucide-react';

const SharedDashboard = () => {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState([]);
  const [colorTheme, setColorTheme] = useState({
    background: '#0a0a0a',
    cardBackground: '#1a1a1a',
    border: '#2a2a2a',
    accent: '#22c55e',
    chartColor: '#4ade80',
  });
  const [elementColors, setElementColors] = useState({});
  const [chartCustomizations, setChartCustomizations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSharedDashboard();
  }, [shareId]);

  const loadSharedDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      // Download the shared dashboard file
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('files')
        .download(`shared/${shareId}.json`);

      if (downloadError) throw downloadError;

      const text = await fileData.text();
      const dashboard = JSON.parse(text);

      // Load dashboard data and theme
      if (dashboard.data) {
        setDashboardData(dashboard.data);
      }
      if (dashboard.theme) {
        setColorTheme(dashboard.theme);
      }
      if (dashboard.elementColors) {
        setElementColors(dashboard.elementColors);
      }
      if (dashboard.chartCustomizations) {
        setChartCustomizations(dashboard.chartCustomizations);
      }
    } catch (err) {
      console.error('Error loading shared dashboard:', err);
      setError('Dashboard not found or no longer available.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colorTheme.background }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colorTheme.background }}>
        <div className="text-center max-w-md p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Dashboard Not Found</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colorTheme.background }}>
      {/* Header */}
      <div className="border-b" style={{ borderColor: colorTheme.border }}>
        <div className="p-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Shared Dashboard</h1>
            <p className="text-sm text-gray-400">View-only mode</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Visit AI Analyst
          </button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="p-6">
        <VisualizationPanel
          data={dashboardData}
          colorTheme={colorTheme}
          fullScreen={true}
          elementColors={elementColors}
          chartCustomizations={chartCustomizations}
        />
      </div>
    </div>
  );
};

export default SharedDashboard;
