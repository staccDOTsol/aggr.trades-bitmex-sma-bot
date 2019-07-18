var request = require('browser-request')
request('/', function(er, res) {
  if(!er)
    return console.log('browser-request got your root path:\n' + res.body)
 
  console.log('There was an error, but at least browser-request loaded and ran!')
  throw er
})
