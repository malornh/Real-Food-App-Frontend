import { Card } from '../AccountFrom/AccountForm';
import './FarmForm.css'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

interface Props {
  data: Card,
  types: string[] 
}

const FarmForm = ({ data, types }: Props) => {

  const handleTabClick={

  }
  
  return (
    <div className="farmFormStyle">
      {data && (
        <div className="farmCardContainer">
          <img src={data.imgUrl} className="farmImage" />
          <div className="farmInfoContainer">
            <h1 className="farmTitle">{data.name}</h1>
            <p className="farmDescription">Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nisi atque velit minus ipsum ratione, enim magnam, sed voluptas similique voluptates laboriosam est cupiditate, commodi accusamus ducimus distinctio dolorum consequuntur!</p>
            <div className="farmRatingContainer">
              {data.rating} / 5.0
            </div>
          </div>
        </div>
      )}
       <Tabs>
      <TabList className='foodTabMenu'>
        {types.map((type, index) => (
          <Tab className='tab' key={index}>{type}</Tab>
        ))}
      </TabList>

      <TabPanels>
        {types.map((type, index) => (
          <TabPanel className='tabPanel' key={index}>
            <div style={{display: 'flex'}}>
              <div>
                <img style={{width: '80px', height: '80px', borderRadius: '15px', padding: '10px'}} src={"https://www.bta.bg/upload/2870506/Syngenta_Barosor_1.jpg?l=1000&original=013bbbec5fca1125637321752b8cfa6a81e98933"} />
              </div>
              <div style={{color: 'black'}}>
                Tomatoes
              </div>
            </div>
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>

      </div>
  );
}

export default FarmForm;
