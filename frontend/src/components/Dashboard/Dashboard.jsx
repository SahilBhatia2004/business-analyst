import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../config/supabase';
import Chatbot from './Chatbot';
import ChatHistory from './ChatHistory';
import VisualizationPanel from './VisualizationPanel';
import Header from './Header';
import UploadModal from './UploadModal';
import ColorGrid from './ColorGrid';
import DashboardHistory from './DashboardHistory';
import { LogOut, Upload, Palette, Save, Presentation, Trash2, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';

const Dashboard = () => {
  const dashboardRef = useRef(null);
  const [user, setUser] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showColorGrid, setShowColorGrid] = useState(false);
  const [dashboardData, setDashboardData] = useState([]);
  const [presentationMode, setPresentationMode] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [currentDashboardId, setCurrentDashboardId] = useState(null);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI Analyst. Upload your data files and ask me questions in numbered format. For example:\n\n1. Show total sales by month (bar chart)\n2. Display revenue distribution by category (pie chart)\n3. Analyze top 10 products by revenue (table)',
    },
  ]);
  const [colorTheme, setColorTheme] = useState({
    background: '#0a0a0a',
    cardBackground: '#1a1a1a',
    border: '#2a2a2a',
    accent: '#22c55e',
    chartColor: '#4ade80',
  });
  const [savedTheme, setSavedTheme] = useState(null);
  const [elementColors, setElementColors] = useState({});
  const [chartCustomizations, setChartCustomizations] = useState({});

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        loadUserFiles(user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserFiles(session.user.id);
      } else {
        setUploadedFiles([]);
        setDashboardData([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserFiles = async (userId) => {
    try {
      setLoadingFiles(true);
      
      // List all files in the user's folder
      const { data: files, error } = await supabase.storage
        .from('files')
        .list(userId, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (error) throw error;

      // Filter out non-data files (exclude dashboard files)
      const dataFiles = files.filter(file => 
        file.name.endsWith('.csv') || 
        file.name.endsWith('.xlsx') || 
        file.name.endsWith('.xls')
      );

      // Format files to match the expected structure
      const formattedFiles = dataFiles.map(file => ({
        name: file.name.split('_').slice(1).join('_'), // Remove timestamp prefix
        path: `${userId}/${file.name}`,
        size: file.metadata?.size || 0,
        type: file.metadata?.mimetype || 'application/octet-stream',
      }));

      setUploadedFiles(formattedFiles);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleLoadDashboard = (dashboard, dashboardId) => {
    // Restore dashboard data and theme
    if (dashboard.data) {
      setDashboardData(dashboard.data);
    }
    if (dashboard.theme) {
      setColorTheme(dashboard.theme);
      setSavedTheme(dashboard.theme); // Save the loaded theme
    }
    // Restore element colors and chart customizations
    if (dashboard.elementColors) {
      setElementColors(dashboard.elementColors);
    }
    if (dashboard.chartCustomizations) {
      setChartCustomizations(dashboard.chartCustomizations);
    }
    // Restore associated chat if exists
    if (dashboard.chatMessages) {
      setChatMessages(dashboard.chatMessages);
    }
    if (dashboard.chatId) {
      setCurrentChatId(dashboard.chatId);
    }
    setCurrentDashboardId(dashboardId);
    console.log('Dashboard loaded successfully');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleFileUpload = (files) => {
    setUploadedFiles([...uploadedFiles, ...files]);
    setShowUploadModal(false);
  };

  const handleDeleteFile = async (filePath) => {
    try {
      const { error } = await supabase.storage
        .from('files')
        .remove([filePath]);

      if (error) throw error;

      // Remove from state
      setUploadedFiles(uploadedFiles.filter(f => f.path !== filePath));
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file: ' + error.message);
    }
  };

  const handleSaveDashboard = async () => {
    try {
      const dashboardJson = JSON.stringify({
        data: dashboardData,
        theme: colorTheme,
        elementColors: elementColors,
        chartCustomizations: chartCustomizations,
        chatMessages: chatMessages,
        chatId: currentChatId,
        timestamp: new Date().toISOString(),
      });

      const fileName = `dashboard_${Date.now()}.json`;
      const blob = new Blob([dashboardJson], { type: 'application/json' });

      // Upload new dashboard (don't delete old ones)
      const { data, error } = await supabase.storage
        .from('files')
        .upload(`dashboards/${user.id}/${fileName}`, blob);

      if (error) throw error;

      setCurrentDashboardId(`dashboards/${user.id}/${fileName}`);
      setSavedTheme(colorTheme); // Save the current theme
      alert('Dashboard saved successfully!');
      
      // Trigger refresh of dashboard history
      window.dispatchEvent(new Event('dashboardSaved'));
    } catch (error) {
      console.error('Error saving dashboard:', error);
      alert('Failed to save dashboard');
    }
  };

  const addVisualization = (visualization) => {
    setDashboardData(prev => [...prev, visualization]);
  };

  const handleDeleteVisualization = (visualizationId) => {
    if (window.confirm('Delete this visualization?')) {
      setDashboardData(prev => prev.filter(item => item.id !== visualizationId));
    }
  };

  const handleClearDashboard = () => {
    if (!window.confirm('Clear current dashboard? This will not delete saved dashboards.')) {
      return;
    }
    setDashboardData([]);
    setCurrentDashboardId(null);
  };

  const handleLoadChat = (chat, chatId) => {
    if (chat.messages && chat.messages.length > 0) {
      setChatMessages(chat.messages);
    }
    setCurrentChatId(chatId);
    // Restore associated dashboard if exists
    if (chat.dashboardData) {
      setDashboardData(chat.dashboardData);
    } else {
      setDashboardData([]);
    }
    if (chat.theme) {
      setColorTheme(chat.theme);
    }
    if (chat.dashboardId) {
      setCurrentDashboardId(chat.dashboardId);
    }
  };

  const handleNewChat = () => {
    setChatMessages([
      {
        role: 'assistant',
        content: 'Hello! I\'m your AI Analyst. Upload your data files and ask me questions in numbered format. For example:\n\n1. Show total sales by month (bar chart)\n2. Display revenue distribution by category (pie chart)\n3. Analyze top 10 products by revenue (table)',
      },
    ]);
    setCurrentChatId(null);
    setDashboardData([]);
    setCurrentDashboardId(null);
  };

  const handleExitPresentation = async () => {
    // Auto-save before exiting presentation mode
    if (currentDashboardId) {
      try {
        const dashboardJson = JSON.stringify({
          data: dashboardData,
          theme: colorTheme,
          elementColors: elementColors,
          chartCustomizations: chartCustomizations,
          chatMessages: chatMessages,
          chatId: currentChatId,
          timestamp: new Date().toISOString(),
        });

        const blob = new Blob([dashboardJson], { type: 'application/json' });

        // Update existing dashboard
        const { error } = await supabase.storage
          .from('files')
          .update(currentDashboardId, blob, {
            upsert: true
          });

        if (error) {
          // If update fails, try upload
          const fileName = currentDashboardId.split('/').pop();
          await supabase.storage
            .from('files')
            .upload(currentDashboardId, blob, {
              upsert: true
            });
        }

        console.log('Dashboard auto-saved on presentation exit');
      } catch (error) {
        console.error('Error auto-saving dashboard:', error);
      }
    }
    
    setPresentationMode(false);
  };

  const handleShareDashboard = async () => {
    try {
      // Create a unique share ID
      const shareId = `${user.id}_${Date.now()}`;
      
      // Prepare dashboard data for sharing
      const dashboardJson = JSON.stringify({
        data: dashboardData,
        theme: colorTheme,
        elementColors: elementColors,
        chartCustomizations: chartCustomizations,
        timestamp: new Date().toISOString(),
      });

      const blob = new Blob([dashboardJson], { type: 'application/json' });

      // Upload to shared folder in Supabase storage
      const { data, error } = await supabase.storage
        .from('files')
        .upload(`shared/${shareId}.json`, blob, {
          contentType: 'application/json',
          upsert: false
        });

      if (error) throw error;

      // Generate shareable link
      const shareUrl = `${window.location.origin}/shared/${shareId}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      
      alert(`Shareable link copied to clipboard!\n\n${shareUrl}\n\nAnyone with this link can view your dashboard in presentation mode.`);
    } catch (error) {
      console.error('Error sharing dashboard:', error);
      alert('Failed to create shareable link. Please try again.');
    }
  };

  if (presentationMode) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: colorTheme.background }}>
        <button
          onClick={handleExitPresentation}
          className="fixed top-4 right-4 z-50 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Exit Presentation
        </button>
        <VisualizationPanel
          data={dashboardData}
          colorTheme={colorTheme}
          fullScreen={true}
          elementColors={elementColors}
          chartCustomizations={chartCustomizations}
          onElementColorsChange={setElementColors}
          onChartCustomizationsChange={setChartCustomizations}
          onDeleteVisualization={handleDeleteVisualization}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colorTheme.background }}>
      {/* Header */}
      <Header user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Chat History Sidebar */}
        <div className="w-64 border-r" style={{ borderColor: colorTheme.border }}>
          <ChatHistory
            userId={user?.id}
            onLoadChat={handleLoadChat}
            onNewChat={handleNewChat}
            currentChatId={currentChatId}
            colorTheme={colorTheme}
          />
        </div>

        {/* Middle - Chatbot */}
        <div className="w-1/3 border-r" style={{ borderColor: colorTheme.border }}>
          <Chatbot
            uploadedFiles={uploadedFiles}
            onVisualizationGenerated={addVisualization}
            colorTheme={colorTheme}
            onDeleteFile={handleDeleteFile}
            loadingFiles={loadingFiles}
            userId={user?.id}
            currentChatId={currentChatId}
            onChatIdChange={setCurrentChatId}
            messages={chatMessages}
            onMessagesChange={setChatMessages}
            dashboardData={dashboardData}
            currentDashboardId={currentDashboardId}
          />
        </div>

        {/* Right Side - Dashboard */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: colorTheme.border }}>
            <h2 className="text-xl font-semibold text-white">Dashboard</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload Data
              </button>
              <button
                onClick={() => setShowColorGrid(!showColorGrid)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <Palette className="w-4 h-4" />
                Colors
              </button>
              {dashboardData.length > 0 && (
                <>
                  <button
                    onClick={handleSaveDashboard}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={handleShareDashboard}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    title="Generate shareable link"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                  <button
                    onClick={handleClearDashboard}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    title="Clear current dashboard"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </button>
                  <button
                    onClick={() => setPresentationMode(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <Presentation className="w-4 h-4" />
                    Present
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Dashboard History */}
          <DashboardHistory
            userId={user?.id}
            onLoadDashboard={handleLoadDashboard}
            colorTheme={colorTheme}
            currentDashboardId={currentDashboardId}
          />

          {/* Color Grid */}
          {showColorGrid && (
            <ColorGrid
              currentTheme={colorTheme}
              onThemeChange={setColorTheme}
              onClose={() => setShowColorGrid(false)}
            />
          )}

          {/* Visualization Area */}
          <div className="flex-1 overflow-auto" ref={dashboardRef}>
            <VisualizationPanel
              data={dashboardData}
              colorTheme={colorTheme}
              elementColors={elementColors}
              chartCustomizations={chartCustomizations}
              onElementColorsChange={setElementColors}
              onChartCustomizationsChange={setChartCustomizations}
              onDeleteVisualization={handleDeleteVisualization}
            />
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleFileUpload}
          userId={user?.id}
        />
      )}
    </div>
  );
};

export default Dashboard;
