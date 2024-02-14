import Spinner from "../spinner/Spinner";
import CityItem from "./CityItem";
import Message from "../message/Message";
import styles from "./CityList.module.css";

function CityList({ cities, isLoading }) {
  if (isLoading) return <Spinner />;

  //if there is no city we get empty page. Instead we want to have smth like message
  if (!cities.length)
    return (
      <Message message="Add your first city by clicking on a city on the map" />
    );

  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}

export default CityList;
