import { useState } from 'react';
import { Card } from '../AccountFrom/AccountForm';
import './FarmForm.css'
import { Text, Tabs, TabList, TabPanels, Tab, TabPanel, NumberInput, NumberInputField, Box } from '@chakra-ui/react'
import { TbTruckDelivery } from "react-icons/tb";



interface Product {
  Id: number;
  Name: string;
  Description: string;
  FarmId: number;
  UnitOfMeasurement: string;
  Quantity: number;
  PricePerUnit: number;
  DeliveryRadius: number;
  MinUnitOrder: number;
  DateUpdated: Date;
  Image: string;
  Type: string;
}

interface Props {
  data: Card,
  products: Product[]
}

const FarmForm = ({ data, products }: Props) => {

  const unique = (arr: any) => [...new Set(arr)];

  const typeList = unique(products.map(p => p.Type));

  const [selectedType, setSelectedType] = useState('');
  
  

  const handleTabClick={

  }
  
  return (
    <div>
      {data && (
        <div className="farmCardContainer">
          <img src={data.imgUrl} className="farmImage" />
          <div className="farmInfoContainer">
            <h1 className="farmTitle">{data.name}</h1>
            <p className="farmDescription">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit
              nisi atque velit minus ipsum ratione, enim magnam, sed voluptas
              similique voluptates laboriosam est cupiditate, commodi accusamus
              ducimus distinctio dolorum consequuntur!
            </p>
            <div className="farmRatingContainer">{data.rating} / 5.0</div>
          </div>
        </div>
      )}
      <Tabs>
        <TabList className="foodTabMenu">
          {typeList.map((type) => (
            <Tab
              className="tab"
              key={type as string}
              onClick={() => setSelectedType(type as string)}>
              {type as string}
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          {typeList.map((type) => (
            <TabPanel className="tabPanel" key={type as string}>
              {products
                .filter((p) => p.Type === type)
                .map((p) => (
                  <div
                    key={p.Id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                      background: "rgba(254, 216, 65, 0.8)",
                      borderRadius: "5px",
                    }}>
                    <div
                      style={{ display: "flex", justifyContent: "flex-start" }}>
                      <img
                        style={{
                          width: "130px",
                          height: "130px",
                          borderRadius: "10px",
                          marginTop: "5px",
                          marginLeft: "5px",
                          marginBottom: "5px",
                          padding: "5px",
                        }}
                        src={p.Image}
                      />
                    </div>
                  </div>
                ))}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </div>
  );
}

export default FarmForm;
