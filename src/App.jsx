import { useState } from 'react';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import FilterBar from './components/FilterBar';
import SwipeDiscovery from './components/SwipeDiscovery';
import MapView from './components/MapView';

function App() {
  const [activeTab, setActiveTab] = useState('discovery');
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  const handleSave = (place) => {
    if (!savedPlaces.find(p => p.id === place.id)) {
      setSavedPlaces(prev => [...prev, place]);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'discovery':
        return (
          <>
            <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
            <SwipeDiscovery 
              onSave={handleSave}
              savedPlaces={savedPlaces}
              activeFilter={activeFilter}
            />
          </>
        );
      case 'map':
        return <MapView savedPlaces={savedPlaces} />;
      case 'favorites':
        return (
          <div className="h-full overflow-y-auto min-h-0 flex flex-col">
            <div className="p-6 flex-1">
              <h2 className="text-2xl font-black mb-6 text-gray-800">מועדפים</h2>
              {savedPlaces.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg mb-2 font-medium">אין מועדפים עדיין</p>
                  <p className="text-gray-500 text-sm font-normal">גלול וגלה מקומות חדשים!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedPlaces.map((place) => (
                    <div
                      key={place.id}
                      className="card card-interactive"
                    >
                      <div className="relative h-48">
                        <img
                          src={place.image_url}
                          alt={place.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 gradient-overlay-light" />
                        <div className="absolute bottom-4 right-4 text-white">
                          <h3 className="text-xl font-black">{place.name}</h3>
                          <p className="text-sm opacity-90 font-medium">{place.location}</p>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex gap-2 flex-wrap">
                          {place.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="badge badge-primary"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <div className="text-center">
              <p className="text-gray-600 text-lg">פרופיל - בקרוב</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="w-full overflow-hidden bg-gray-50 flex flex-col" 
      dir="rtl"
      style={{
        /* Use 100dvh (dynamic viewport height) to account for mobile address bar */
        /* Falls back to 100vh in CSS for browsers that don't support dvh */
        minHeight: '100dvh',
      }}
    >
      <TopBar savedCount={savedPlaces.length} />
      <div 
        className="flex-1 overflow-hidden flex flex-col min-h-0" 
        style={{ 
          /* Padding accounts for fixed top nav + safe area */
          paddingTop: 'calc(var(--top-nav-height) + env(safe-area-inset-top, 0px))',
          /* Padding accounts for fixed bottom nav + safe area to prevent overlap */
          paddingBottom: 'calc(var(--bottom-nav-height) + env(safe-area-inset-bottom, 0px))'
        }}
      >
        {renderContent()}
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;

