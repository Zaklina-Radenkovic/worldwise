import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

export const BASE_URL =
  "https://my-json-server.typicode.com/zaklina-radenkovic/worldwise";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  currentCity: {},
  isLoading: false,
  error: "",
};

const reducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, cities: payload, isLoading: false };
    case "city/loaded":
      return { ...state, currentCity: payload, isLoading: false };
    case "city/created":
      return {
        ...state,
        cities: [...state.cities, payload],
        isLoading: false,
        currentCity: payload,
      };
    case "city/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== payload),
        isLoading: false,
        currentCity: {},
      };
    case "rejected":
      return { ...state, error: payload, isLoading: false };
    default:
      throw new Error("Unknown action type");
  }
};

const CitiesProvider = ({ children }) => {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading data...",
        });
      }
    }
    fetchCities();
  }, []);

  const getCity = useCallback(async function getCity(id) {
    //the 'id' we`re getting from URL is always a string
    // console.log(id, currentCity.id);
    //checking do we have already have currentCity.id in the local state, so we don`t need to preform repeted fetching
    if (Number(id) === currentCity.id) return;

    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error loading data...",
      });
    }
  }, []);

  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      //console.log(data);
      //keepint in sync remote State with UI State
      dispatch({ type: "city/created", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error creating city...",
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });

      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting city...",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        getCity,
        currentCity,
        error,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
};

function useCities() {
  const context = useContext(CitiesContext);

  if (context === undefined)
    throw new Error("CitiesContext was used outside of CitiesProvider");
  return context;
}
export { CitiesProvider, useCities };
