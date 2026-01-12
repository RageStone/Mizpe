import { useState, useMemo, useCallback } from 'react';
import Map, { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAP_CONFIG, calculateDistance } from '../config/mapConfig';
import { SAMPLE_PLACES } from '../data/mockPlaces';
import MapMarker from './MapMarker';
import POIPreviewCard from './POIPreviewCard';
import MapFilterBar from './MapFilterBar';
import MapSearchBar from './MapSearchBar';
import LocateMeButton from './LocateMeButton';
import PlaceDetailsSheet from './PlaceDetailsSheet';

const MapView = ({ savedPlaces }) => {
  const [viewState, setViewState] = useState({
    longitude: MAP_CONFIG.defaultCenter[0],
    latitude: MAP_CONFIG.defaultCenter[1],
    zoom: MAP_CONFIG.defaultZoom,
  });
  
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isPOIOpen, setIsPOIOpen] = useState(false);
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);
  const [safeToVisit, setSafeToVisit] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter places based on active filters and search
  const filteredPlaces = useMemo(() => {
    let filtered = [...SAMPLE_PLACES];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(place => {
        if (place.name.toLowerCase().includes(query)) return true;
        if (place.location.toLowerCase().includes(query)) return true;
        if (place.tags?.some(tag => tag.toLowerCase().includes(query))) return true;
        return false;
      });
    }

    // Apply "Safe to Visit Now" filter (hide red markers)
    if (safeToVisit) {
      filtered = filtered.filter(place => 
        place.liveStatus?.type !== 'danger'
      );
    }

    // Apply other filters
    activeFilters.forEach(filterId => {
      switch (filterId) {
        case 'nearby':
          if (userLocation) {
            filtered = filtered.filter(place => {
              if (!place.coordinates) return false;
              const distance = calculateDistance(userLocation, place.coordinates);
              return distance <= 50; // Within 50km
            });
          } else {
            // If no user location, show all (or could show error)
            filtered = filtered;
          }
          break;
        case 'accessible':
          filtered = filtered.filter(place => 
            place.hasCarAccess || place.isAccessible
          );
          break;
        case 'wowScenery':
          filtered = filtered.filter(place => 
            place.ratings?.view >= 9.0
          );
          break;
        case 'familyFriendly':
          filtered = filtered.filter(place => 
            place.ratings?.familyFriendly >= 8.0
          );
          break;
        default:
          break;
      }
    });

    return filtered;
  }, [activeFilters, safeToVisit, searchQuery, userLocation]);

  const handleMarkerClick = useCallback((place) => {
    setSelectedPlace(place);
    setIsPOIOpen(true);
    // Center map on marker
    if (place.coordinates) {
      setViewState(prev => ({
        ...prev,
        longitude: place.coordinates[0],
        latitude: place.coordinates[1],
        zoom: Math.max(prev.zoom, 12),
      }));
    }
  }, []);

  const handleMapClick = useCallback(() => {
    setIsPOIOpen(false);
    setSelectedPlace(null);
  }, []);

  const handleViewDetails = useCallback(() => {
    setIsPOIOpen(false);
    setIsDetailsSheetOpen(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setIsDetailsSheetOpen(false);
    setSelectedPlace(null);
  }, []);

  const handleLocationFound = useCallback((coords) => {
    setUserLocation(coords);
    setViewState(prev => ({
      ...prev,
      longitude: coords[0],
      latitude: coords[1],
      zoom: 12,
    }));
  }, []);

  const handlePlaceSelect = useCallback((place) => {
    handleMarkerClick(place);
  }, [handleMarkerClick]);

  // Check if Mapbox token is available
  const hasMapboxToken = MAP_CONFIG.accessToken && MAP_CONFIG.accessToken.trim() !== '';

  if (!hasMapboxToken) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100" dir="rtl">
        <div className="text-center p-6 max-w-md">
          <h2 className="text-2xl font-black text-gray-800 mb-4">נדרש מפתח API של Mapbox</h2>
          <p className="text-gray-600 mb-4">
            כדי להציג את המפה, יש צורך במפתח API של Mapbox.
          </p>
          <div className="bg-white rounded-2xl p-4 text-right">
            <p className="text-sm font-semibold text-gray-700 mb-2">הוראות:</p>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>הירשם ל-Mapbox בכתובת mapbox.com</li>
              <li>קבל את ה-Access Token שלך</li>
              <li>צור קובץ .env בשורש הפרויקט</li>
              <li>הוסף: VITE_MAPBOX_ACCESS_TOKEN=your_token_here</li>
              <li>הפעל מחדש את שרת הפיתוח</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full" dir="rtl">
      {/* Map Container */}
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        onClick={handleMapClick}
        mapStyle={MAP_CONFIG.mapStyle}
        mapboxAccessToken={MAP_CONFIG.accessToken}
        style={{ width: '100%', height: '100%' }}
        minZoom={MAP_CONFIG.minZoom}
        maxZoom={MAP_CONFIG.maxZoom}
        attributionControl={false}
      >
        {/* Markers */}
        {filteredPlaces.map((place) => {
          if (!place.coordinates) return null;
          
          return (
            <Marker
              key={place.id}
              longitude={place.coordinates[0]}
              latitude={place.coordinates[1]}
              anchor="bottom"
            >
              <MapMarker
                place={place}
                onClick={() => handleMarkerClick(place)}
                isSelected={selectedPlace?.id === place.id}
              />
            </Marker>
          );
        })}
      </Map>

      {/* UI Overlays */}
      <MapFilterBar
        activeFilters={activeFilters}
        onFilterChange={setActiveFilters}
        safeToVisit={safeToVisit}
        onSafeToVisitChange={setSafeToVisit}
      />

      <MapSearchBar
        places={SAMPLE_PLACES}
        onPlaceSelect={handlePlaceSelect}
        onSearchChange={setSearchQuery}
      />

      <LocateMeButton
        onLocationFound={handleLocationFound}
        onError={(error) => {
          console.error('Location error:', error);
          // Could show a toast notification here
        }}
      />

      {/* POI Preview Card */}
      <POIPreviewCard
        place={selectedPlace}
        userLocation={userLocation}
        isOpen={isPOIOpen}
        onClose={() => {
          setIsPOIOpen(false);
          setSelectedPlace(null);
        }}
        onViewDetails={handleViewDetails}
      />

      {/* Full Details Sheet */}
      <PlaceDetailsSheet
        place={selectedPlace}
        isOpen={isDetailsSheetOpen}
        onClose={handleCloseDetails}
      />
    </div>
  );
};

export default MapView;
