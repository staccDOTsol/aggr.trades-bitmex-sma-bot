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
        	+ '<br>gains: ' + (float(lines[l][5]) / float(lines[l][4]) - 1 )* 100 
        	+ ' %<br><br>'
        }
        req.send(data.replace('\n', '<br>'))
}
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
        var line = lines.length;
        var beginBal;
        for (var l in lines){
        	if (lines[l].split(',')[0] == account){
        		match = true;
        		line = l
        		beginBal = lines[l].split(',')[5]
        	}
        }else {
        	beginBal = margin;
        }
        lines[line] = account + ',' 
        + test + ','
        + avail + ','
        + wallet + ','
        + margin + ',' 
        + beginBal + '\n'


		fs.writeFile("log.csv", lines, function(err) {
		    if(err) {
		        return console.log(err);
		    }

		    console.log("The file was saved!");
		}); 
    } else {
        console.log(err);
    }
});
}
app.listen(port, () => console.log(`Example app listening on port ${port}!`))