const axios = require('axios');

const testNotes = () => {
  axios
  .get('http://localhost:3000/notes')
  .then(({ data }) => console.log(data));
}

testNotes();