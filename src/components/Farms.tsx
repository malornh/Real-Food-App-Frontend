import React, { useState, useEffect } from 'react';

interface FarmFormProps {
  accessToken: string;
}

const FarmForm: React.FC<FarmFormProps> = ({ accessToken }) => {
  const [farms, setFarms] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://localhost:7218/api/Farms', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setFarms(data);
        } else {
          console.error('Failed to fetch farms:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching farms:', error);
      }
    };

    fetchData();
  }, [accessToken]);

  return (
    <div>
      <h2>Farm List</h2>
      <ul>
        {farms.map((farm: any, index: number) => (
          <li key={index}>{farm.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default FarmForm;
