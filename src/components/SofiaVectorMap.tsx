// SofiaMap.tsx
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";
import customIconUrl from '../assets/storeIcon.png';
import axios from 'axios';

interface Shop{
  id: number;
  name: string;
  rating: number;
  image: string;
  description: string;
  latitude: number;
  longitude: number;
}

interface Props {
  handleShopClick: (shopId: number) => void;
  clickedMapShopId: number | undefined;
}

const SofiaMap: React.FC<Props> = ({handleShopClick, clickedMapShopId }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);

  useEffect(() => {
    if (mapContainer.current && !mapRef.current) {
      mapRef.current = L.map(mapContainer.current).setView([42.69, 23.35], 13);

      new MaptilerLayer({
        apiKey: 'dJS38j47jXwMgeCxB2ha',
        styleUrl: 'https://api.maptiler.com/maps/5361eb74-ae67-4d68-aa6f-bed66c17018c/style.json?key=dJS38j47jXwMgeCxB2ha'
      }).addTo(mapRef.current);
    }
  }, []);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axios.get('https://localhost:7218/api/Shop');

        setShops(response.data);
      } catch (error: any) {
        console.error('Error fetching cards:', error.message);
      }
    };

    fetchShops();
  }, []);


  useEffect(() => {
    if (mapRef.current && shops && shops.length > 0) {
      mapRef.current.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          mapRef.current?.removeLayer(layer);
        }
      });

      shops.forEach(({ id, name, image, description, latitude, longitude }) => {
        const customIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="color: black; ${id === clickedMapShopId ? 'border-radius: 50px; background: blue; font-size: 30px;' : ''}">
                    <img src="${customIconUrl}" alt="Icon" style="width: 50px; height: 50px;">
                    <div id="custom-icon-${id}" style="text-align: center; font-size: 15px; font-weight: bold; margin-top: -10px; background-color: lime; border-radius: 20px; border: 1px solid black;">5/5</div>
                 </div>`,
          iconSize: [50, 50],
          iconAnchor: [25, 50],
        });

        const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(mapRef.current!);

        marker.on('click', () => {
          handleShopClick(id); //To be optimized (passing only the Id and fetching same data again, that we already got fetched)
        });

        marker.on('mouseover', () => {
          //implement shop info bubble
        });
        
        if (id === clickedMapShopId) {
          mapRef.current?.setView([latitude, longitude + 0.06], 13); // To be optimized. It's hardcoded for now.
        }
      });
    }
  }, [shops, handleShopClick, clickedMapShopId]);

  return (
    <div ref={mapContainer} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
    </div>
  );
};

export default SofiaMap;
