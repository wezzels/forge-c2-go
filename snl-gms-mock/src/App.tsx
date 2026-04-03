import React, { useState, useCallback } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './state/store';
import { StationProperties } from './components/StationProperties/StationProperties';
import { EventsTable } from './components/Events/EventsTable';
import { WaveformDisplay, type WaveformApi } from './components/Waveform/WaveformDisplay';
import { WaveformControls } from './components/Waveform/WaveformControls';
import { WaveformFilterModal, type WaveformFilter } from './components/Waveform/WaveformFilterModal';
import { SignalDetectionsPanel } from './components/SignalDetections/SignalDetectionsPanel';
import { MapPanelCesium } from './components/Map/MapPanelCesium';
import { EventDetailModal } from './components/EventDetail/EventDetailModal';
import { StationDetailModal } from './components/StationDetail/StationDetailModal';
import { DetectionDetailModal } from './components/DetectionDetail/DetectionDetailModal';
import { EventCreationForm } from './components/EventCreation/EventCreationForm';
import { Toolbar } from './components/Toolbar/Toolbar';
import { FilterDropdown } from './components/Filter/FilterDropdown';
import { TimeRangeSelector } from './components/Filter/TimeRangeSelector';
import { AssociateDetectionModal } from './components/DetectionAssociation/AssociateDetectionModal';
import { CreateSignalDetectionModal } from './components/DetectionAssociation/CreateSignalDetectionModal';
import { ExportButton } from './components/Export/ExportButton';
import { getTestStations, getTestEvents, getTestDetections, getTestChannelSegments } from './api/test-data';
import type { Station } from './models/station';
import type { Event } from './models/event';
import type { SignalDetection } from './models/detection';
import type { ChannelSegment } from './models/weavess';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  const [selectedStationIds, setSelectedStationIds] = useState<string[]>([]);
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const [selectedDetectionIds, setSelectedDetectionIds] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState({ startTime: Date.now() / 1000 - 3600, endTime: Date.now() / 1000 });
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [waveformFilter, setWaveformFilter] = useState<WaveformFilter | null>(null);
  const [showRuler, setShowRuler] = useState(false);
  const [eventStatusFilter, setEventStatusFilter] = useState<string>('ALL');
  const [detectionPhaseFilter, setDetectionPhaseFilter] = useState<string>('ALL');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [selectedDetection, setSelectedDetection] = useState<SignalDetection | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showStationModal, setShowStationModal] = useState(false);
  const [showDetectionModal, setShowDetectionModal] = useState(false);
  const [showEventCreation, setShowEventCreation] = useState(false);
  const [showWaveformFilter, setShowWaveformFilter] = useState(false);
  const [showAssociateModal, setShowAssociateModal] = useState(false);
  const [showCreateDetectionModal, setShowCreateDetectionModal] = useState(false);

  // Waveform API ref
  const [waveformApi, setWaveformApi] = useState<WaveformApi | null>(null);

  const stations: Station[] = getTestStations();
  const events: Event[] = getTestEvents();
  const detections: SignalDetection[] = getTestDetections();
  const channelSegments: ChannelSegment[] = getTestChannelSegments();

  const channelList = channelSegments.map(cs => ({
    id: cs.id,
    name: cs.name
  }));

  // Create detection markers from detections
  const detectionMarkers = detections.map(d => ({
    time: d.arrivalTime,
    channel: d.station?.name,
    type: 'arrival' as const,
    color: d.phase === 'P' ? '#ff0000' : '#00ff00',
    label: d.phase
  }));

  const filteredEvents = eventStatusFilter === 'ALL' 
    ? events 
    : events.filter(e => e.status === eventStatusFilter);
    
  const filteredDetections = detectionPhaseFilter === 'ALL'
    ? detections
    : detections.filter(d => d.phase === detectionPhaseFilter);

  const handleEventDoubleClick = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setShowEventModal(true);
    }
  };

  const handleStationDoubleClick = (stationName: string) => {
    const station = stations.find(s => s.name === stationName);
    if (station) {
      setSelectedStation(station);
      setShowStationModal(true);
    }
  };

  const handleDetectionDoubleClick = (detectionId: string) => {
    const detection = detections.find(d => d.id === detectionId);
    if (detection) {
      setSelectedDetection(detection);
      setShowDetectionModal(true);
    }
  };

  const handleSaveEvent = (event: Event) => {
    console.log('Saving event:', event);
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  const handleCreateEvent = (event: Event) => {
    console.log('Creating event:', event);
    setShowEventCreation(false);
  };

  const handleCreateDetection = (detection: any) => {
    console.log('Creating detection:', detection);
    setShowCreateDetectionModal(false);
  };

  const handleAssociateDetection = (eventId: string) => {
    console.log('Associating detection to event:', eventId);
    setShowAssociateModal(false);
  };

  const handleApplyWaveformFilter = (filter: WaveformFilter) => {
    console.log('Applying waveform filter:', filter);
    setWaveformFilter(filter);
  };

  const handleShowOnMap = (station: Station) => {
    console.log('Show station on map:', station);
    setSelectedStationIds([station.name]);
  };

  // Waveform zoom/pan handlers
  const handleZoomIn = useCallback(() => {
    if (waveformApi) {
      waveformApi.zoomIn();
    }
  }, [waveformApi]);

  const handleZoomOut = useCallback(() => {
    if (waveformApi) {
      waveformApi.zoomOut();
    }
  }, [waveformApi]);

  const handlePanLeft = useCallback(() => {
    if (waveformApi) {
      waveformApi.panLeft();
    }
  }, [waveformApi]);

  const handlePanRight = useCallback(() => {
    if (waveformApi) {
      waveformApi.panRight();
    }
  }, [waveformApi]);

  const handleReset = useCallback(() => {
    if (waveformApi) {
      waveformApi.resetZoom();
    }
  }, [waveformApi]);

  const handleToggleRuler = useCallback(() => {
    setShowRuler(prev => !prev);
  }, []);

  const handleWaveformRef = useCallback((api: WaveformApi) => {
    setWaveformApi(api);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <div className="app-container">
          <header className="app-header">
            <h1>GMS Mock UI</h1>
            <div className="time-controls">
              <TimeRangeSelector
                startTime={timeRange.startTime}
                endTime={timeRange.endTime}
                onChange={(start, end) => setTimeRange({ startTime: start, endTime: end })}
              />
            </div>
          </header>
          <main className="app-main">
            <div className="left-panel">
              <div className="panel station-panel">
                <Toolbar
                  title="Stations"
                  count={stations.length}
                  onRefresh={() => console.log('Refresh stations')}
                />
                <StationProperties
                  stations={stations}
                  selectedStationIds={selectedStationIds}
                  onStationSelect={setSelectedStationIds}
                  onStationDoubleClick={handleStationDoubleClick}
                  onShowOnMap={handleShowOnMap}
                />
              </div>
              <div className="panel events-panel">
                <Toolbar
                  title="Events"
                  count={filteredEvents.length}
                  onCreateEvent={() => setShowEventCreation(true)}
                  onRefresh={() => console.log('Refresh events')}
                />
                <div style={{ padding: '10px', backgroundColor: '#0f0f23' }}>
                  <FilterDropdown
                    label="Status"
                    options={[
                      { value: 'ALL', label: 'All Statuses' },
                      { value: 'IN_PROGRESS', label: 'In Progress' },
                      { value: 'COMPLETE', label: 'Complete' },
                      { value: 'NOT_STARTED', label: 'Not Started' }
                    ]}
                    value={eventStatusFilter}
                    onChange={setEventStatusFilter}
                  />
                  <div style={{ marginTop: '10px' }}>
                    <ExportButton
                      data={filteredEvents.map(e => ({
                        id: e.id,
                        status: e.status,
                        magnitude: e.magnitude,
                        latitude: e.latitude,
                        longitude: e.longitude,
                        depth: e.depth,
                        originTime: new Date(e.originTime * 1000).toISOString()
                      }))}
                      filename="events"
                      label="Export Events"
                    />
                  </div>
                </div>
                <EventsTable
                  events={filteredEvents}
                  selectedEventIds={selectedEventIds}
                  onEventSelect={setSelectedEventIds}
                  onEventDoubleClick={handleEventDoubleClick}
                />
              </div>
            </div>
            <div className="center-panel">
              <div className="panel waveform-panel">
                <Toolbar
                  title="Waveforms"
                  count={channelSegments.length}
                  onRefresh={() => console.log('Refresh waveforms')}
                />
                <WaveformControls
                  channels={channelList}
                  selectedChannels={selectedChannels}
                  onZoomIn={handleZoomIn}
                  onZoomOut={handleZoomOut}
                  onPanLeft={handlePanLeft}
                  onPanRight={handlePanRight}
                  onReset={handleReset}
                  onFilter={() => setShowWaveformFilter(true)}
                  onChannelSelect={setSelectedChannels}
                  showRuler={showRuler}
                  onToggleRuler={handleToggleRuler}
                />
                <WaveformDisplay
                  channelSegments={channelSegments}
                  startTime={timeRange.startTime}
                  endTime={timeRange.endTime}
                  height={350}
                  markers={detectionMarkers}
                  showRuler={showRuler}
                  onWaveformRef={handleWaveformRef}
                />
              </div>
              <div className="panel detections-panel">
                <Toolbar
                  title="Signal Detections"
                  count={filteredDetections.length}
                  onRefresh={() => console.log('Refresh detections')}
                />
                <div style={{ padding: '10px', backgroundColor: '#0f0f23' }}>
                  <FilterDropdown
                    label="Phase"
                    options={[
                      { value: 'ALL', label: 'All Phases' },
                      { value: 'P', label: 'P' },
                      { value: 'S', label: 'S' }
                    ]}
                    value={detectionPhaseFilter}
                    onChange={setDetectionPhaseFilter}
                  />
                  <div style={{ marginTop: '10px' }}>
                    <ExportButton
                      data={filteredDetections.map(d => ({
                        id: d.id,
                        station: d.station?.name || 'Unknown',
                        phase: d.phase,
                        arrivalTime: new Date(d.arrivalTime * 1000).toISOString(),
                        slowness: d.slowness,
                        azimuth: d.azimuth,
                        amplitude: d.amplitude
                      }))}
                      filename="detections"
                      label="Export Detections"
                    />
                  </div>
                </div>
                <SignalDetectionsPanel
                  detections={filteredDetections}
                  selectedDetectionIds={selectedDetectionIds}
                  onDetectionSelect={setSelectedDetectionIds}
                  onDetectionDoubleClick={handleDetectionDoubleClick}
                />
              </div>
            </div>
            <div className="right-panel">
              <div className="panel map-panel">
                <Toolbar
                  title="Map"
                />
                <MapPanelCesium
                  stations={stations}
                  events={events}
                  selectedStationIds={selectedStationIds}
                  selectedEventIds={selectedEventIds}
                  onStationClick={(id) => console.log('Station clicked:', id)}
                  onEventClick={(id) => console.log('Event clicked:', id)}
                />
              </div>
            </div>
          </main>
        </div>

        <EventDetailModal
          event={selectedEvent}
          isOpen={showEventModal}
          onClose={() => {
            setShowEventModal(false);
            setSelectedEvent(null);
          }}
          onSave={handleSaveEvent}
        />

        <StationDetailModal
          station={selectedStation}
          isOpen={showStationModal}
          onClose={() => {
            setShowStationModal(false);
            setSelectedStation(null);
          }}
        />

        <DetectionDetailModal
          detection={selectedDetection}
          isOpen={showDetectionModal}
          onClose={() => {
            setShowDetectionModal(false);
            setSelectedDetection(null);
          }}
        />

        <EventCreationForm
          isOpen={showEventCreation}
          onClose={() => setShowEventCreation(false)}
          onCreate={handleCreateEvent}
        />

        <WaveformFilterModal
          isOpen={showWaveformFilter}
          onClose={() => setShowWaveformFilter(false)}
          onApply={handleApplyWaveformFilter}
        />

        <AssociateDetectionModal
          isOpen={showAssociateModal}
          onClose={() => setShowAssociateModal(false)}
          onAssociate={handleAssociateDetection}
          events={events}
          detectionId={selectedDetection?.id || ''}
        />

        <CreateSignalDetectionModal
          isOpen={showCreateDetectionModal}
          onClose={() => setShowCreateDetectionModal(false)}
          onCreate={handleCreateDetection}
          stations={stations}
        />
      </Provider>
    </QueryClientProvider>
  );
};

export default App;
