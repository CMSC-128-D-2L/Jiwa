const request = require('request')

request.get('http://localhost:3001/user', (err, res, body) => 
  {console.log(body)} )

