import { Card } from '../AccountFrom/AccountForm';
import './FarmForm.css'

interface Props {
  data: Card
}

const FarmForm = ({ data }: Props) => {
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
    </div>
  );
}

export default FarmForm;
