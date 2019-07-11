const request = require('request');
var ProxyLists = require('proxy-lists');
var SocksProxyAgent = require('socks-proxy-agent');
var Agent = require('socks5-http-client/lib/Agent');

var rp = require('request-promise')
const zlib = require('zlib'); // for GZIP
const http = require('http');
const https = require('https');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
let redditsDone = []
let dates = []
let shares = []
dates = []
shares = []
let time;
let time2;

let reddits = []
let proxies = []
let gettingProxies;
var sources = ProxyLists.listSources();
var fs = require('fs');
let uas = []
fs.readFile(__dirname + '/ua.json', function(err, data) {
	if (err) {
		throw err;
	}
	data = JSON.parse(data)
	for (var d in data) {
		if (data[d].commonality.toLowerCase() == 'common' || data[d].commonality.toLowerCase() == 'Very common') {
			uas.push(data[d].ua)
		}
	}
});
proxies = []
goods = []
randoms = []
checkC = 0;
good2 = []
async function checkTheGoods(options, proxy, checkC){
					let ip = request.get(options, function (error, response, body){
	
    if(error) {
		if (good2.includes(proxy)){
			if (proxies.length < 3 && proxies.length != 0){
			proxies = []
			fetchProxies();
			checkEm(0)
		}
      console.log('poo our good no longer good ' + proxy)
		}
	    var ind = proxies.indexOf(proxy);
		if (ind !== -1) proxies.splice(ind, 1);
		var ind = goods.indexOf(proxy);
		if (ind !== -1) goods.splice(ind, 1);
		var ind = good2.indexOf(proxy);
		if (ind !== -1) good2.splice(ind, 1);
	}else {
		if (!good2.includes(proxy)){
		good2.push(proxy)
		}
		setDaTimeout(options, proxy, checkC)
	}
})
}
async function setDaTimeout(options, proxy, checkC){
	sl = Math.random() * 5000 * good2.length
	setTimeout(function(){
				checkTheGoods(options, proxy, checkC)
				}, sl);
}
async function getGoods(options, proxy, checkC){
	
				let ip = request.get(options, function (error, resp, body){
	
    if(error) {
      //console.log(error)
	    var ind = proxies.indexOf(proxy);
		if (ind !== -1) proxies.splice(ind, 1);

		if (checkC >= proxies.length - 1){
			proxies = []
			fetchProxies();
			checkEm(0)
		}
		else {
			checkEm(checkC + 1)
		}
	} else {
				//console.log(body)
				try {
				goods.push(proxy)
				console.log(goods)
				setDaTimeout(options, proxy, checkC);
				//console.log(proxy)
				
				let str = '["'
				for (var g in goods) {
					str = str + 'SOCKS ' + goods[g].split(':')[1].replace('//','') + ':' + goods[g].split(':')[2].replace('//','') +'; SOCKS5 ' + goods[g].split(':')[1].replace('//','') + ':' + goods[g].split(':')[2].replace('//','') + '; SOCKS4 ' + goods[g].split(':')[1].replace('//','') + ':' + goods[g].split(':')[2].replace('//','') + '","'
				}
					str = str.substring(0, str.length - 2) + ']'
					//console.log(str)
					let towrite = ('function FindProxyForURL(url, host) {\nvar proxies = ' + str + ';\n\nreturn proxies[getRandomInt(0, proxies.length)];\n }\n\n function getRandomInt(firstIndex, lastIndex) {\nreturn firstIndex + (Math.floor((lastIndex - firstIndex + 1) * Math.random()));\n}')
					fs.writeFile("/home/aggr.trades-bitmex-sma-bot/foxy.PAC", towrite, function(err) {
						if (err) {
							return console.log(err);
						}

						if (checkC >= proxies.length - 1){
			proxies = []
			fetchProxies();
							checkEm(0)
						}
						else {
							checkEm(checkC + 1)
						}
					});
				
				} catch (err){
					if (checkC >= proxies.length - 1){
			proxies = []
			fetchProxies();
							checkEm(0)
						}
						else {
							checkEm(checkC + 1)
						}
				}
	}
	
				})
				//console.log(goods)
				
}
gg = 0;
gogocheck = false;
setInterval(function(){
	if (gg < new Date().getTime() - 1000 * 19 && gogocheck){
		checkEm(checkOld + 1)
	}
}, 10000);
checkOld = 0;
async function checkEm(checkC){
	checkOld = checkC;
	console.log(checkC)
		let random = Math.floor(Math.random() * proxies.length)
		console.log(proxies.length)
		if (!randoms.includes(random)) {
			randoms.push(random)
			proxy = proxies[random];
			//console.log(proxy)
			var agent = new SocksProxyAgent(proxy);

			url = 'http://www.google.com'
			ua = uas[Math.floor(Math.random() * uas.length)];
			var options = {
				uri: url,
				url: url,
				method: 'GET',
				    agent: agent,	

				'timeout': 20000}
			try {
				gg = new Date().getTime();
				getGoods(options, proxy, checkC);

			} catch (e) {
				//console.log(e);
		if (checkC >= proxies.length - 1){
			proxies = []
			fetchProxies();
			checkEm(0)
		}
		else {
			checkEm(checkC + 1)
		}
			}
		}
}
let thefirst = true;
setInterval(function(){
if (proxies.length == 0){
fetchProxies();
}
}, 60000)
async function fetchProxies() {
	console.log('fetching...')
				console.log(proxies.length)
	
	
	proxies = []
	for (var g in goods){
		proxies.push(goods[g])
	}
	randoms = []
	try {
		var proxyoptions = {
			
			protocols: ['socks4', 'socks5'],
			anonymityLevels: ['anonymous', 'elite'],
			sourcesWhiteList: [
  'hidemyname' ]
		}
			gettingProxies = ProxyLists.getProxies(proxyoptions);
			gettingProxies.on('error', function(error) {
				console.log(error)
			});

			gettingProxies.on('data', function(proxylist) {
				for (var proxy in proxylist) {
					console.log(proxylist[proxy])
					if (proxylist[proxy].protocols != null && proxylist[proxy].country != 'us' ){
					if (proxylist[proxy].protocols.includes('socks4')){
						proxies.push('socks4://' + proxylist[proxy].ipAddress + ':' + proxylist[proxy].port)
						console.log(proxies.length)
						if (thefirst){
							thefirst = false;
							gogocheck = true;
							checkEm(0);
						
					}
					}
					if (proxylist[proxy].protocols.includes('socks5')){
						proxies.push('socks5://' + proxylist[proxy].ipAddress + ':' + proxylist[proxy].port)
						console.log(proxies.length)
if (thefirst){
							thefirst = false;
							gogocheck = true;
							checkEm(0);
						
					}
					}
					}
				}
			});
	} catch (err) {
		//console.log(err)
		}
}
let count = 0
let attempts = 0;
fetchProxies();
let proxy;
let proxyFirst = true;
