import React, { useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";
import { Box } from '@chakra-ui/react';

interface Props {
  lat: number;
  long: number;
  outLat: (lat: number)=>void;
  outLong: (long: number)=>void;
}

const MapComponent: React.FC<Props> = ({ lat, long, outLat, outLong }: Props) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (mapContainer.current && !mapRef.current) {
      mapRef.current = L.map(mapContainer.current).setView([lat, long], 13);

      new MaptilerLayer({
        apiKey: 'dJS38j47jXwMgeCxB2ha',
        styleUrl: 'https://api.maptiler.com/maps/5361eb74-ae67-4d68-aa6f-bed66c17018c/style.json?key=dJS38j47jXwMgeCxB2ha'
      }).addTo(mapRef.current);

      // Add initial marker
      markerRef.current = L.marker([lat, long]).addTo(mapRef.current);
      console.log('Initial marker added');

      // Add click event listener to the map
      mapRef.current.on('click', (event: L.LeafletMouseEvent) => {
        const { lat, lng } = event.latlng;
        markerRef.current?.setLatLng([lat, lng]);
        outLat(lat);
        outLong(lng);
        console.log('Marker position updated', { lat, lng });
      });
    }
  },[]);

  return (
    <Box  mt={0} ref={mapContainer} style={{width: '370px', height: '260px', borderRadius: '10px', marginLeft: "16px" }}>
    </Box>
  );
};

export default MapComponent;
