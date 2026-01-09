import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { Heart, Info, X } from 'lucide-react';
import SwipeCard from './SwipeCard';
import PlaceDetailsSheet from './PlaceDetailsSheet';
import { SAMPLE_PLACES } from '../data/mockPlaces';

const SwipeDiscovery = ({ onSave, savedPlaces, activeFilter }) => {
  const [places, setPlaces] = useState([...SAMPLE_PLACES]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const topCardX = useMotionValue(0);

  const handleSwipe = (direction) => {
    if (currentIndex >= places.length) return;

    const currentPlace = places[currentIndex];
    
    if (direction === 'right') {
      // Save to favorites
      onSave(currentPlace);
    }
    // Left swipe = skip (do nothing)

    setDirection(direction === 'right' ? 1 : -1);
    // Reset top card position for next card
    topCardX.set(0);
    // Wait for exit animation to complete before moving to next card
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
    }, 350); // Match exit animation duration (300ms) + small buffer
  };

  const handleSwipeUp = () => {
    if (currentIndex >= places.length) return;
    setSelectedPlace(places[currentIndex]);
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setSelectedPlace(null);
  };

  // Reset when all cards are swiped
  useEffect(() => {
    if (currentIndex >= places.length) {
      setTimeout(() => {
        setPlaces([...SAMPLE_PLACES]);
        setCurrentIndex(0);
        setDirection(0);
      }, 500);
    }
  }, [currentIndex, places.length]);

  const visibleCards = places.slice(currentIndex, currentIndex + 3);

  return (
    <div className="relative w-full flex-1 overflow-hidden flex flex-col">
      {/* Card Container - positioned above arrows */}
      <div className="relative w-[95%] mx-auto flex-1 pb-40" style={{ minHeight: '500px', marginTop: '70px', marginBottom: '50px'}}>
        {visibleCards.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-600">טוען...</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {visibleCards.map((place, index) => (
              <SwipeCard
                key={`${place.id}-${currentIndex + index}`}
                place={place}
                index={index}
                onSwipe={handleSwipe}
                onSwipeUp={handleSwipeUp}
                topCardX={index === 0 ? undefined : topCardX}
                onTopCardXChange={index === 0 ? (x) => topCardX.set(x) : undefined}
                direction={index === 0 ? direction : 0}
              />
            ))}
          </AnimatePresence>
        )}

        {/* Empty State */}
        {currentIndex >= places.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center p-8"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                סיימת לגלול!
              </h2>
              <p className="text-gray-600 mb-4 font-normal">
                נגמרו המקומות. נסה שוב או בדוק את המועדפים שלך.
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Action Buttons - pushed down, not overlapping */}
      {currentIndex < places.length && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-6 px-6 z-10">
          <button
            onClick={() => handleSwipe('left')}
            className="btn-icon"
            aria-label="Reject"
          >
            <X size={24} className="text-red-500" />
          </button>
          <button
            onClick={() => handleSwipeUp()}
            className="btn-icon"
            aria-label="Info"
          >
            <Info size={24} className="text-blue-500" />
          </button>
          <button
            onClick={() => handleSwipe('right')}
            className="btn-icon"
            aria-label="Like"
          >
            <Heart size={24} className="text-pink-500" fill="currentColor" />
          </button>
        </div>
      )}

      {/* Details Sheet */}
      <PlaceDetailsSheet
        place={selectedPlace}
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
      />
    </div>
  );
};

export default SwipeDiscovery;

