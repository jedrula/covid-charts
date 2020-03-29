const fetch = require('node-fetch');
const deathsGlobalUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv';


async function main() {
  const response = await fetch(deathsGlobalUrl);
  console.log(response);
  const text = await response.text();
  console.log(text);
}

main();