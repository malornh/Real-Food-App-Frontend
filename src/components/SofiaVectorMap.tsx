import { useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";
import customIconUrl from '../assets/storeIcon.png';

interface Coordinate {
  lat: number;
  lng: number;
}

interface Props {
  initialCoordinates?: Coordinate[];
}

const SofiaMap = ({ initialCoordinates }: Props) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (mapContainer.current) {
      const map = L.map(mapContainer.current).setView([42.6977, 23.3219], 13);

      new MaptilerLayer({
        apiKey: 'dJS38j47jXwMgeCxB2ha',
        styleUrl: 'https://api.maptiler.com/maps/5361eb74-ae67-4d68-aa6f-bed66c17018c/style.json?key=dJS38j47jXwMgeCxB2ha'
      }).addTo(map);

      if (initialCoordinates && initialCoordinates.length > 0) {
        initialCoordinates.forEach(({ lat, lng }) => {
          // Create a custom DivIcon with the text label
          const customIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="color: black;">
                      <img src="${customIconUrl}" alt="Icon" style="width: 50px; height: 50px;">
                      <div style="text-align: center; font-size: 15px; font-weight: bold; margin-top: -10px; background-color: lime; border-radius: 20px; border: 1px solid black;">5/5</div>
                   </div>`,
            iconSize: [50, 50], // Adjust the size of the icon and text container
            iconAnchor: [25, 50], // Adjust the anchor point to position the icon and text correctly
          });
      
          // Create a marker with the custom DivIcon
          L.marker([lat, lng], { icon: customIcon }).addTo(map);
        });
      }
      

      return () => {
        map.remove(); // Cleanup the map instance when the component unmounts
      };
    }
  }, [initialCoordinates]); // Add initialCoordinates to the dependency array to update markers when it changes

  return (
      <div ref={mapContainer} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
    </div>
)};

export default SofiaMap;
