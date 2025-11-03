import React from 'react';
import { X } from 'lucide-react';

const ElementColorPicker = ({ position, onColorSelect, onClose }) => {
  const colors = [
    '#4ade80', '#60a5fa', '#c084fc', '#f87171', '#22d3ee',
    '#fb923c', '#f472b6', '#2dd4bf', '#fbbf24', '#a3e635',
    '#34d399', '#818cf8', '#f472b6', '#fb7185', '#38bdf8',
  ];

  return (
    <div
      className="fixed bg-gray-800 border-2 border-gray-600 rounded-lg shadow-2xl p-4 z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        minWidth: '200px',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-white font-semibold text-sm">Pick Color</h4>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-5 gap-2">
        {colors.map((color, index) => (
          <button
            key={index}
            onClick={() => onColorSelect(color)}
            className="w-8 h-8 rounded-md border-2 border-gray-600 hover:border-white transition-all hover:scale-110"
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
};

export default ElementColorPicker;
