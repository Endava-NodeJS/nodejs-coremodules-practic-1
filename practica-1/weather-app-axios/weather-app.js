const axios = require('axios');

axios
  .get('http://api.weatherstack.com/current?access_key=a0b5a0610fc1eb8fa3a870a7f8cba8e0&query=Chisinau')
  .then(({ data }) => console.log(data));

// , res => {
// let data = '';
// res.on('data', dataChunk => (data += dataChunk));
// res.on('close', () => {
//   const response = JSON.parse(data);
//   const {
//     current: { weather_descriptions },
//     request: { query },
//   } = response;
//   console.log(`It's currently ${weather_descriptions} in ${query} `);
// });
// });
