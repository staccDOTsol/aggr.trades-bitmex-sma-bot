const express = require('express')
const app = express()
const port = 3000
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

var marginArr[acc] = {}
var gainsArr = {}
var aa = 0;
var gains2Arr = {}
app.get('/', (req, res) => {
fs.readFile('log.csv', {encoding: 'utf-8'}, function(err,data){
    if (!err) {
        console.log('received data: ' + data);


        var lines = data.split('\n')

        var send = "<head><meta http-equiv=\"refresh\" content=\"5\" /></head>";
        for (var l in lines){
            var acc = lines[l].split(',')[0]
        	if (parseFloat(lines[l].split(',')[3]) >= 0){
        		var beginBall = lines[l].split(',')[5]
                var beginBall2 = lines[l].split(',')[3]
        		var gains = ((parseFloat(lines[l].split(',')[4]) / parseFloat(lines[l].split(',')[5]) - 1 )* 100)
                 var gains2 = ((parseFloat(lines[l].split(',')[3]) / parseFloat(lines[l].split(',')[8]) - 1 )* 100)
                var marginperc = parseFloat(lines[l].split(',')[2])/ parseFloat(lines[l].split(',')[4])
        		var starttime = parseFloat(lines[l].split(',')[6])
                if (lines[l].split(',')[0] == '226991'){
        			lines[l].split(',')[0]+= ' - jare\'s latest testnet monster, fueled by @crypto_trader\'s massive testnet btc!'
        		    beginBall = 0.01
                    starttime = starttime - 1000 * 60 * 60 * 24
                    beginBall2 = 0.01
                    gains = ((parseFloat(lines[l].split(',')[4]) / parseFloat(beginBall) - 1 )* 100)
                    gains2 = ((parseFloat(lines[l].split(',')[3]) / parseFloat(beginBall2) - 1 )* 100)
                }
                if (gains < 0 || gains > 0){
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

                var diff = parseFloat(lines[l].split(',')[7]) - starttime
                diff = diff / 1000 / 60 / 60 / 24
                var apr = gains * (365 / diff)
                var apr2 = gains2 * (365 / diff)
        	send += 'testnet: ' + lines[l].split(',')[1]
        	+ '<br>account: ' + lines[l].split(',')[0]
        	+ '<br>avail: ' + lines[l].split(',')[2]
        	+ '<br>wallet: ' + lines[l].split(',')[3]
        	+ '<br>margin: ' + lines[l].split(',')[4] // 1.00
        	+ '<br>beginBal: ' + beginBall //1.05
        	+ '<br>gains (margin): ' + gains.toPrecision(3) + ' %'
            + '<br>gains (wallet): ' + gains2.toPrecision(3) + ' %'
            + '<br>first seen: ' + new Date(starttime)
            + '<br>last seen: ' + new Date(parseFloat(lines[l].split(',')[7]))
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
var account = req.query.account;
var avail = req.query.avail;
var wallet = req.query.wallet;
var margin = req.query.margin;
fs.readFile('log.csv', {encoding: 'utf-8'}, function(err,data){
    if (!err) {
        console.log('received data: ' + data);


        var lines = data.split('\n')
        var match = false;
        var line = lines.length + 1	;
        console.log(line)
        var beginBal;
        var beginBal2;
        var nowtime = new Date().getTime()
        var starttime;
        for (var l in lines){
        	if (lines[l].includes(account)){
        		match = true;
        		line = l

                beginBal2 = lines[l].split(',')[8]
        		beginBal = lines[l].split(',')[5]
                starttime = parseFloat(lines[l].split(',')[6])
        		console.log(beginBal)
        	}
        	lines[l]+='\n'
        }
        if (!match){
            starttime = new Date().getTime();
        	beginBal = margin;
            beginBal2 = wallet;
        }
        console.log(line)
        console.log(starttime)
        console.log(nowtime)
        if (line == -1){
        	lines[lines.length+1] = account + ',' 
        + test + ','
        + avail + ','
        + wallet + ','
        + margin + ',' 
        + beginBal + ','
        + starttime.toString() + ','
        + nowtime.toString()  + ','
        + beginBal2 +'\n'
        }
        else {
        lines[line] = account + ',' 
        + test + ','
        + avail + ','
        + wallet + ','
        + margin + ',' 
        + beginBal + ','
        + starttime.toString() + ','
        + nowtime.toString()   + ','
        + beginBal2 +'\n'
    }
    var ll = ""
    for (var l in lines){
    	if (lines[l].length>4){
    	ll+=lines[l]
    }
    }
     console.log(ll)

		fs.writeFile("log.csv", ll, function(err) {
		    if(err) {
		    	res.send('')
		        return console.log(err);
		    }

		    console.log("The file was saved!");
		    	res.send('')
		}); 
    } else {
		    	res.send('')
        console.log(err);
    }
});
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
