const fs = require('fs')

let content = {
  'title': 'title2',
  'content': 'content2',
}
fs.writeFile('./data.json', content, { flag: 'a+' }, (err) => {
  if (err) {
    return console.log(error)
  }
  console.log('some data to notes file', content)
})
