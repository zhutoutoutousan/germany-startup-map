# Map Functionality Setup

## Overview

The platform now includes interactive maps powered by Leaflet.js showing:
- Business locations on the homepage and businesses page
- Real estate property locations on the real estate page

## Features

✅ **Interactive Maps** - Click and drag to explore
✅ **Markers** - Each business/property is marked on the map
✅ **Popups** - Click markers to see details
✅ **Auto-fit** - Map automatically adjusts to show all markers
✅ **Responsive** - Works on all device sizes

## How It Works

1. Maps are loaded dynamically using Leaflet.js (no build-time dependencies)
2. Markers are created from businesses/properties that have `latitude` and `longitude` coordinates
3. The map automatically centers and zooms to show all markers

## Adding Coordinates to Your Data

To show items on the map, make sure your database records have:
- `latitude` (decimal, e.g., 52.52 for Berlin)
- `longitude` (decimal, e.g., 13.405 for Berlin)

### Example SQL to add coordinates:

```sql
-- Update a business with coordinates
UPDATE businesses 
SET 
  latitude = 52.5200,
  longitude = 13.4050
WHERE id = 'your-business-id';

-- Update a property with coordinates
UPDATE real_estate 
SET 
  latitude = 52.5200,
  longitude = 13.4050
WHERE id = 'your-property-id';
```

## Getting Coordinates

You can get coordinates from:
- Google Maps: Right-click a location → "What's here?" → Copy coordinates
- OpenStreetMap: Click a location → Copy coordinates from URL
- Geocoding API: Convert addresses to coordinates

## Customization

The map component is located at `components/map/Map.tsx`. You can customize:
- Default center location
- Default zoom level
- Map tile provider (currently using OpenStreetMap)
- Marker icons
- Popup content

## Troubleshooting

**Maps not showing?**
- Check browser console for errors
- Ensure Leaflet CSS/JS are loading (check Network tab)
- Verify coordinates are valid numbers

**Markers not appearing?**
- Verify `latitude` and `longitude` are set in database
- Check that coordinates are valid (latitude: -90 to 90, longitude: -180 to 180)
- Ensure data is being fetched correctly
