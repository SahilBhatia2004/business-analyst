import React, { useState, useRef, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { BarChart3, PieChart, LineChart, Table, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import ElementColorPicker from './ElementColorPicker';
import ChartCustomizer from './ChartCustomizer';

const VisualizationPanel = ({ 
  data, 
  colorTheme, 
  fullScreen = false, 
  onDataUpdate,
  elementColors = {},
  chartCustomizations = {},
  onElementColorsChange,
  onChartCustomizationsChange,
  onDeleteVisualization
}) => {
  const [colorPicker, setColorPicker] = useState(null);
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-500">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No visualizations yet</p>
          <p className="text-sm">Start asking questions in the chatbot</p>
        </div>
      </div>
    );
  }

  const getChartIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'pie chart':
      case 'pie':
        return <PieChart className="w-5 h-5" />;
      case 'line chart':
      case 'line':
        return <LineChart className="w-5 h-5" />;
      case 'table':
        return <Table className="w-5 h-5" />;
      default:
        return <BarChart3 className="w-5 h-5" />;
    }
  };

  const handleChartClick = (event, chartId) => {
    if (event.points && event.points.length > 0) {
      const point = event.points[0];
      const pointIndex = point.pointIndex;
      
      setColorPicker({
        chartId,
        pointIndex,
        x: event.event.clientX,
        y: event.event.clientY,
      });
    }
  };

  const handleTableCellClick = (event, chartId, rowIndex, colIndex) => {
    setColorPicker({
      chartId,
      pointIndex: `${rowIndex}-${colIndex}`,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleColorSelect = (color) => {
    if (!colorPicker) return;
    
    const key = `${colorPicker.chartId}-${colorPicker.pointIndex}`;
    if (onElementColorsChange) {
      onElementColorsChange({
        ...elementColors,
        [key]: color,
      });
    }
    
    setColorPicker(null);
  };

  const handleCustomizationUpdate = (chartId, customization) => {
    if (onChartCustomizationsChange) {
      onChartCustomizationsChange({
        ...chartCustomizations,
        [chartId]: customization,
      });
    }
  };

  const renderVisualization = (item) => {
    // Debug: Log the item structure
    console.log('Rendering visualization:', item);
    
    const customization = chartCustomizations[item.id] || {};
    const chartHeight = customization.height || 300;
    
    const plotLayout = {
      paper_bgcolor: '#2a2a2a',
      plot_bgcolor: '#2a2a2a',
      font: { color: '#ffffff' },
      margin: { 
        t: 40, 
        r: 20, 
        b: 40 + (customization.xAxisOffset || 0), 
        l: 60 + (customization.yAxisOffset || 0) 
      },
      showlegend: true,
      legend: {
        font: { color: '#ffffff' },
        bgcolor: 'rgba(42, 42, 42, 0.8)',
      },
      xaxis: {
        gridcolor: '#3a3a3a',
        zerolinecolor: '#3a3a3a',
        tickangle: customization.xAxisRotation || 0,
      },
      yaxis: {
        gridcolor: '#3a3a3a',
        zerolinecolor: '#3a3a3a',
        tickangle: customization.yAxisRotation || 0,
      },
      height: chartHeight,
    };

    const plotConfig = {
      displayModeBar: true,
      displaylogo: false,
      responsive: true,
    };

    // Handle table type
    if (item.data.type === 'table' || item.type.toLowerCase().includes('table')) {
      // item.data = {type: 'table', data: {columns: [...], rows: [...]}}
      const tableData = item.data.data || item.data;
      
      console.log('Table data:', tableData);
      console.log('Columns:', tableData.columns);
      console.log('Rows:', tableData.rows);
      
      return (
        <div className="overflow-auto max-h-96">
          <table className="w-full text-sm">
            <thead className="bg-gray-700 sticky top-0">
              <tr>
                {tableData.columns?.map((col, i) => (
                  <th key={i} className="px-4 py-2 text-left text-white font-semibold">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.rows?.map((row, i) => (
                <tr key={i} className="border-b border-gray-700 hover:bg-gray-800">
                  {row.map((cell, j) => {
                    const cellKey = `${item.id}-${i}-${j}`;
                    const cellColor = elementColors[cellKey];
                    return (
                      <td 
                        key={j} 
                        className="px-4 py-2 text-gray-300 cursor-pointer transition-colors"
                        style={cellColor ? { backgroundColor: cellColor, color: '#ffffff' } : {}}
                        onClick={(e) => handleTableCellClick(e, item.id, i, j)}
                      >
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Handle chart types (bar, pie, line, scatter)
    // Backend returns: { type: 'pie', data: {...}, layout: {...} }
    const chartType = item.data.type;
    const chartData = item.data.data || {};
    const chartLayout = item.data.layout || {};
    
    console.log('Chart type from backend:', chartType);
    console.log('Chart data:', chartData);
    
    // Convert the data structure to Plotly format
    let plotlyData = [];
    
    if (chartType) {
      // New format from backend
      const plotlyType = chartType === 'line' ? 'scatter' : chartType;
      
      // Apply theme color to chart
      const themedData = { ...chartData };
      
      // Apply individual element colors if they exist
      if (chartType === 'pie') {
        // Pie charts use labels/values and marker.colors (plural)
        const dataLength = themedData.labels?.length || themedData.values?.length || 0;
        if (dataLength > 0) {
          const colors = [];
          for (let i = 0; i < dataLength; i++) {
            const key = `${item.id}-${i}`;
            colors.push(elementColors[key] || (themedData.marker?.colors?.[i] || colorTheme.chartColor));
          }
          
          if (themedData.marker) {
            themedData.marker = { ...themedData.marker, colors: colors };
          } else {
            themedData.marker = { colors: colors };
          }
        }
      } else if (themedData.x && themedData.y) {
        // Bar, line, scatter charts use x/y and marker.color (singular for array)
        const colors = [];
        for (let i = 0; i < themedData.x.length; i++) {
          const key = `${item.id}-${i}`;
          colors.push(elementColors[key] || colorTheme.chartColor);
        }
        
        if (themedData.marker) {
          themedData.marker = { ...themedData.marker, color: colors };
        } else {
          themedData.marker = { color: colors };
        }
      } else if (themedData.marker && colorTheme.chartColor) {
        themedData.marker = { ...themedData.marker, color: colorTheme.chartColor };
      }
      
      if (themedData.line && colorTheme.chartColor) {
        themedData.line = { ...themedData.line, color: colorTheme.chartColor };
      }
      
      plotlyData = [{
        ...themedData,
        type: plotlyType
      }];
      console.log('Generated Plotly data:', plotlyData);
    } else if (item.data.traces) {
      // Old format (for backward compatibility)
      plotlyData = item.data.traces;
    } else {
      // Fallback: assume the entire item.data is the chart data
      plotlyData = [item.data];
    }

    return (
      <Plot
        data={plotlyData}
        layout={{
          ...plotLayout,
          ...chartLayout,
          title: '',
          autosize: true,
        }}
        config={plotConfig}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler={true}
        onClick={(event) => handleChartClick(event, item.id)}
      />
    );
  };

  return (
    <div className={`p-6 ${fullScreen ? 'h-screen overflow-auto' : ''}`}>
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${fullScreen ? 'auto-rows-max' : ''}`}>
        {data.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border overflow-hidden flex flex-col"
            style={{
              backgroundColor: colorTheme.cardBackground,
              borderColor: colorTheme.border,
            }}
          >
            {/* Card Header */}
            <div className="p-4 border-b flex-shrink-0" style={{ borderColor: colorTheme.border }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="text-green-400">
                  {getChartIcon(item.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="text-xs text-gray-400">{item.type}</p>
                </div>
                {onDeleteVisualization && (
                  <button
                    onClick={() => onDeleteVisualization(item.id)}
                    className="text-red-400 hover:text-red-300 transition-colors p-2"
                    title="Delete visualization"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              {/* Chart Customizer - only show for charts, not tables */}
              {!item.type.toLowerCase().includes('table') && (
                <ChartCustomizer
                  chartId={item.id}
                  customization={chartCustomizations[item.id] || {}}
                  onUpdate={handleCustomizationUpdate}
                />
              )}
            </div>

            {/* Chart Area */}
            <div className="p-4 flex-shrink-0" style={{ minHeight: '300px', maxHeight: fullScreen ? '400px' : 'none' }}>
              {renderVisualization(item)}
            </div>

            {/* Insights */}
            {item.insights && (
              <div className="p-4 border-t bg-gray-900/50 flex-shrink-0" style={{ borderColor: colorTheme.border }}>
                <h4 className="text-sm font-semibold text-green-400 mb-2">Insights</h4>
                <div className="text-sm text-gray-300 prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      p: ({node, ...props}) => <div className="mb-2" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-1" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-1" {...props} />,
                    }}
                  >
                    {item.insights}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Color Picker Overlay */}
      {colorPicker && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setColorPicker(null)}
          />
          <ElementColorPicker
            position={colorPicker}
            onColorSelect={handleColorSelect}
            onClose={() => setColorPicker(null)}
          />
        </>
      )}
    </div>
  );
};

export default VisualizationPanel;
