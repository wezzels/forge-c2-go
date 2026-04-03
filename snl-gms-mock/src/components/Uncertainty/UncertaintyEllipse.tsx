import React, { useEffect, useRef } from 'react';

interface UncertaintyEllipseProps {
  latitude: number;
  longitude: number;
  uncertainty: {
    latitude: number;
    longitude: number;
    depth: number;
  };
  depth?: number;
  color?: string;
  opacity?: number;
  onMap?: any; // Cesium map reference
}

/**
 * Uncertainty Ellipse Component
 * 
 * Displays uncertainty ellipse on Cesium globe showing the confidence
 * region for earthquake location.
 */
export const UncertaintyEllipse: React.FC<UncertaintyEllipseProps> = ({
  latitude,
  longitude,
  uncertainty,
  depth = 0,
  color = '#ff0000',
  opacity = 0.5,
  onMap
}) => {
  // For Cesium integration
  useEffect(() => {
    if (!onMap) return;
    
    // This would integrate with Cesium to draw the ellipse
    // For now, we just prepare the data
  }, [latitude, longitude, uncertainty, onMap]);

  // For 2D display, calculate ellipse points
  const calculateEllipsePoints = (numPoints: number = 64): Array<[number, number]> => {
    const points: Array<[number, number]> = [];
    
    // Semi-major and semi-minor axes in km
    const a = uncertainty.longitude * 111; // Convert to km (approximate)
    const b = uncertainty.latitude * 111;  // Convert to km (approximate)
    
    for (let i = 0; i < numPoints; i++) {
      const angle = (2 * Math.PI * i) / numPoints;
      
      // Ellipse parametric equations
      const x = a * Math.cos(angle);
      const y = b * Math.sin(angle);
      
      // Convert back to lat/lon
      const lat = latitude + (y / 111);
      const lon = longitude + (x / (111 * Math.cos(latitude * Math.PI / 180)));
      
      points.push([lat, lon]);
    }
    
    return points;
  };

  return (
    <div className="uncertainty-ellipse-info" style={{
      backgroundColor: '#1a1a2e',
      padding: '10px',
      borderRadius: '4px',
      fontSize: '12px'
    }}>
      <div style={{ color: '#888', marginBottom: '5px' }}>Location Uncertainty</div>
      <div style={{ color: color, fontWeight: 'bold' }}>
        ±{uncertainty.latitude.toFixed(4)}° lat, ±{uncertainty.longitude.toFixed(4)}° lon
      </div>
      <div style={{ color: '#888', marginTop: '5px' }}>
        Depth: {depth.toFixed(1)} ± {uncertainty.depth.toFixed(1)} km
      </div>
      <div style={{
        marginTop: '10px',
        width: '100%',
        height: '60px',
        position: 'relative'
      }}>
        <svg viewBox="-50 -50 100 100" style={{ width: '100%', height: '100%' }}>
          {/* Coordinate axes */}
          <line x1="-40" y1="0" x2="40" y2="0" stroke="#333" strokeWidth="0.5" />
          <line x1="0" y1="-40" x2="0" y2="40" stroke="#333" strokeWidth="0.5" />
          
          {/* Uncertainty ellipse */}
          <ellipse
            cx="0"
            cy="0"
            rx={Math.min(40, uncertainty.longitude * 1000)}
            ry={Math.min(40, uncertainty.latitude * 1000)}
            fill={color}
            fillOpacity={opacity}
            stroke={color}
            strokeWidth="1"
          />
          
          {/* Center point */}
          <circle cx="0" cy="0" r="2" fill="#fff" />
        </svg>
      </div>
    </div>
  );
};

export default UncertaintyEllipse;
