# Vista - Travel Discovery App

A mobile-first MVP for discovering viewpoints and trips in Israel with a Tinder-like swipe interface.

## Features

- 🎴 **Swipe Discovery**: Swipe right to save, left to skip, up for details
- 🗺️ **Smart Map**: Interactive map with color-coded markers (Green=Recommended, Yellow=Caution, Red=Not Recommended)
- 📍 **POI Preview**: Click markers to see quick preview cards with status and navigation
- 🔍 **Advanced Filtering**: Filter by Nearby, Accessible, Wow Scenery, Family Friendly, and Safe to Visit
- 🔎 **Search**: Search places by name, location, or tags
- 📍 **GPS Location**: Locate me button to center map on your position
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
- Mapbox GL (react-map-gl) - Interactive maps

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up Mapbox API key:
   - Sign up for a free account at [mapbox.com](https://www.mapbox.com)
   - Get your Access Token from the [Mapbox account page](https://account.mapbox.com/access-tokens/)
   - Create a `.env` file in the root directory:
   ```bash
   VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
   ```
   - Copy `.env.example` to `.env` and add your token (or create `.env` manually)

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173` (or the port shown in terminal)

## Project Structure

```
src/
├── components/
│   ├── SwipeCard.jsx          # Individual swipeable card
│   ├── SwipeDiscovery.jsx     # Main discovery screen with card stack
│   ├── PlaceDetailsSheet.jsx  # Bottom sheet with full details
│   ├── MapView.jsx            # Main map component
│   ├── MapMarker.jsx          # Custom color-coded map markers
│   ├── POIPreviewCard.jsx     # Preview card for selected place
│   ├── MapFilterBar.jsx       # Map filter chips
│   ├── MapSearchBar.jsx       # Search input with dropdown
│   ├── LocateMeButton.jsx     # GPS location button
│   ├── BottomNav.jsx          # Bottom navigation bar
│   └── TopBar.jsx             # Top bar with logo and saved count
├── config/
│   └── mapConfig.js           # Map configuration and utilities
├── data/
│   └── mockPlaces.js          # Sample location data with coordinates
├── App.jsx                     # Main app component
├── main.jsx                    # Entry point
└── index.css                   # Global styles
```

## Usage

### Discovery Screen
- **Swipe Right**: Save place to favorites
- **Swipe Left**: Skip place
- **Swipe Up**: View full details
- **Tap Buttons**: Use bottom action buttons for quick actions

### Map Screen
- **Click Marker**: View POI preview card
- **Filter Chips**: Filter places by category
- **Search Bar**: Search by name, location, or tags
- **Locate Me**: Center map on your GPS location
- **POI Preview**: Tap "פרטים" for full details or "נווט" to navigate

## Mobile-First Design

The app is optimized for mobile devices with:
- Fixed viewport height
- Touch-friendly swipe gestures
- Bottom sheet navigation
- RTL Hebrew support

## License

MIT

