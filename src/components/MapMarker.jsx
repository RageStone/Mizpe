import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const MapMarker = ({ place, onClick, isSelected }) => {
  const getMarkerColor = () => {
    switch (place.liveStatus?.type) {
      case 'success':
        return '#10b981'; // Green
      case 'warning':
        return '#f59e0b'; // Yellow
      case 'danger':
        return '#ef4444'; // Red
      default:
        return '#64748b'; // Gray (fallback)
    }
  };

  const markerColor = getMarkerColor();

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: isSelected ? 1.2 : 1 }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="cursor-pointer"
      style={{
        transform: 'translate(-50%, -100%)',
      }}
    >
      {/* Marker Pin */}
      <div className="relative">
        {/* Shadow */}
        <div
          className="absolute top-2 left-1/2 transform -translate-x-1/2"
          style={{
            width: '20px',
            height: '8px',
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '50%',
            filter: 'blur(4px)',
          }}
        />
        
        {/* Pin Body */}
        <div
          className="relative"
          style={{
            width: '40px',
            height: '40px',
            background: markerColor,
            borderRadius: '50% 50% 50% 0',
            transform: 'rotate(-45deg)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            border: '3px solid white',
          }}
        >
          {/* Viewpoint Icon */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ transform: 'rotate(45deg)' }}
          >
            <MapPin size={20} className="text-white" fill="currentColor" />
          </div>
        </div>
        
        {/* Pulse Animation for Selected */}
        {isSelected && (
          <motion.div
            className="absolute top-0 left-1/2 transform -translate-x-1/2"
            style={{
              width: '40px',
              height: '40px',
              background: markerColor,
              borderRadius: '50%',
              opacity: 0.3,
            }}
            animate={{
              scale: [1, 1.5, 1.5],
              opacity: [0.3, 0, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default MapMarker;
