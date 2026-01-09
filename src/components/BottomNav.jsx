import { Compass, Map, Heart, User } from 'lucide-react';

const BottomNav = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'discovery', icon: Compass, label: 'גילוי' },
    { id: 'map', icon: Map, label: 'מפה' },
    { id: 'favorites', icon: Heart, label: 'מועדפים' },
    { id: 'profile', icon: User, label: 'פרופיל' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-gray-200 z-30 safe-area-inset-bottom">
      <div className="flex justify-around items-center h-16 px-2">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`nav-item flex-1 h-full ${
              activeTab === id 
                ? 'nav-item-active' 
                : 'nav-item-inactive'
            }`}
          >
            <Icon size={24} />
            <span className="text-xs font-semibold">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;

