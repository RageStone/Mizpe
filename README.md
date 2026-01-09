# Vista - Travel Discovery App

A mobile-first MVP for discovering viewpoints and trips in Israel with a Tinder-like swipe interface.

## Features

- 🎴 **Swipe Discovery**: Swipe right to save, left to skip, up for details
- 📊 **Multi-Parameter Ratings**: 5 different rating categories (View, Access, Cleanliness, Family Friendly, Quietness)
- 🌤️ **Smart Weather Widget**: Temperature-based recommendations
- 🗺️ **Navigation Integration**: Direct links to Waze/Google Maps
- 💾 **Favorites**: Save and view your favorite places
- 🇮🇱 **Hebrew RTL Support**: Full right-to-left layout support

## Tech Stack

- React 18 (Vite)
- Tailwind CSS
- Framer Motion (animations & gestures)
- Lucide React (icons)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   ├── SwipeCard.jsx          # Individual swipeable card
│   ├── SwipeDiscovery.jsx     # Main discovery screen with card stack
│   ├── PlaceDetailsSheet.jsx  # Bottom sheet with full details
│   ├── BottomNav.jsx          # Bottom navigation bar
│   └── TopBar.jsx             # Top bar with logo and saved count
├── data/
│   └── mockPlaces.js          # Sample location data
├── App.jsx                     # Main app component
├── main.jsx                    # Entry point
└── index.css                   # Global styles
```

## Usage

- **Swipe Right**: Save place to favorites
- **Swipe Left**: Skip place
- **Swipe Up**: View full details
- **Tap Buttons**: Use bottom action buttons for quick actions

## Mobile-First Design

The app is optimized for mobile devices with:
- Fixed viewport height
- Touch-friendly swipe gestures
- Bottom sheet navigation
- RTL Hebrew support

## License

MIT

