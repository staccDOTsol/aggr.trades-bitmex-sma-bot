const mongo = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017'
var db;
var collection

mongo.connect(url, (err, client) => {
  if (err) {
    console.error(err)
    return
  }
db = client.db('logs')
collection = db.collection('logs')
collection.insertOne({account: 'test'}, (err, result) => {

collection.findOne({account: 'test'}, (err, item) => {
console.log(err)
console.log(item.account)
})
})
})
