import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Leaflet's default icon breaks when used with webpack, so we fix it
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const LocationPicker = ({ onLocationSelect }) => {
  const [position, setPosition] = useState([51.505, -0.09]); // Default position
  const [markerPosition, setMarkerPosition] = useState(null);

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPosition(e.latlng);
        onLocationSelect({ latitude: lat, longitude: lng });
      },
    });
    return null;
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <p>
        <strong>Set Shop Location:</strong> Click on the map to place a marker at your shop's address.
      </p>
      <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapEvents />
        {markerPosition && (
          <Marker position={markerPosition}>
            <Popup>Shop Location</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default LocationPicker;
