// Map configuration for Vista app
export const MAP_CONFIG = {
  // Default center: Israel center
  defaultCenter: [35.0, 31.5],
  defaultZoom: 7,
  
  // Map style: Outdoors/Terrain style for better outdoor/nature visualization
  mapStyle: 'mapbox://styles/mapbox/outdoors-v12',
  
  // Mapbox access token (from environment variable)
  accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '',
  
  // Map options
  minZoom: 5,
  maxZoom: 18,
  
  // RTL support
  rtl: true,
};

// Helper function to calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (coord1, coord2) => {
  const [lng1, lat1] = coord1;
  const [lng2, lat2] = coord2;
  
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};
