const express = require('express')
const app = express()
const port = 3000

	const fs = require('fs');

app.get('/', (req, res) => {
fs.readFile('log.csv', {encoding: 'utf-8'}, function(err,data){
    if (!err) {
        console.log('received data: ' + data);


        var lines = data.split('\n')

        var send = "<head><meta http-equiv=\"refresh\" content=\"30\" /></head>";
        for (var l in lines){
        	if (parseFloat(lines[l].split(',')[3]) >= 0){
        		var beginBall = lines[l].split(',')[5]
        		var gains = ((parseFloat(lines[l].split(',')[4]) / parseFloat(lines[l].split(',')[5]) - 1 )* 100) 
        		var starttime = parseFloat(lines[l].split(',')[6])
                if (lines[l].split(',')[0] == '226605'){
        			beginBall = "0.01"
                    starttime = starttime - 1000 * 60 * 60 * 24
        			gains = ((parseFloat(lines[l].split(',')[4]) / parseFloat(0.01) - 1 )* 100) 
        		
                }
                var diff = parseFloat(lines[l].split(',')[7]) - starttime
                diff = diff / 1000 / 60 / 60 / 24
                var apr = gains * (365 / diff)
        	send += 'testnet: ' + lines[l].split(',')[1]
        	+ '<br>account: ' + lines[l].split(',')[0]
        	+ '<br>avail: ' + lines[l].split(',')[2]
        	+ '<br>wallet: ' + lines[l].split(',')[3]
        	+ '<br>margin: ' + lines[l].split(',')[4] // 1.00
        	+ '<br>beginBal: ' + beginBall //1.05
        	+ '<br>gains: ' + gains.toPrecision(3) + ' %'
            + '<br>first seen: ' + new Date(starttime)
            + '<br>last seen: ' + new Date(parseFloat(lines[l].split(',')[7]))
            + '<br>days: ' + diff.toPrecision(3)
            + '<br>APR: ' + apr.toPrecision(3)
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
        var nowtime = new Date().getTime()
        var starttime;
        for (var l in lines){
        	if (lines[l].includes(account)){
        		match = true;
        		line = l
        		beginBal = lines[l].split(',')[5]
                starttime = parseFloat(lines[l].split(',')[6])
        		console.log(beginBal)
        	}
        	lines[l]+='\n'
        }
        if (!match){
            starttime = new Date().getTime();
        	beginBal = margin;
        }
        console.log(line)
        if (line == -1){
        	lines[lines.length+1] = account + ',' 
        + test + ','
        + avail + ','
        + wallet + ','
        + margin + ',' 
        + beginBal + ','
        + starttime.toString() + ','
        + nowtime.toString() +  '\n'
        }
        else {
        lines[line] = account + ',' 
        + test + ','
        + avail + ','
        + wallet + ','
        + margin + ',' 
        + beginBal + ','
        + starttime.toString() + ','
        + nowtime.toString() +  '\n'
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
