import React from 'react';
import { Maximize2, Minimize2, Move, RotateCw } from 'lucide-react';

const ChartCustomizer = ({ chartId, customization, onUpdate }) => {
  const handleSizeChange = (delta) => {
    const newHeight = Math.max(200, Math.min(800, (customization.height || 300) + delta));
    onUpdate(chartId, { ...customization, height: newHeight });
  };

  const handleAxisRotation = (axis) => {
    const currentRotation = customization[`${axis}AxisRotation`] || 0;
    const newRotation = (currentRotation + 45) % 360;
    onUpdate(chartId, { ...customization, [`${axis}AxisRotation`]: newRotation });
  };

  const handleAxisPosition = (axis, direction) => {
    const currentOffset = customization[`${axis}AxisOffset`] || 0;
    const delta = direction === 'increase' ? 10 : -10;
    onUpdate(chartId, { ...customization, [`${axis}AxisOffset`]: currentOffset + delta });
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg border border-gray-700">
      {/* Size Controls */}
      <div className="flex items-center gap-1 border-r border-gray-700 pr-2">
        <span className="text-xs text-gray-400">Size:</span>
        <button
          onClick={() => handleSizeChange(50)}
          className="p-1 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
          title="Increase size"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleSizeChange(-50)}
          className="p-1 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
          title="Decrease size"
        >
          <Minimize2 className="w-4 h-4" />
        </button>
      </div>

      {/* X-Axis Controls */}
      <div className="flex items-center gap-1 border-r border-gray-700 pr-2">
        <span className="text-xs text-gray-400">X-Axis:</span>
        <button
          onClick={() => handleAxisRotation('x')}
          className="p-1 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
          title="Rotate X-axis labels"
        >
          <RotateCw className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleAxisPosition('x', 'increase')}
          className="px-2 py-1 hover:bg-gray-700 rounded text-xs text-gray-300 hover:text-white transition-colors"
          title="Move X-axis down"
        >
          ↓
        </button>
        <button
          onClick={() => handleAxisPosition('x', 'decrease')}
          className="px-2 py-1 hover:bg-gray-700 rounded text-xs text-gray-300 hover:text-white transition-colors"
          title="Move X-axis up"
        >
          ↑
        </button>
      </div>

      {/* Y-Axis Controls */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-400">Y-Axis:</span>
        <button
          onClick={() => handleAxisRotation('y')}
          className="p-1 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
          title="Rotate Y-axis labels"
        >
          <RotateCw className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleAxisPosition('y', 'increase')}
          className="px-2 py-1 hover:bg-gray-700 rounded text-xs text-gray-300 hover:text-white transition-colors"
          title="Move Y-axis right"
        >
          →
        </button>
        <button
          onClick={() => handleAxisPosition('y', 'decrease')}
          className="px-2 py-1 hover:bg-gray-700 rounded text-xs text-gray-300 hover:text-white transition-colors"
          title="Move Y-axis left"
        >
          ←
        </button>
      </div>
    </div>
  );
};

export default ChartCustomizer;
