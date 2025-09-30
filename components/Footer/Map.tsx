'use client';

import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';



const Map = () => {
  useEffect(() => {
    const map = L.map('map').setView([15.318083, 120.905708], 10);

    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution:''
    }).addTo(map);

    L.marker([15.318083, 120.905708])
      .addTo(map)
      .bindPopup('Shop Location')
      .openPopup();

    return () => {
      map.remove(); 
    };
  }, []);

  return (
    <div
      id="map"
      style={{
        height: '400px',
        width: '400px',
        maxHeight:'400px',
        maxWidth:'400px',
        borderRadius: '5px',
      }}
    />
  );
};

export default Map;
