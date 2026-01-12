import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation, Loader } from 'lucide-react';

const LocateMeButton = ({ onLocationFound, onError }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLocate = () => {
    if (!navigator.geolocation) {
      onError?.('הדפדפן שלך לא תומך במיקום GPS');
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        setIsLoading(false);
        onLocationFound([longitude, latitude]);
      },
      (error) => {
        setIsLoading(false);
        let errorMessage = 'לא ניתן לקבוע מיקום';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'גישה למיקום נדחתה. אנא אפשר גישה בהגדרות הדפדפן.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'מידע על המיקום לא זמין.';
            break;
          case error.TIMEOUT:
            errorMessage = 'בקשת המיקום פגה. נסה שוב.';
            break;
        }
        
        onError?.(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <motion.button
      onClick={handleLocate}
      disabled={isLoading}
      className="absolute bottom-24 left-4 z-20 btn-icon"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title="מצא אותי"
    >
      {isLoading ? (
        <Loader size={24} className="text-orange-500 animate-spin" />
      ) : (
        <Navigation size={24} className="text-orange-500" />
      )}
    </motion.button>
  );
};

export default LocateMeButton;
