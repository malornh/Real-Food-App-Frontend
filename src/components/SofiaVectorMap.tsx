import { useRef, useEffect } from 'react';
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
  handleShopClick: (shopId: number)=>void;
  initialCoordinates?: Coordinate[];
}

const SofiaMap = ({ initialCoordinates, handleShopClick }: Props) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null); // Updated type to allow null

  useEffect(() => {
    if (mapContainer.current && !mapRef.current) {
      // Initialize the map instance only once
      mapRef.current = L.map(mapContainer.current).setView([42.6977, 23.3219], 13);

      new MaptilerLayer({
        apiKey: 'dJS38j47jXwMgeCxB2ha',
        styleUrl: 'https://api.maptiler.com/maps/5361eb74-ae67-4d68-aa6f-bed66c17018c/style.json?key=dJS38j47jXwMgeCxB2ha'
      }).addTo(mapRef.current);
    }
  }, []);

  useEffect(() => {
    if (mapRef.current && initialCoordinates && initialCoordinates.length > 0) {
      // Clear existing markers
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

        const marker = L.marker([lat, lng], { icon: customIcon }).addTo(mapRef.current!); // Assert non-null

        marker.on('click', () => {
          handleShopClick(id);
        });
      });
    }
  }, [initialCoordinates, handleShopClick]);

  return (
    <div ref={mapContainer} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
    </div>
  );
};

export default SofiaMap;