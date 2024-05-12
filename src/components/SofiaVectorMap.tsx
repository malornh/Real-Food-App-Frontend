// SofiaMap.tsx
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";
import customIconUrl from '../assets/storeIcon.png';

interface Coordinate {
  id: number;
  lat: number;
  lng: number;
}

interface Props {
  initialCoordinates?: Coordinate[];
  handleShopClick: (shopId: number) => void;
  markerClicked: boolean; // State variable to trigger re-render
}

const SofiaMap: React.FC<Props> = ({ initialCoordinates, handleShopClick, markerClicked }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapContainer.current && !mapRef.current) {
      mapRef.current = L.map(mapContainer.current).setView([42.6977, 23.3219], 13);

      new MaptilerLayer({
        apiKey: 'dJS38j47jXwMgeCxB2ha',
        styleUrl: 'https://api.maptiler.com/maps/5361eb74-ae67-4d68-aa6f-bed66c17018c/style.json?key=dJS38j47jXwMgeCxB2ha'
      }).addTo(mapRef.current);
    }
  }, []);

  useEffect(() => {
    if (mapRef.current && initialCoordinates && initialCoordinates.length > 0) {
      mapRef.current.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          mapRef.current?.removeLayer(layer);
        }
      });

      initialCoordinates.forEach(({ id, lat, lng }) => {
        const customIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="color: black;">
                    <img src="${customIconUrl}" alt="Icon" style="width: 50px; height: 50px;">
                    <div id="custom-icon-${id}" style="text-align: center; font-size: 15px; font-weight: bold; margin-top: -10px; background-color: lime; border-radius: 20px; border: 1px solid black;">5/5</div>
                 </div>`,
          iconSize: [50, 50],
          iconAnchor: [25, 50],
        });

        const marker = L.marker([lat, lng], { icon: customIcon }).addTo(mapRef.current!);

        marker.on('click', () => {
          handleShopClick(id);
        });
      });
    }
  }, [initialCoordinates, handleShopClick, markerClicked]);

  return (
    <div ref={mapContainer} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
    </div>
  );
};

export default SofiaMap;
