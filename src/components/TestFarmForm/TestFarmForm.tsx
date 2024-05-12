import { PiFarmDuotone } from "react-icons/pi";
import './TestFarmForm.css'
import { useEffect, useState } from "react";
import FarmForm from "../Farms";

interface Props{
    farmId: number | undefined,
}

const TestFarmForm = ({ farmId }: Props) => {
const [isAccount, setIsAccount] = useState(true);
const [formOpened, setFormOpened] = useState(false);

const [first, setFirst] = useState(false);

  useEffect(()=>{
    if(first)
    {
      openForm();
    }
    setFirst(true);
  }, [farmId])

  function openForm(){
      setFormOpened(true);
    
  }

  function closeForm(){
    setFormOpened(false);
    setFirst(false); // Reset first state to false
  }
  return (
    <div className="form">
      <PiFarmDuotone
        className="farmButton"
        onClick={() =>
          formOpened ? setIsAccount(true) : setFormOpened(!formOpened)
        }
      />

      {formOpened && (
        <>
          <button onClick={()=>closeForm()}>Close</button>
          <p
            style={{
              fontSize: "50px",
              position: "absolute",
              left: "50px",
              background: "yellow",
              width: "300px",
            }}>
            {farmId}
          </p>
        </>
      )}
    </div>
  );
}

export default TestFarmForm