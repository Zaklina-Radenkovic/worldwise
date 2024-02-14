import Spinner from "../spinner/Spinner";
import CountryItem from "./CountryItem";
import Message from "../message/Message";
import styles from "./CountryList.module.css";

function CountryList({ cities, isLoading }) {
  if (isLoading) return <Spinner />;

  //if there is no Country we get empty page. Instead we want to have smth like message
  if (!cities.length)
    return (
      <Message message="Add your first Country by clicking on a Country on the map" />
    );

  const countries = cities.reduce((arr, city) => {
    if (!arr.map((el) => el.country).includes(city.country))
      return [...arr, { country: city.country, emoji: city.emoji }];
    else return arr;
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.country} />
      ))}
    </ul>
  );
}

export default CountryList;
