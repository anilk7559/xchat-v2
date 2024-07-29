import { City, Country, State } from 'country-state-city';
import { useEffect, useState } from 'react';

interface IProps {
  onChange?: Function;
}
function LocationSubFilter({
  onChange = () => {}
}: IProps) {
  const countries = Country.getAllCountries().map((i) => ({ isoCode: i.isoCode, name: i.name }));
  const [states, setStates] = useState([] as any);
  const [cities, setCities] = useState([] as any);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const handleFilter = async (option: any) => {
    onChange(option);
  };

  const getStateAndCity = async (countryCode: string) => {
    // State data
    const stateData = await State.getStatesOfCountry(countryCode).map((i) => ({ isoCode: i.isoCode, name: i.name }));
    setStates(stateData);

    // City data
    const cityData = await City.getCitiesOfCountry(countryCode).map((i) => ({ name: i.name }));
    setCities(cityData);

    // Run filter when country has no state or city data
    if (!stateData.length || !cityData.length) {
      handleFilter({ country: Country.getCountryByCode(selectedCountry).name });
    }
  };

  useEffect(() => {
    if (selectedCountry && selectedState && selectedCity) {
      const option = {
        country: Country.getCountryByCode(selectedCountry).name,
        state: selectedState,
        city: selectedCity
      };
      handleFilter(option);
    }
  }, [selectedCountry, selectedState, selectedCity]);

  useEffect(() => {
    if (selectedCountry) {
      getStateAndCity(selectedCountry);
      // Refresh cities
      selectedCity && setSelectedCity('');
      // Refresh states
      selectedState && setSelectedState('');
    }
  }, [selectedCountry]);

  return (
    <>
      <div className="dropdown">
        <select className="btn btn-outline-default dropdown-toggle" onChange={(e) => setSelectedCountry(e.target.value)}>
          <option value="">All Country</option>
          {countries.map((i) => (
            <option value={i.isoCode} key={i.isoCode}>
              {i.name}
            </option>
          ))}
        </select>
      </div>
      {selectedCountry && [
        <div className="dropdown" key="states">
          <select className="btn btn-outline-default dropdown-toggle" onChange={(e) => setSelectedState(e.target.value)}>
            <option value="">All State</option>
            {states.map((i) => (
              <option value={i.name} key={i.isoCode}>
                {i.name}
              </option>
            ))}
          </select>
        </div>,

        <div className="dropdown" key="cities">
          <select
            className="btn btn-outline-default dropdown-toggle"
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="">All City</option>
            {cities.map((i) => (
              <option value={i.name} key={i.name}>
                {i.name}
              </option>
            ))}
          </select>
        </div>
      ]}
    </>
  );
}

export default LocationSubFilter;
