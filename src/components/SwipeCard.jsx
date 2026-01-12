import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring, useAnimation, useMotionValueEvent } from 'framer-motion';
import { Car, Accessibility, Trash2, Droplet } from 'lucide-react';

const SwipeCard = ({ place, index, onSwipe, onSwipeUp, topCardX, onTopCardXChange, direction = 0 }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isSnappingBack, setIsSnappingBack] = useState(false);
  
  // Motion values for drag - use raw values for immediate response
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  
  // Spring physics for snap-back - optimized for smooth return
  const xSpring = useSpring(x, { stiffness: 500, damping: 30 });
  const ySpring = useSpring(y, { stiffness: 500, damping: 30 });
  
  // Always use raw x for rotation - immediate response, no lag
  // Rotation formula: rotation = x / 20 (e.g., 200px = 10°)
  const rotate = useTransform(x, (latest) => latest / 20);
  
  // Opacity for exit animation
  const opacity = useMotionValue(1);
  
  // Default motion value if topCardX is not provided - always create it
  const defaultTopCardX = useMotionValue(0);
  const activeTopCardX = topCardX || defaultTopCardX;
  
  // Always use useTransform for scale to maintain hook order
  // For top card (index === 0), always return 1
  // For cards underneath, scale from 0.95 to 1.0 based on top card's distance
  const scale = useTransform(
    activeTopCardX,
    (latest) => {
      if (index === 0) return 1;
      const distance = Math.abs(latest);
      const maxDistance = 150; // Threshold distance
      const scaleProgress = Math.min(distance / maxDistance, 1);
      return 0.95 + (scaleProgress * 0.05); // Scale from 0.95 to 1.0
    }
  );
  
  // Always use useTransform for blur to maintain hook order
  // Top card (index === 0) NEVER gets blur - always return no blur
  // Cards underneath blur from 2px to 0px based on top card's distance
  const blurValue = useTransform(
    activeTopCardX,
    (latest) => {
      if (index === 0) return 'blur(0px)'; // Top card is never blurred
      const distance = Math.abs(latest);
      const maxDistance = 150;
      const blurProgress = Math.min(distance / maxDistance, 1);
      return `blur(${(1 - blurProgress) * 2}px)`;
    }
  );
  
  // Adjust yOffset to position cards higher (ending at red line position)
  // Cards should end above action buttons, so we use negative offset for top card
  const yOffset = index === 0 ? -60 : (index * 8 - 60);
  const zIndex = 10 - index;
  
  // Combine yOffset with drag y position for top card
  const yWithOffset = useTransform(ySpring, (latest) => yOffset + latest);
  const yWithOffsetRaw = useTransform(y, (latest) => yOffset + latest);

  const controls = useAnimation();
  
  // Expose x position to parent for cards underneath to react to
  // Always use raw x for immediate updates
  useMotionValueEvent(x, 'change', (latest) => {
    if (index === 0 && onTopCardXChange) {
      onTopCardXChange(latest);
    }
  });
  
  // Calculate label opacity based on x position (linear fade-in)
  // Use raw x for immediate feedback
  const likeOpacity = useTransform(x, (latest) => {
    if (latest < 0) return 0;
    return Math.min(Math.abs(latest) / 150, 1);
  });
  
  const nopeOpacity = useTransform(x, (latest) => {
    if (latest > 0) return 0;
    return Math.min(Math.abs(latest) / 150, 1);
  });

  const handleDragEnd = async (event, info) => {
    const { offset, velocity } = info;
    const threshold = 150; // Exit threshold in pixels
    
    // Check for swipe up first - card should NOT move, just open info sheet
    if (Math.abs(offset.y) > 100 && offset.y < 0 && Math.abs(offset.x) < 80) {
      setIsDragging(false);
      setIsSnappingBack(true);
      
      // Get current position for smooth snap-back
      const currentX = x.get();
      const currentY = y.get();
      const currentRotate = currentX / 20;
      
      // Snap back to center smoothly without exiting
      await controls.start({
        x: 0,
        y: yOffset,
        rotate: 0,
        transition: {
          type: "spring",
          stiffness: 600,
          damping: 45,
          mass: 0.4
        }
      });
      
      // Reset motion values
      x.set(0);
      y.set(0);
      opacity.set(1);
      controls.set({ x: 0, y: yOffset, rotate: 0 });
      setIsSnappingBack(false);
      
      // Notify parent that card is back at center
      if (onTopCardXChange) {
        onTopCardXChange(0);
      }
      
      // Open info sheet without moving the card
      onSwipeUp();
      return;
    }
    
    // Check if card crossed threshold
    if (Math.abs(offset.x) > threshold) {
      const direction = offset.x > 0 ? 1 : -1;
      const exitX = direction * 1000; // Exit to at least +/- 1000px
      
      // Maintain velocity carry-over - use velocity to determine final position
      const velocityMultiplier = Math.abs(velocity.x) * 0.1;
      const finalX = exitX + (direction * velocityMultiplier);
      
      // Get current position from drag to ensure smooth transition
      const currentX = x.get();
      const currentY = y.get();
      const currentRotate = currentX / 20;
      
      // Set controls to current position BEFORE setting isExiting
      // This ensures smooth transition from drag to exit animation
      controls.set({
        x: currentX,
        y: currentY,
        rotate: currentRotate,
        opacity: opacity.get()
      });
      
      setIsDragging(false);
      setIsExiting(true);
      
      // Exit animation with velocity carry-over - starts from current position
      await controls.start({
        x: finalX,
        y: yOffset,
        rotate: direction * (Math.abs(finalX) / 20), // Increase rotation during exit
        opacity: 0,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 20,
          velocity: velocity.x
        }
      });
      
      onSwipe(direction > 0 ? 'right' : 'left');
      // Don't reset motion values here - let the card stay at exit position until removed
      // The parent component will handle removing the card from the DOM
      setIsExiting(false);
    } else {
      // Spring back to center - use controls for explicit animation
      setIsDragging(false);
      setIsSnappingBack(true);
      
      // Get current x position for smooth animation start
      const currentX = x.get();
      const currentRotate = currentX / 20;
      
      // Use controls to animate back to center with proper spring physics
      await controls.start({
        x: 0,
        y: yOffset,
        rotate: 0,
        transition: {
          type: "spring",
          stiffness: 600,
          damping: 45,
          mass: 0.4
        }
      });
      
      // Reset motion values after animation completes
      x.set(0);
      y.set(0);
      opacity.set(1);
      
      // Reset controls to prevent interference
      controls.set({ x: 0, y: yOffset, rotate: 0 });
      setIsSnappingBack(false);
      
      // Immediately notify parent that card is back at center (for cards underneath)
      if (onTopCardXChange) {
        onTopCardXChange(0);
      }
    }
  };

  const getIconColor = (hasFeature) => 
    hasFeature ? 'text-green-600' : 'text-gray-400';

  // Only allow dragging for the top card (index === 0)
  const dragEnabled = index === 0 && !isExiting;

  return (
    <motion.div
      className="absolute w-full h-full"
      style={{ 
       
        // For top card: use raw x during drag, spring for snap-back when not animating
        // For cards underneath: no x movement
        x: index === 0 ? (isDragging ? x : (isSnappingBack || isExiting ? undefined : xSpring)) : 0,
        y: index === 0 ? (isDragging ? yWithOffsetRaw : (isSnappingBack || isExiting ? undefined : yWithOffset)) : yOffset,
        rotate: index === 0 ? (isDragging ? rotate : (isSnappingBack || isExiting ? undefined : rotate)) : 0,
        opacity: index === 0 ? opacity : 1,
        // Top card uses animate prop for scale (smooth transition from 0.95 to 1)
        // Cards underneath use reactive scale based on topCardX
        scale: index === 0 ? undefined : scale,
        zIndex: isExiting ? 0 : zIndex,
        // Top card NEVER gets blur - always sharp
        // Cards underneath get blur based on top card position
        filter: index === 0 ? 'blur(0px)' : blurValue,
        transformOrigin: 'bottom center', // Rotate from bottom center
        cursor: dragEnabled ? 'grab' : 'default',
        willChange: index === 0 && (isDragging || isSnappingBack) ? 'transform' : 'auto'
      }}
      animate={isSnappingBack || isExiting ? controls : (index === 0 ? { y: yOffset, scale: 1, opacity: 1 } : undefined)}
      drag={dragEnabled ? true : false}
      dragConstraints={false} // Remove constraints to prevent bouncing
      dragElastic={0.1} // Small elastic for natural feel without bouncing
      dragMomentum={false} // Disable momentum for more control
      onDragStart={() => {
        if (index === 0) {
          setIsDragging(true);
        }
      }}
      onDrag={(e, info) => {
        if (index === 0) {
          x.set(info.offset.x);
          y.set(info.offset.y);
        }
      }}
      onDragEnd={index === 0 ? async (e, info) => {
        await handleDragEnd(e, info);
      } : undefined}
      whileDrag={index === 0 ? { 
        scale: 1.02,
        zIndex: 100,
        cursor: 'grabbing'
      } : {}}
      initial={{ 
        opacity: index === 0 ? 0 : 1,
        // Start from 0.95 instead of 0.9 when direction is set (card was underneath)
        // This prevents the snap-back animation when transitioning from index 1 to 0
        scale: index === 0 ? (direction !== 0 ? 0.95 : 0.9) : 0.95,
        y: index === 0 ? (direction === 1 ? -100 : direction === -1 ? 100 : -60) : yOffset,
        x: index === 0 ? (direction === 1 ? 300 : direction === -1 ? -300 : 0) : 0,
        filter: 'blur(0px)' // Never start blurred - blur is handled by transform
      }}
      layout
      exit={index === 0 ? {
        opacity: 0,
        scale: 0.8,
        x: direction === 1 ? 1000 : direction === -1 ? -1000 : 0,
        rotate: direction === 1 ? 30 : direction === -1 ? -30 : 0,
        transition: {
          duration: 0.3,
          ease: "easeInOut"
        }
      } : undefined}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 0.7
      }}
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl gradient-primary">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-gray-300"
          style={{ backgroundImage: `url(${place.image_url})` }}
        >
          <div className="absolute inset-0 gradient-overlay" />
        </div>

        {/* Live Status Badge */}
        {place.liveStatus && (
          <div className={`absolute top-4 right-4 badge z-20 glass-dark text-white ${
            place.liveStatus.type === 'success' ? 'bg-green-500/90' :
            place.liveStatus.type === 'warning' ? 'bg-yellow-500/90' :
            'bg-red-500/90'
          }`}>
            {place.liveStatus.text}
          </div>
        )}

        {/* Utility Overlay - Distance & Travel Time */}
        {place.distance && (
          <div className="absolute top-4 left-4 px-3 py-2 rounded-xl glass-dark text-white z-20">
            <div className="text-sm font-bold">{place.distance} ק״מ</div>
            <div className="text-xs opacity-90 font-normal">{place.travelTime}</div>
          </div>
        )}

        {/* Content */}
        {/* Bottom padding ensures content (tags/name) ends above action buttons */}
        {/* Increased padding to prevent overlap with action buttons below */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          {/* Quick Action Icons */}
          <div className="flex gap-3 mb-4">
            <div className={`p-2 rounded-full glass-dark ${getIconColor(place.hasCarAccess)}`}>
              <Car size={20} />
            </div>
            <div className={`p-2 rounded-full glass-dark ${getIconColor(place.isAccessible)}`}>
              <Accessibility size={20} />
            </div>
            <div className={`p-2 rounded-full glass-dark ${getIconColor(place.hasTrashBins)}`}>
              <Trash2 size={20} />
            </div>
            <div className={`p-2 rounded-full glass-dark ${getIconColor(place.hasWater)}`}>
              <Droplet size={20} />
            </div>
          </div>

          {/* Title and Location */}
          <h2 className="text-3xl font-black mb-2">{place.name}</h2>
          <p className="text-lg opacity-90 font-medium">{place.location}</p>

          {/* Tags */}
          <div className="flex gap-2 mt-4 flex-wrap">
            {place.tags.map((tag, idx) => (
              <span 
                key={idx}
                className="tag tag-orange"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* LIKE / NOPE Labels - Linear fade-in based on drag distance */}
        {index === 0 && (
          <>
            <motion.div
              className="absolute top-8 right-8 px-6 py-4 rounded-2xl bg-green-500/95 backdrop-blur-md text-white font-black text-2xl border-4 border-white/30 shadow-2xl"
              style={{ opacity: likeOpacity }}
            >
              LIKE
            </motion.div>
            <motion.div
              className="absolute top-8 left-8 px-6 py-4 rounded-2xl bg-red-500/95 backdrop-blur-md text-white font-black text-2xl border-4 border-white/30 shadow-2xl"
              style={{ opacity: nopeOpacity }}
            >
              NOPE
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default SwipeCard;

