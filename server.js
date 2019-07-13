const express = require('express')
const app = express()
const port = 3000

	const fs = require('fs');

app.get('/', (req, res) => {
fs.readFile('log.csv', {encoding: 'utf-8'}, function(err,data){
    if (!err) {
        console.log('received data: ' + data);


        var lines = data.split('\n')

        var send = "";
        for (var l in lines){
        	if (lines[l].split(',')[1] != undefined){
        		var beginBall = lines[l].split(',')[5]
        		var gains = -1 * ((parseFloat(lines[l].split(',')[4]) / parseFloat(lines[l].split(',')[5]) - 1 )* 100) 
        		if (lines[l].split(',')[0] == '226605'){
        			beginBall = "0.01"
        			gains = -1 * (parseFloat(lines[l].split(',')[4]) /(parseFloat(0.01) / - 1 )* 100) 
        		}
        	send += 'testnet: ' + lines[l].split(',')[1]
        	+ '<br>account: ' + lines[l].split(',')[0]
        	+ '<br>avail: ' + lines[l].split(',')[2]
        	+ '<br>wallet: ' + lines[l].split(',')[3]
        	+ '<br>margin: ' + lines[l].split(',')[4] // 1.00
        	+ '<br>beginBal: ' + beginBall //1.05
        	+ '<br>gains: ' + gains
        	+ ' %<br><br>'
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
        var beginBal;
        for (var l in lines){
        	if (lines[l].includes(account)){
        		match = true;
        		line = l
        		beginBal = lines[l].split(',')[6]
        		if (beginBal == undefined){

        		beginBal = lines[l].split(',')[5]
        		}
        		console.log(beginBal)
        	}
        	lines[l]+='\n'
        }
        if (!match){
        	beginBal = margin;
        }
        console.log(line)
        if (line == -1){
        	lines[lines.length+1] = account + ',' 
        + test + ','
        + avail + ','
        + wallet + ','
        + margin + ',' 
        + beginBal + '\n'
        }
        else {
        lines[line] = account + ',' 
        + test + ','
        + avail + ','
        + wallet + ','
        + margin + ',' 
        + beginBal + '\n'
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