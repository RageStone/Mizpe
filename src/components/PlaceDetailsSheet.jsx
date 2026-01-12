import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useMotionValue, useAnimation } from 'framer-motion';
import { X, Navigation, MapPin, ThermometerSun, Cloud, Sun, CloudRain, AlertCircle, Clock } from 'lucide-react';

const PlaceDetailsSheet = ({ place, isOpen, onClose }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [mounted, setMounted] = useState(false);
  const y = useMotionValue(0);
  const controls = useAnimation();
  const scrollContainerRef = useRef(null);
  
  // SSR/Hydration fix: Only set mounted state on client side
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  // Reset state when sheet opens/closes
  useEffect(() => {
    if (isOpen && mounted) {
      setIsDragging(false);
      setIsAtTop(true);
      // Don't set y here - let the animation handle it
    } else if (!isOpen) {
      // Reset when closed
      setIsDragging(false);
      y.set(0);
    }
  }, [isOpen, mounted, y]);

  // Track scroll position
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollTop = scrollContainerRef.current.scrollTop;
      setIsAtTop(scrollTop === 0);
    }
  };
  
  // Don't render portal on server side
  if (!mounted) return null;

  // Helper functions (safe to call even if place is null)
  const getWeatherRecommendation = (temp) => {
    if (temp > 32) return { status: 'לא מומלץ', color: 'bg-red-500', icon: ThermometerSun };
    if (temp > 28) return { status: 'זהירות', color: 'bg-yellow-500', icon: Sun };
    return { status: 'מומלץ', color: 'bg-green-500', icon: Sun };
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny': return Sun;
      case 'cloudy': return Cloud;
      case 'partly-cloudy': return Cloud;
      case 'rainy': return CloudRain;
      default: return Sun;
    }
  };

  // Only compute these if place exists
  const recommendation = place ? getWeatherRecommendation(place.weather.temperature) : null;
  const WeatherIcon = place ? getWeatherIcon(place.weather.condition) : Sun;
  const RecIcon = recommendation?.icon || Sun;

  const openNavigation = () => {
    if (!place) return;
    const query = encodeURIComponent(`${place.name}, ${place.location}`);
    window.open(`https://www.waze.com/ul?q=${query}`, '_blank');
  };

  const handleDragStart = (event, info) => {
    // Double-check we're at top before allowing drag
    if (scrollContainerRef.current && scrollContainerRef.current.scrollTop === 0) {
      setIsDragging(true);
      controls.stop();
    } else {
      // Cancel drag if not at top
      return false;
    }
  };

  const handleDrag = (event, info) => {
    // Double-check we're still at top during drag
    if (scrollContainerRef.current && scrollContainerRef.current.scrollTop > 0) {
      y.set(0);
      setIsDragging(false);
      return;
    }
    
    // Only allow dragging down (positive y values)
    if (info.offset.y < 0) {
      y.set(0);
    } else {
      y.set(info.offset.y);
    }
  };

  const handleDragEnd = async (event, info) => {
    // Don't handle drag end if not at top
    if (!isAtTop) {
      setIsDragging(false);
      y.set(0);
      return;
    }

    const { velocity } = info;
    const threshold = 150; // Minimum drag distance to close
    
    // Get current y position
    const currentY = y.get();
    
    // If dragged down significantly or with enough velocity, close the sheet
    if (currentY > threshold || velocity.y > 500) {
      setIsDragging(false);
      // Animate to bottom and close
      await controls.start({
        y: window.innerHeight,
        transition: { type: 'spring', damping: 30, stiffness: 300 }
      });
      onClose();
      // Reset for next open
      setTimeout(() => {
        y.set(0);
        controls.set({ y: 0 });
      }, 300);
    } else {
      // Snap back to top
      setIsDragging(false);
      await controls.start({
        y: 0,
        transition: { type: 'spring', damping: 30, stiffness: 300 }
      });
      y.set(0);
    }
  };

  // Portal content - always create portal when mounted, conditionally render content
  // Ensure document.body exists before creating portal
  if (!document?.body) return null;
  
  const portalContent = (
    <AnimatePresence>
      {isOpen && place && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 bg-black/50 z-[1040]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[1050] max-h-[90vh] overflow-hidden flex flex-col"
            initial={{ y: '100%' }}
            animate={isDragging ? undefined : { y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            style={isDragging ? { y } : undefined}
            drag={isAtTop ? "y" : false}
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            dragMomentum={false}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 btn-icon z-10"
            >
              <X size={24} />
            </button>

            {/* Scrollable Content */}
            <div 
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto scrollbar-thin"
              onScroll={handleScroll}
            >
              <div className="p-6">
              {/* Header Image */}
              <div className="relative h-48 rounded-2xl overflow-hidden mb-6 -mt-2 card">
                <img 
                  src={place.image_url} 
                  alt={place.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 gradient-overlay-light" />
                <div className="absolute bottom-4 right-4 text-white">
                  <h2 className="text-2xl font-black">{place.name}</h2>
                  <p className="text-lg opacity-90 font-medium">{place.location}</p>
                </div>
              </div>

              {/* Priority 1: Must Know Alert Box */}
              {place.mustKnow && (
                <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 mb-6 card">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-rose-600 flex-shrink-0 mt-0.5" size={24} />
                    <div>
                      <h3 className="text-lg font-bold text-rose-900 mb-1">חשוב לדעת</h3>
                      <p className="text-rose-800 font-medium">{place.mustKnow}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Priority 2: Field Reports */}
              {place.fieldReport && (
                <div className="bg-blue-50/80 glass rounded-2xl p-4 mb-6 border border-blue-200 card">
                  <div className="flex items-start gap-3">
                    <Clock className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-blue-900 mb-1">דיווח מהשטח</h3>
                      <p className="text-blue-800 font-medium mb-1">{place.fieldReport.text}</p>
                      <p className="text-xs text-blue-600 font-normal">דווח לפני {place.fieldReport.timestamp}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Weather Widget - Enhanced */}
              {recommendation && (
                <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-2xl p-4 mb-6 glass card">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-full bg-white shadow-md">
                        <WeatherIcon size={24} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">טמפרטורה</p>
                        <p className="text-2xl font-black">{place.weather.temperature}°C</p>
                      </div>
                    </div>
                    <div className={`${recommendation.color} text-white badge flex items-center gap-2`}>
                      <RecIcon size={20} />
                      <span className="font-bold">{recommendation.status}</span>
                    </div>
                  </div>
                  {place.weather.humidity !== undefined && (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="font-semibold">לחות:</span>
                      <span className="font-medium">{place.weather.humidity}%</span>
                    </div>
                  )}
                </div>
              )}

              {/* Priority 3: Parametric Ratings */}
              <div className="mb-6">
                <h3 className="text-xl font-black mb-4 text-gray-800">דירוגים</h3>
                <div className="space-y-4">
                  {[
                    { key: 'view', label: 'איכות הנוף', value: place.ratings.view },
                    { key: 'access', label: 'דרך הגעה', value: place.ratings.access },
                    { key: 'cleanliness', label: 'ניקיון', value: place.ratings.cleanliness },
                    { key: 'familyFriendly', label: 'מתאים למשפחות', value: place.ratings.familyFriendly }
                  ].map(({ key, label, value }) => (
                    <div key={key}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-gray-700">{label}</span>
                        <span className="text-sm font-bold text-gray-900">{value.toFixed(1)}</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden backdrop-blur-sm">
                        <motion.div
                          className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(value / 10) * 100}%` }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-2 text-gray-800">עונה מומלצת</h3>
                <p className="text-gray-600 font-medium">{place.best_season}</p>
              </div>

              {/* Tags */}
              <div className="mb-6">
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

              {/* Action Buttons - Refactored */}
              <div className="space-y-3">
                {/* Primary: Navigate Button */}
                <button
                  onClick={openNavigation}
                  className="w-full btn btn-primary py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl"
                >
                  <Navigation size={24} />
                  <span>נווט עם Waze</span>
                </button>
                
                {/* Secondary: Show on Map */}
                <button
                  onClick={() => {
                    if (!place) return;
                    const query = encodeURIComponent(`${place.name}, ${place.location}`);
                    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                  }}
                  className="w-full btn btn-secondary py-3 rounded-2xl flex items-center justify-center gap-3 glass"
                >
                  <MapPin size={20} />
                  <span>הצג במפה</span>
                </button>
              </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(portalContent, document.body);
};

export default PlaceDetailsSheet;


