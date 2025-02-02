// SofiaMap.tsx
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";
import customShopIcon from "../assets/storeIcon.png";
import axios from "axios";
import { Shop } from "./ShopForm/EditShop/EditShop";
import { Farm } from "./FarmForm/EditFarm";
import customFarmIcon from "../assets/farmIcon.png";
import { useContextProvider } from "../ContextProvider";

interface Props {
  updatedShop: Shop | undefined;
  deletedShopId: number | undefined;
  deletedFarmId: number | undefined;
}

const SofiaMap: React.FC<Props> = ({
  updatedShop,
  deletedShopId,
  deletedFarmId,
}) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const { 
    clickedFarmId, 
    setClickedFarmId,
    clickedShopId,
    isDeliveryListOpen,
    isCartFormOpen,
    isFarmFormOpen,
    isShopClicked,
    handleFarmClick,
    handleShopClick,
    setIsFarmFormOpen,
    accountType,
    setShowOrder,
   } = useContextProvider();

  console.log(setClickedFarmId);

  useEffect(() => {
    if (!updatedShop) return; // If updatedShop is undefined, exit the function

    const updatedIndex = shops.findIndex((s) => s.id === updatedShop.id); // Find the index of the shop with the matching id

    if (updatedIndex !== -1) {
      // If shop with updatedShop.id exists in the array
      const updatedShops = [...shops]; // Create a copy of the original array
      updatedShops[updatedIndex].latitude = updatedShop.latitude; // Update the latitude of the shop at the found index
      updatedShops[updatedIndex].longitude = updatedShop.longitude; // Update the longitude of the shop at the found index
      setShops(updatedShops); // Update the state with the new array of shops
    } else {
      // If updatedShop.id doesn't exist in the array, add it as a new shop
      setShops((prevShops) => [...prevShops, updatedShop]);
      {
        updatedShop.id !== undefined && handleShopClick(updatedShop.id);
      }
    }
  }, [updatedShop]);

  useEffect(() => {
    if (!deletedShopId) return; // If deletedShopId is undefined, exit the function

    setShops((prevShops) =>
      prevShops.filter((shop) => shop.id !== deletedShopId)
    );
  }, [deletedShopId]);

  useEffect(() => {
    if (!deletedFarmId) return; // If deletedShopId is undefined, exit the function

    setFarms((prevFarms) =>
      prevFarms.filter((farm) => farm.id !== deletedFarmId)
    );
  }, [deletedFarmId]);

  useEffect(() => {
    if (mapContainer.current && !mapRef.current) {
      mapRef.current = L.map(mapContainer.current).setView([42.69, 23.35], 13);

      new MaptilerLayer({
        apiKey: "dJS38j47jXwMgeCxB2ha",
        styleUrl:
          "https://api.maptiler.com/maps/5361eb74-ae67-4d68-aa6f-bed66c17018c/style.json?key=dJS38j47jXwMgeCxB2ha",
      }).addTo(mapRef.current);
    }
  }, []);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axios.get("https://localhost:7218/api/Shops");

        setShops(response.data);
      } catch (error: any) {
        console.error("Error fetching cards:", error.message);
      }
    };

    fetchShops();
  }, []);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await axios.get("https://localhost:7218/api/Farms");

        setFarms(response.data);
      } catch (error: any) {
        console.error("Error fetching cards:", error.message);
      }
    };

    fetchFarms();
  }, []);

  useEffect(() => {
    if (mapRef.current && shops && shops.length > 0) {
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapRef.current?.removeLayer(layer);
        }
      });

      shops.forEach(({ id, name, photoUrl, description, latitude, longitude }) => {
        const customIcon = L.divIcon({
          className: "custom-div-icon",
          html: `<div style="color: black; ${
            id === clickedShopId
              ? "border-radius: 50px; background: blue; font-size: 30px;"
              : ""
          }">
                    <img src="${customShopIcon}" alt="Icon" style="width: 60px; height: 60px;">
                    <div id="custom-icon-${id}" style="text-align: center; font-size: 15px; font-weight: bold; margin-top: -10px; background-color: lime; border-radius: 20px; border: 1px solid black;">5/5</div>
                 </div>`,
          iconSize: [60, 50],
          iconAnchor: [25, 50],
        });

        const marker = L.marker([latitude, longitude], {
          icon: customIcon,
        }).addTo(mapRef.current!);

        marker.on("click", () => {
          if (id !== undefined) {
           handleShopClick(id);
           setIsFarmFormOpen(false);
           if(accountType === 2)
           {
            setShowOrder(true);
           }
          }
        });

        marker.on("mouseover", () => {
          //TO-DO: implement shop info bubble
        });

        if (id === clickedShopId && isShopClicked === true) {
          if (isFarmFormOpen) {
            mapRef.current?.setView([latitude, longitude - 0.06], 13); // Left side
          } else {
            mapRef.current?.setView([latitude, longitude + 0.06], 13); // Right side
          }
        }
      });

      farms.forEach(({ id, name, latitude, longitude, rating }) => {
        const farmIcon = L.divIcon({
          className: "farm-div-icon",
          html: `<div style="color: black; ${
            id === clickedFarmId
              ? "border-radius: 50px; background: green; font-size: 30px;"
              : ""
          }">
                    <img src="${customFarmIcon}" alt="Icon" style="width: 60px; height: 60px;">
                    <div id="farm-icon-${id}" style="text-align: center; font-size: 15px; font-weight: bold; margin-top: -10px; background-color: yellow; border-radius: 20px; border: 1px solid black;">5/5</div>
                 </div>`,
          iconSize: [60, 50],
          iconAnchor: [25, 50],
        });

        const marker = L.marker([latitude, longitude], {
          icon: farmIcon,
        }).addTo(mapRef.current!);

        marker.on("click", () => {
          if (id !== undefined) {
           handleFarmClick(id);

          }
        });

        marker.on("mouseover", () => {
          // TO-DO: implement farm info bubble
        });

        if(isDeliveryListOpen){
          mapRef.current?.setView([latitude, longitude], 13);
        }else{
          if (id === clickedFarmId && isShopClicked === false) {
            if (clickedShopId === undefined) {
              mapRef.current?.setView([latitude, longitude - 0.06], 13);
            } else {
              mapRef.current?.setView([latitude, longitude], 13);
            }
          }
        }

      
      });
    }
  }, [shops, clickedShopId, clickedFarmId]);

  return (
    <div
      ref={mapContainer}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}></div>
  );
};

export default SofiaMap;
