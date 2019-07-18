const express = require('express')
const app = express()
const port = 3000
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
})

var bodyParser = require('body-parser')
app.set('view engine', 'ejs');

	const fs = require('fs');

app.get('/graph', (req, res) => {
res.render('index.ejs', {
            gains: gainsArr,
            gains2 : gains2Arr,
            margin: marginArr
        })

})
app.get('/graphU', (req, res) => {
res.json({
            gains: gainsArr,
            gains2 : gains2Arr,
            margin: marginArr
        })

})

var marginArr = {}
var gainsArr = {}
var aa = 0;
var gains2Arr = {}
app.get('/', (req, res) => {
collection.find().toArray((err, items) => {
    if (!err) {



        var send = "<head><meta http-equiv=\"refresh\" content=\"15\" /></head>";
        for (var l in items){
            var acc = items[l].account
        	if (parseFloat(items[l].beginBal) >= 0){
        		var beginBall = items[l].beginBal//5
                var beginBall2 = items[l].wallet//3
        		var gains = ((parseFloat(items[l].margin) / parseFloat(items[l].beginBal) - 1 )* 100)
                 var gains2 = ((parseFloat(items[l].wallet) / parseFloat(items[l].beginBal2) - 1 )* 100)
                var marginperc = parseFloat(items[l].avail)/ parseFloat(items[l].margin)
        		var starttime = parseFloat(items[l].starttime)
                if (items[l].account == '228306'){
        		    beginBall = 0.01
                    starttime = starttime - 1000 * 60 * 60 * 2
                    beginBall2 = 0.01
                    gains = ((parseFloat(items[l].margin) / parseFloat(beginBall) - 1 )* 100)
                    gains2 = ((parseFloat(items[l].wallet) / parseFloat(beginBall2) - 1 )* 100)
                }
                    if (gainsArr[acc] == undefined){
                        gainsArr[acc] = []
                        marginArr[acc] = []
                        gains2Arr[acc] = []
                    }
                    gainsArr[acc].push(gains)
                    gains2Arr[acc].push(gains2)
                    marginArr[acc].push(marginperc)
                    aa++;
                    if (aa > 5){
                        ga = gainsArr[acc][gainsArr[acc].length-1]
                        ga2 = gains2Arr[acc][gains2Arr[acc].length-1]
                        ma = marginArr[acc][marginArr[acc].length-1]
                        marginArr[acc] = []
                        gainsArr[acc] = []
                        gains2Arr[acc] = []
                        gainsArr[acc].push(ga)
                        gains2Arr[acc].push(ga2)
                        marginArr[acc].push(ma)
                                }

                var diff = parseFloat(items[l].nowtime) - starttime
                diff = diff / 1000 / 60 / 60 / 24
                var apr = gains * (365 / diff)
                var apr2 = gains2 * (365 / diff)
                console.log(parseFloat(items[l].nowtime))
                console.log(new Date().getTime() - 1000 * 60 * 60)
                if (parseFloat(items[l].nowtime) > new Date().getTime() - 1000 * 60 * 60){
        	send += 'testnet: ' + items[l].test

            + '<br>apiKey: ' + items[l].apiKey
            
        	+ '<br>account: ' + items[l].account
            if (items[l].notes != undefined){
            if (items[l].notes.length>4){
                send+='<br>notes: ' + items[l].notes
            }
        }

        	send+= '<br>avail: ' + items[l].avail
        	+ '<br>wallet: ' + items[l].wallet
        	+ '<br>margin: ' + items[l].margin // 1.00
        	+ '<br>beginBal: ' + beginBall //1.05
        	+ '<br>gains (margin): ' + gains.toPrecision(3) + ' %'
            + '<br>gains (wallet): ' + gains2.toPrecision(3) + ' %'
            + '<br>first seen: ' + new Date(starttime)
            + '<br>last seen: ' + new Date(parseFloat(items[l].nowtime))
            + '<br>days: ' + diff.toPrecision(3)
            + '<br>APR margin: ' + apr
        	+ ' %<br>APR wallet: ' +  apr2 + ' %<br><br>'
        }

    }
        }
        res.send(send.replace('\n', '<br>'))
}
})
})
app.get('/set', (req, res) => {
var test = req.query.test;
var apiKey=""
if (req.query.apiKey){
apiKey = req.query.apiKey;
}
var account = req.query.account;
var avail = req.query.avail;
var wallet = req.query.wallet;
var margin = req.query.margin;
collection.findOne({account: account}, (err, item) => {


    if (!err) {


        var match = false;
        var beginBal;
        var beginBal2;
        var nowtime = new Date().getTime()
        var starttime;
        var notes = "";
        	if (item != null){
                match = true
                if (account == "228653"){
                    notes="trail:3%,stoploss:3%,takeprofit:3%,ordermultiplier:3x"
                } else if (apiKey == "BeEEo37ubiTkO3bY9vjIZbiF"){
                    notes="trail:3%,stoploss:3%,takeprofit:6%,ordermultiplier:3x"
                } else if (apiKey == "Y8v1yypGd66S229affRkkW1z"){
                    notes="trail:3%,stoploss:6%,takeprofit:3%,ordermultiplier:3x"
                }
                beginBal2 = item.beginBal2
        		beginBal = item.beginBal
                starttime = parseFloat(item.starttime)
        	}
        if (!match){
            starttime = new Date().getTime();
        	beginBal = margin;
            beginBal2 = wallet;
        }
    }
collection.updateOne({'account': account}, {'$set': {'notes':notes,'apiKey': apiKey, 'account':account,
    'test':test,
'avail':avail,
 'wallet':wallet,
 'margin':margin,
 'beginBal':beginBal,
 'starttime':starttime.toString(),
 'nowtime': nowtime.toString(), 
 'beginBal2': beginBal2}},{ upsert: true } ,(err, item) => {
  res.send('')
})
})
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
