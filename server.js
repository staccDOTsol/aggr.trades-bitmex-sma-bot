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
        	send += 'testnet: ' + lines[l][1]
        	+ '<br>account: ' + lines[l][0]
        	+ '<br>avail: ' + lines[l][2]
        	+ '<br>wallet: ' + lines[l][3]
        	+ '<br>margin: ' + lines[l][4] // 1.00
        	+ '<br>beginBal: ' + lines[l][5] //1.05
        	+ '<br>gains: ' + (parseFloat(lines[l][5]) / parseFloat(lines[l][4]) - 1 )* 100 
        	+ ' %<br><br>'
        }
        req.send(data.replace('\n', '<br>'))
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