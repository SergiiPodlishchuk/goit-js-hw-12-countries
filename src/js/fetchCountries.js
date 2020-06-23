export default function fetchCountries(searchQuery) {
  const baseCountryApi = 'https://restcountries.eu/rest/v2/name/';

  return fetch(baseCountryApi + searchQuery, {
    headers: {
      Accept: 'application/json',
    },
  }).then(response => response.json());
}
