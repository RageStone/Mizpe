import { Heart } from 'lucide-react';

const TopBar = ({ savedCount }) => {
  return (
    <div className="fixed top-0 left-0 right-0 glass border-b border-gray-200 z-20 safe-area-inset-top">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-orange-500">Vista</h1>
        </div>
        <div className="flex items-center gap-2 badge badge-primary">
          <Heart size={18} fill="currentColor" />
          <span className="font-bold text-sm">{savedCount}</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;

