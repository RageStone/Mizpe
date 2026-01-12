import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, MapPin, X, Eye } from 'lucide-react';
import { calculateDistance } from '../config/mapConfig';

const POIPreviewCard = ({ place, userLocation, isOpen, onClose, onViewDetails }) => {
  if (!place) return null;

  const getStatusColor = () => {
    switch (place.liveStatus?.type) {
      case 'success':
        return { bg: 'bg-green-500', text: 'text-green-700', label: 'מומלץ' };
      case 'warning':
        return { bg: 'bg-yellow-500', text: 'text-yellow-700', label: 'זהירות' };
      case 'danger':
        return { bg: 'bg-red-500', text: 'text-red-700', label: 'לא מומלץ' };
      default:
        return { bg: 'bg-gray-500', text: 'text-gray-700', label: 'לא ידוע' };
    }
  };

  const status = getStatusColor();
  
  // Calculate distance if user location is available
  const distance = userLocation && place.coordinates
    ? calculateDistance(userLocation, place.coordinates)
    : null;

  const handleNavigate = () => {
    const query = encodeURIComponent(`${place.name}, ${place.location}`);
    window.open(`https://www.waze.com/ul?q=${query}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/30 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Card */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-40"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 btn-icon z-10"
            >
              <X size={20} />
            </button>

            {/* Content */}
            <div className="p-6 pt-4">
              {/* Header */}
              <div className="mb-4">
                <h3 className="text-xl font-black text-gray-800 mb-1">{place.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={16} />
                  <span className="font-medium">{place.location}</span>
                  {distance && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="font-semibold">{distance.toFixed(1)} ק״מ</span>
                    </>
                  )}
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-4">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${status.bg} text-white`}>
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <span className="text-sm font-bold">{status.label}</span>
                  {place.liveStatus?.text && (
                    <span className="text-xs opacity-90">• {place.liveStatus.text}</span>
                  )}
                </div>
              </div>

              {/* Tags */}
              {place.tags && place.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-4">
                  {place.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="badge badge-primary text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onViewDetails}
                  className="flex-1 btn btn-secondary py-3 rounded-2xl flex items-center justify-center gap-2"
                >
                  <Eye size={18} />
                  <span className="font-bold">פרטים</span>
                </button>
                <button
                  onClick={handleNavigate}
                  className="flex-1 btn btn-primary py-3 rounded-2xl flex items-center justify-center gap-2"
                >
                  <Navigation size={18} />
                  <span className="font-bold">נווט</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default POIPreviewCard;
