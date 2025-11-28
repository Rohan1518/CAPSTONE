import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import locationService from '../../services/api/locationService';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- Icon Fix (Standard) ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
});
L.Marker.prototype.options.icon = DefaultIcon;
// --- End Icon Fix ---


// --- Helper Component to add GeoSearch bar ---
const GeoSearch = () => {
    const map = useMap(); // Get map instance from parent
    useEffect(() => {
        const provider = new OpenStreetMapProvider();
        const searchControl = new GeoSearchControl({
            provider: provider,
            style: 'bar',
            showMarker: true,
            showPopup: false,
            autoClose: true,
            retainZoomLevel: false,
            animateZoom: true,
            keepResult: true,
            searchLabel: 'Enter address or city...'
        });
        map.addControl(searchControl);
        
        // When user selects a location, just fly there.
        // The 'moveend' event will trigger the data fetch.
        const handleResult = (data) => {
            map.flyTo([data.location.y, data.location.x], 13);
        };
        map.on('geosearch/showlocation', handleResult);

        return () => { // Cleanup
             map.removeControl(searchControl);
             map.off('geosearch/showlocation', handleResult);
        };
    }, [map]);
    return null; // This component renders the control, not an element
};

// --- Helper Component to listen for map movements ---
const MapEvents = ({ onBoundsChange }) => {
    const map = useMapEvents({
        // Fired on initial load and when user finishes panning/zooming
        moveend: () => {
            const bounds = map.getBounds();
            // Convert bounds to string: "lng,lat,lng,lat"
            const boundsString = `${bounds.getSouthWest().lng},${bounds.getSouthWest().lat},${bounds.getNorthEast().lng},${bounds.getNorthEast().lat}`;
            onBoundsChange(boundsString); // Send new bounds up to parent
        },
    });
    return null; // No visible element
};

// --- Main Map Component ---
const LocationMap = ({ searchTerm, category, onMapBoundsChange }) => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true); // Start loading true on initial load
    const [error, setError] = useState('');
    
    // This state is internal to the map: it holds the *current* bounds
    const [currentBounds, setCurrentBounds] = useState(null);

    const defaultPosition = [20.5937, 78.9629]; // India center [lat, lng]
    const defaultZoom = 5;

    // This effect fetches data whenever the text search or map bounds change
    useEffect(() => {
        // Don't fetch until the map has loaded and set its first bounds
        if (!currentBounds) {
            setLoading(false); // Not loading if we don't have bounds yet
            return;
        }

        const fetchLocations = async () => {
            try {
                setLoading(true);
                const data = await locationService.getLocations(searchTerm, currentBounds, category);
                setLocations(data.data.locations || []);
                setError('');
            } catch (err) {
                setError('Failed to load locations.');
                console.error("Fetch Location Error:", err);
            } finally {
                setLoading(false);
            }
        };

        // Use a timeout to "debounce" fetching, so it doesn't fire 100x
        // while user is still moving the map
        const timer = setTimeout(() => {
             fetchLocations();
        }, 500); // Wait 500ms after user stops moving to fetch

        return () => clearTimeout(timer); // Clear timer if user moves again

    }, [searchTerm, currentBounds, category]); // Re-fetch when text, bounds, or category change

    // This is the function we pass to the MapEvents helper
    const handleBoundsChange = (boundsString) => {
        setCurrentBounds(boundsString);
        // We also pass it up to the parent (Search.js)
        if(onMapBoundsChange) { // Check if function exists
            onMapBoundsChange(boundsString);
        }
    };

    return (
        <MapContainer
            center={defaultPosition}
            zoom={defaultZoom}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* Add the "Where?" search bar to the map */}
            <GeoSearch /> 
            
            {/* Add the event listener for map movement */}
            <MapEvents onBoundsChange={handleBoundsChange} />

            {/* Display Markers */}
            {!loading && locations.map(loc => (
                <Marker
                    key={loc._id}
                    position={[loc.location.coordinates[1], loc.location.coordinates[0]]}
                >
                    <Popup>
                        <b>{loc.name}</b> ({loc.type})<br />
                        {loc.address}
                    </Popup>
                </Marker>
            ))}

             {/* Optional: Show loading/error state as an overlay */}
             {loading && <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.5)', zIndex: 1001, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Loading...</div>}
             {error && <div style={{position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', zIndex: 1001, background: 'red', color: 'white', padding: '10px', borderRadius: '5px'}}>{error}</div>}
        </MapContainer>
    );
};

export default LocationMap;