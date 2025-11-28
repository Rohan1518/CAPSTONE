import React, { useState, useEffect } from 'react';
import { useMap } from 'react-leaflet'; // Hook to access the map instance
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css'; // Import geosearch CSS
import '../../styles/globals.css';

// Component to integrate leaflet-geosearch with react-leaflet
const LeafletGeoSearch = ({ onLocationFound }) => {
  const map = useMap(); // Get the map instance from the parent MapContainer

  useEffect(() => {
    const provider = new OpenStreetMapProvider(); // Use OpenStreetMap for geocoding

    const searchControl = new GeoSearchControl({
      provider: provider,
      style: 'bar', // Use 'bar' style for integration
      showMarker: true, // Show marker on map after search
      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: true, // Keep the marker
      searchLabel: 'Enter address or city...'
    });

    map.addControl(searchControl); // Add the control to the map

    // Listen for the result selection event
    const handleResult = (data) => {
        console.log('Geosearch result:', data);
        if (data.location && onLocationFound) {
            // Pass lat/lng up (or just the label)
            onLocationFound(data.location.label, data.location.y, data.location.x);
            // Fly map to the result
            map.flyTo([data.location.y, data.location.x], 13); // Zoom level 13
        }
    };
    map.on('geosearch/showlocation', handleResult);


    // Cleanup function to remove the control and listener when component unmounts
    return () => {
      map.removeControl(searchControl);
      map.off('geosearch/showlocation', handleResult);
    };
  }, [map, onLocationFound]); // Re-run if map instance or handler changes

  return null; // This component doesn't render anything itself
};


// Main Search Bar Component
const ComponentSearch = ({ onSearch }) => {
    // Local state for the "What?" input field
    const [what, setWhat] = useState('');
    // State to store the label/coords from geosearch
    const [whereLabel, setWhereLabel] = useState('');
    const [whereCoords, setWhereCoords] = useState(null); // { lat: number, lng: number }
    const [category, setCategory] = useState(''); // New state for category

     // This function is passed to LeafletGeoSearch
     const handleLocationFound = (label, lat, lng) => {
        setWhereLabel(label); // Store the label from geosearch
        setWhereCoords({ lat, lng });
        // Optionally trigger search immediately or wait for button click
        // For now, let's wait for the button click
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };


    const onSubmit = (e) => {
        e.preventDefault();
        // Pass "what" term, "where" label, and "category" to the parent
        onSearch(what, whereLabel, category);
    };

    // Note: The actual geosearch input bar will be rendered by LeafletGeoSearch on the map
    // We keep the "What?" input and the Search button here.

    return (
        <div className="search-container" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             {/* "What?" Input */}
             <form onSubmit={onSubmit} style={{ display: 'contents' }}> {/* Use display:contents to avoid extra div */}
                <div className="form-group" style={{ flexGrow: 1, marginBottom: 0 }}>
                    <label htmlFor="searchTerm">What?</label>
                    <input
                        type="text"
                        id="searchTerm"
                        name="searchTerm"
                        value={what}
                        onChange={(e) => setWhat(e.target.value)}
                        placeholder="e.g., Battery, Repair"
                    />
                </div>

                {/* Category Dropdown */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="category">Category</label>
                    <select id="category" value={category} onChange={handleCategoryChange}>
                        <option value="">All</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Batteries">Batteries</option>
                        <option value="Appliances">Appliances</option>
                        <option value="Light Bulbs">Light Bulbs</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                {/* Submit Button */}
                <button type="submit" style={{ width: 'auto', alignSelf: 'flex-end', padding: '0.85rem 1.5rem' }}>
                    Filter Results
                </button>
             </form>
             {/* The "Where?" input is now handled by LeafletGeoSearch on the map */}
             {/* We store 'whereLabel' to pass to the backend if needed */}
        </div>
    );
};

// We need to export both components
export { ComponentSearch, LeafletGeoSearch };