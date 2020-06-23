import './styles.css';
import fetchCountry from './js/fetchCountries';
import countryMenu from './templates/country_menu.hbs';
import list_country from './templates/list_country.hbs';
import { alert, notice, info, success, error } from '@pnotify/core';
import '@pnotify/core/dist/Material.css';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';

const debounce = require('lodash.debounce');

const refs = {
  input: document.querySelector('#input_county'),
  manuCountry: document.querySelector('#manu_country'),
  list_country: document.querySelector('.list_country'),
};

refs.input = addEventListener('input', debounce(selectCountry, 1000));

function selectCountry(e) {
  e.preventDefault();
  if (e.target.value === '') {
    refs.manuCountry.innerHTML = '';
    refs.list_country.innerHTML = '';
    return;
  }
  const inputNameCountry = e.target.value.toLowerCase();
  const firstLetter = inputNameCountry[0].toUpperCase();
  const wordChange = inputNameCountry.substring(1);

  fetchCountry(`${firstLetter}${wordChange}`)
    .then(data => {
      const markup = data.filter(input =>
        input.name.includes(`${firstLetter}${wordChange}`),
      );

      if (markup.length === 1) {
        const markupIns = markup.map(country => countryMenu(country)).join('');
        refs.manuCountry.insertAdjacentHTML('beforeend', markupIns);
        refs.list_country.innerHTML = '';
        return;
      } else if (markup.length >= 2 && markup.length <= 10) {
        const markupInsList = markup
          .map(country => list_country(country))
          .join('');
        refs.list_country.insertAdjacentHTML('beforeend', markupInsList);
        refs.manuCountry.innerHTML = '';
        return;
      } else {
        const myAlert = alert({
          text: `Find ${markup.length} country. Too many matches found. Please enter a more specific quer!.`,
          type: 'info',
          delay: 3000,
          closer: true,
        });
        refs.manuCountry.innerHTML = '';
        refs.list_country.innerHTML = '';
        return;
      }
    })
    .catch(error => {
      const myNotice = notice({
        text: 'This country is not on this planet',
        delay: 3000,
      });
      refs.manuCountry.innerHTML = '';
      refs.list_country.innerHTML = '';
      return myNotice;
    });
}
