import React, { useRef, useEffect, useState } from 'react';

// Set Cesium base URL before importing
(window as any).CESIUM_BASE_URL = '/cesium';

// Import Cesium
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

interface CesiumMapProps {
  stations: Array<{
    name: string;
    latitude: number;
    longitude: number;
    type?: string;
  }>;
  events: Array<{
    id: string;
    latitude: number;
    longitude: number;
    magnitude: number;
    depth: number;
  }>;
  selectedStationIds?: string[];
  selectedEventIds?: string[];
  onStationClick?: (stationId: string) => void;
  onEventClick?: (eventId: string) => void;
  height?: number;
}

export const CesiumMap: React.FC<CesiumMapProps> = ({
  stations,
  events,
  selectedStationIds = [],
  selectedEventIds = [],
  onStationClick,
  onEventClick,
  height = 400
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || viewerRef.current) return;

    try {
      // Initialize Cesium viewer with minimal configuration
      viewerRef.current = new Cesium.Viewer(containerRef.current, {
        baseLayerPicker: false,
        geocoder: false,
        homeButton: true,
        sceneModePicker: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: true,
        vrButton: false,
        infoBox: true,
        selectionIndicator: true
      });

      // Remove default imagery layer and add OpenStreetMap
      viewerRef.current.imageryLayers.removeAll();
      viewerRef.current.imageryLayers.addImageryProvider(
        new Cesium.OpenStreetMapImageryProvider({
          url: 'https://tile.openstreetmap.org/'
        })
      );

      // Set initial view
      viewerRef.current.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(0, 20, 20000000)
      });

      setIsReady(true);
      setError(null);
    } catch (err) {
      console.error('Failed to initialize Cesium:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize map');
    }

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  // Update markers
  useEffect(() => {
    if (!viewerRef.current || !isReady) return;

    const viewer = viewerRef.current;
    
    // Clear existing entities
    viewer.entities.removeAll();

    // Add station markers (green)
    stations.forEach(station => {
      const isSelected = selectedStationIds.includes(station.name);
      
      viewer.entities.add({
        name: station.name,
        position: Cesium.Cartesian3.fromDegrees(station.longitude, station.latitude),
        point: {
          pixelSize: isSelected ? 14 : 10,
          color: isSelected ? Cesium.Color.YELLOW : Cesium.Color.LIME,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        },
        label: {
          text: station.name,
          font: '12px sans-serif',
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -12),
          scaleByDistance: new Cesium.NearFarScalar(1.5e6, 1.0, 1.5e7, 0.3)
        }
      });
    });

    // Add event markers (red)
    events.forEach(event => {
      const isSelected = selectedEventIds.includes(event.id);
      
      viewer.entities.add({
        name: event.id,
        position: Cesium.Cartesian3.fromDegrees(event.longitude, event.latitude),
        point: {
          pixelSize: isSelected ? 14 : 10,
          color: isSelected ? Cesium.Color.YELLOW : Cesium.Color.RED,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2
        },
        label: {
          text: 'M' + event.magnitude.toFixed(1),
          font: '11px sans-serif',
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -12),
          scaleByDistance: new Cesium.NearFarScalar(1.5e6, 1.0, 1.5e7, 0.3)
        }
      });
    });

    // Zoom to fit all markers
    if (viewer.entities.values.length > 0) {
      viewer.zoomTo(viewer.entities, new Cesium.HeadingPitchRange(0, -0.5, 0));
    }
  }, [stations, events, selectedStationIds, selectedEventIds, isReady]);

  // Handle click events
  useEffect(() => {
    if (!viewerRef.current || !isReady) return;

    const handler = new Cesium.ScreenSpaceEventHandler(viewerRef.current.scene.canvas);
    
    handler.setInputAction((click: any) => {
      const pickedObject = viewerRef.current?.scene.pick(click.position);
      
      if (pickedObject && pickedObject.id) {
        const entity = pickedObject.id;
        
        // Check if it's a station
        const station = stations.find(s => s.name === entity.name);
        if (station && onStationClick) {
          onStationClick(station.name);
          return;
        }
        
        // Check if it's an event
        const event = events.find(e => e.id === entity.name);
        if (event && onEventClick) {
          onEventClick(event.id);
          return;
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    return () => {
      handler.destroy();
    };
  }, [stations, events, onStationClick, onEventClick, isReady]);

  if (error) {
    return (
      <div style={{
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a1a',
        color: '#ff6666',
        flexDirection: 'column',
        padding: '20px'
      }}>
        <div style={{ marginBottom: '10px' }}>⚠️ Map Error</div>
        <div style={{ fontSize: '12px', color: '#888' }}>{error}</div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      style={{ width: '100%', height }}
    />
  );
};

export default CesiumMap;
