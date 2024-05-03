import { useState, useEffect } from 'react';

const fetchData = async () => {
  try {
    const response = await fetch('https://localhost:7010/api/Users');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

const DataComponent = () => {
  const [data, setData] = useState<any[] | null>(null); // Explicitly typing data as an array of any objects or null

  useEffect(() => {
    const getData = async () => {
      const result = await fetchData();
      setData(result);
    };
    getData();
  }, []);

  return (
    <div>
      {data && (
        <ul>
          {data.map((item: any) => (
            <li key={item.id}>
              <p>ID: {item.id}</p>
              <p>Email: {item.email}</p>
              <p>Email Verified: {item.emailVerified ? 'Yes' : 'No'}</p>
              <p>Password: {item.password}</p>
              <p>Phone: {item.phone}</p>
            </li>
          ))}
        </ul>
      ) }
    </div>
  );
};

export default DataComponent;
