<template>
  <div id="chart">
    <div
      class="chart__container"
      ref="chartContainer"
      :class="{ fetching: fetching }"
      :style="{ height: chartHeight }"
      @mouseenter="showControls = true"
      @mouseleave="showControls = false"
    >
      <div
        class="chart__notice"
        v-if="isDirty"
        v-tippy="{ placement: 'bottom' }"
        :title="
          `${pendingExchanges.join(
            pendingExchanges.length === 2 ? ' and ' : ', '
          )} did not send any trades since the beginning of the session.<br>Chart will be updated automaticaly once the data is received`
        "
      >
        <i class="icon-warning"></i> {{ pendingExchanges.length }} exchange{{
          pendingExchanges.length > 1 ? 's are' : ' is'
        }}
        still silent
      </div>

      <div class="chart__controls chart-controls" v-if="showControls">
        <div class="chart-controls__left"></div>
        <div class="chart-controls__right">
          <div
            class="chart__scale-mode"
            @click="$store.commit('toggleChartAutoScale', !chartAutoScale)"
            v-tippy
            :title="chartAutoScale ? 'Unlock price axis' : 'Lock price axis'"
          >
            <span class="min-768">{{ chartAutoScale ? 'AUTO' : 'FREE' }}</span>
            <i
              :class="{
                'icon-locked': chartAutoScale,
                'icon-unlocked': !chartAutoScale,
              }"
            ></i>
          </div>
        </div>
      </div>

      <div
        class="chart__scale-handler -y"
        ref="chartScaleHandler"
        @mousedown="startScale('y', $event)"
        @dblclick.stop.prevent="resetScale('y')"
      ></div>
      <div
        class="chart__scale-handler -x"
        ref="chartScaleHandler"
        @mousedown="startScale('x', $event)"
        @dblclick.stop.prevent="resetScale('x')"
      ></div>
      <div
        class="chart__height-handler"
        ref="chartHeightHandler"
        @mousedown="startResize"
        @dblclick.stop.prevent="resetHeight"
      ></div>

      <div class="chart__canvas"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
let buyHigh;
var bm;
var margin222;
var margin333
var marginperc
var positionXbt;
var positionAda;
var btcbtc = 10000;
var positionEos;

var positionLtc;

var positionTrx;

var positionBch;

var positionXrp;

var positionEth;
import socket from '../../services/socket'
import chartOptions from './options.json'
// See 'options' reference below
var request = require('browser-request')
var crypto = require('crypto');
var firsttrade = 0;
var verb, path, expires, data, postBody, signature, headers,requestOptions;
var apiKey

var apiSecret

setInterval(function(){
 apiKey  = localStorage.getItem('apikey')
 apiSecret = localStorage.getItem('apisecret')
}, 5000);

function refreshMargin(){
verb = 'GET',
  path = '/api/v1/position',
  expires = Math.round(new Date().getTime() / 1000) + 6660, // 1 min in the future
  data = ''
// Pre-compute the postBody so we can be sure that we're using *exactly* the same body in the request
// and in the signature. If you don't do this, you might get differently-sorted keys and blow the signature.
 postBody = JSON.stringify(data);

signature = crypto.createHmac('sha256', apiSecret).update(verb + path + (expires) + data).digest('hex');

headers = {
  'content-type' : 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'api-expires': expires,
  'api-key': apiKey,
  'api-signature': signature
};
requestOptions = {
  headers: headers,
  url:'https://testnet.bitmex.com'+path,
  method: verb,
  body: {}
};
request(requestOptions, function(error, response, body) {
  if (error) { console.log(error); }
  for (var j in JSON.parse(body)){
  if (JSON.parse(body)[j].symbol == "XBTUSD"){
    positionXbt = JSON.parse(body)[j].currentQty;

  }
  else if (JSON.parse(body)[j].symbol == "ETHUSD"){
    positionEth = JSON.parse(body)[j].currentQty;

  }else if (JSON.parse(body)[j].symbol == "ADAU19"){
    positionAda = JSON.parse(body)[j].currentQty;

  }
  else if (JSON.parse(body)[j].symbol == "EOSU19"){
    positionEos = JSON.parse(body)[j].currentQty;

  }else if (JSON.parse(body)[j].symbol == "LTCU19"){
    positionLtc = JSON.parse(body)[j].currentQty;

  }else if (JSON.parse(body)[j].symbol == "XRPU19"){
    positionXrp = JSON.parse(body)[j].currentQty;

  }
  else if (JSON.parse(body)[j].symbol == "BCHU19"){
    positionBch = JSON.parse(body)[j].currentQty;

  }
  else if (JSON.parse(body)[j].symbol == "TRXU19"){
    positionTrx = JSON.parse(body)[j].currentQty;

  }
  }
  if (positionXbt == undefined){
  positionXbt = 0;
  }
  if (positionEth == undefined){
  positionEth = 0;
  }if (positionTrx == undefined){
  positionTrx = 0;
  }if (positionBch == undefined){
  positionBch = 0;
  }if (positionXrp == undefined){
  positionXrp = 0;
  }if (positionLtc == undefined){
  positionLtc = 0;
  }if (positionEos == undefined){
  positionEos = 0;
  }if (positionAda == undefined){
  positionAda = 0;
  }
});
  verb = 'GET',
  path = '/api/v1/user/margin?currency=XBt',
  expires = Math.round(new Date().getTime() / 1000) + 6660, // 1 min in the future
  data = ''
// Pre-compute the postBody so we can be sure that we're using *exactly* the same body in the request
// and in the signature. If you don't do this, you might get differently-sorted keys and blow the signature.
postBody = JSON.stringify(data);

 signature = crypto.createHmac('sha256', apiSecret).update(verb + path + (expires) + data).digest('hex');

 headers = {
  'content-type' : 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'api-expires': expires,
  'api-key': apiKey,
  'api-signature': signature
};
requestOptions = {
  headers: headers,
  url:'https://testnet.bitmex.com'+path,
  method: verb,
  body: {}
};
request(requestOptions, function(error, response, body) {
  if (error) { console.log(error); }


account = JSON.parse(body).account
  margin222 = JSON.parse(body).availableMargin/100000000;
  margin333 = JSON.parse(body).marginBalance/100000000;
  marginperc = margin222 / margin333
  wallet = JSON.parse(body).walletBalance/100000000 ;
});
}
setTimeout(function(){
  refreshMargin();
}, 1000);
var account;
var wallet;
function marginDo(){
  var requestOptions = {
  url:'http://35.239.130.201:3000/set?test=true&account='+account+'&avail=' + margin222 + '&wallet=' + wallet + '&margin='+margin333,
  method: 'GET'
};
console.log(requestOptions)
//http://35.239.130.201:3000/set?test=true&account=226605&avail=1203075&wallet=1442845&margin=1557757
request(requestOptions, function(error, response, body) {
  if (error) { console.log(error); }
    console.log(body)
  })
}
setInterval(function(){
  marginDo()
  }, 60000)

setInterval(function(){
  refreshMargin();
}, 180000)
import Highcharts from 'highcharts/highstock'
import Indicators from 'highcharts/indicators/indicators'
import EMA from 'highcharts/indicators/ema'
// import ATR from 'highcharts/indicators/atr';
// import BB from 'highcharts/indicators/bollinger-bands';

import enablePanning from './pan.js'

Indicators(Highcharts)
EMA(Highcharts)
// ATR(Highcharts);
// BB(Highcharts); // is bugged on highchart 7 :-(

export default {
  data() {
    return {
      panning: false,
      fetching: false,
      showControls: false,
      chart: null,
      tick: null,
      cursor: null,
      queuedTrades: [],
      queuedTicks: [],
      pendingExchanges: [],
      isDirty: false,
      isMini: false,

      _timeframe: null,
    }
  },
  computed: {
    ...mapState([
      'pair',
      'apikey',
      'apisecret',
      'timeframe',
      'actives',
      'exchanges',
      'isSnaped',
      'isReplaying',
      'chartAutoScale',
      'chartHeight',
      'chartRange',
      'chartCandleWidth',
      'chartLiquidations',
      'chartCandlestick',
      'chartPadding',
      'chartGridlines',
      'chartGridlinesGap',
      'chartSma',
      'chartSmaLength',
      'chartVolume',
      'chartVolumeThreshold',
      'chartVolumeOpacity',
      'chartVolumeAverage',
      'chartVolumeAverageLength',
    ]),
  },
  created() {
    socket.$on('trades.queued', this.onTrades)

    socket.$on('clean', this.onClean)

    this.onStoreMutation = this.$store.subscribe((mutation, state) => {
      switch (mutation.type) {
        case 'setPair':
          this.chart.series[0].update(
            { name: mutation.payload.toUpperCase() },
            false
          )
          break
        case 'setTimeframe':
          this.setTimeframe(
            mutation.payload,
            true,
            this._timeframe !== this.timeframe
          )
          this._timeframe = parseInt(this.timeframe)
          break
        case 'toggleSnap':
          mutation.payload && this.snapRight(true)
          break
        case 'toggleExchangesBar':
          setTimeout(() => {
            this.updateChartHeight()
          })
          break
        case 'reloadExchangeState':
        case 'toggleLiquidations':
        case 'setChartPadding':
        case 'toggleVolume':
        case 'setVolumeThreshold':
          if (+new Date() - this.$root.applicationStartTime > 1000) {
            this.redrawChart()
          }
          break
        case 'toggleCandlestick':
        case 'toggleChartGridlines':
        case 'setChartGridlinesGap':
        case 'setVolumeOpacity':
          this.createChart()
          this.setTimeframe(this.timeframe)
          break
        case 'toggleVolumeAverage':
          this.chart.series[4].update({ visible: mutation.payload })
          this.chart.series[5].update({ visible: mutation.payload })
          break
        case 'setVolumeAverageLength':
          this.chart.series[4].update({
            params: { period: +mutation.payload || 14 },
          })
          this.chart.series[5].update({
            params: { period: +mutation.payload || 14 },
          })
          break
        case 'toggleSma':
          this.chart.series[6].update({ visible: mutation.payload })
          break
        case 'setSmaLength':
          this.chart.series[6].update({
            params: { period: +mutation.payload || 14 },
          })
          break
        case 'toggleReplaying':
          if (mutation.payload) {
            this.clearChart(mutation.payload.timestamp)
            this.setRange(+new Date() - mutation.payload.timestamp)
          } else {
            this.setTimeframe(this.timeframe)
          }
          break
        case 'toggleChartAutoScale':
          this.resetScale('x')
          this.resetScale('y')
          break
      }
    })

    this._timeframe = parseInt(this.timeframe)
    this._scaling = {}
  },
  mounted() {
    console.log(`[chart.mounted]`)

    this.$refs.chartContainer.style.height = this.getChartSize().height + 'px'

    window.setTimeout(() => this.createChart())

    this._doResize = this.doResize.bind(this)

    window.addEventListener('resize', this._doResize, false)

    this._doDrag = this.doDrag.bind(this)

    window.addEventListener('mousemove', this._doDrag, false)

    this._stopDrag = this.stopDrag.bind(this)

    window.addEventListener('mouseup', this._stopDrag, false)

    this.setTimeframe(this.timeframe, true)
  },
  beforeDestroy() {
    this.destroyChart()

    socket.$off('trades.queued', this.onTrades)

    socket.$off('clean', this.onClean)

    window.removeEventListener('resize', this._doResize)
    window.removeEventListener('mousemove', this._doDrag)
    window.removeEventListener('mouseup', this._stopDrag)

    // this.$el.removeEventListener('wheel', this.doZoom);

    this.onStoreMutation()
  },
  methods: {
    createChart() {
      this.destroyChart()

      this.theme = JSON.parse(JSON.stringify(chartOptions)).theme

      const options = this.getChartOptions()

      this.chart = Highcharts.stockChart(
        this.$el.querySelector('.chart__canvas'),
        options
      )

      enablePanning(Highcharts, this.chart)

      this.updateChartHeight()

      this.isMini = false
      this.updateMiniMode()

      if (this.queuedTicks.length) {
        this.tickHistoricals(
          this.queuedTicks.splice(0, this.queuedTicks.length)
        )

        this.chart.redraw()
      }

      if (this.queuedTrades.length) {
        this.tickTrades(this.queuedTrades.splice(0, this.queuedTrades.length))

        this.chart.redraw()
      }

      this.$refs.chartContainer.style.height = ''
    },
    destroyChart() {
      if (!this.chart) {
        return
      }

      this.chart.destroy()

      delete this.chart
    },
    setTimeframe(timeframe, snap = false, clear = false, print = true) {
      clearTimeout(this._renderEndTimeout)

      console.log(`[chart.setTimeframe]`, timeframe)

      const count =
        ((this.chart
          ? this.chart.chartWidth
          : this.$refs.chartContainer.offsetWidth) -
          20 * 0.1) /
        this.chartCandleWidth
      const range = timeframe / 6 * count

      socket
        .fetchRange(range, clear)
        .then((response) => {
          if (response) {
            console.log(
              `[chart.setTimeframe] done fetching (${
                response.results.length
              } new ${response.format}s)`
            )
          } else {
            console.log(`[chart.setTimeframe] did not fetch anything new`)
          }
        })
        .catch(() => {})
        .then(() => {
          this.redrawChart(range)
        })
    },
    redrawChart(range) {
      console.log(
        `[chart.redrawChart]`,
        range ? '(& setting range to ' + range + ')' : ''
      )

      let min
      let max

      if (range) {
        this.setRange(range)
      } else if (this.chart) {
        min = this.chart.xAxis[0].min
        max = this.chart.xAxis[0].max

        this.chart.xAxis[0].setExtremes(min - (max - min), max, false)
      }

      if (this.chart) {
        this.clearChart(+new Date() - this.chartRange / 2)
      }

      if (!print || (!socket.ticks.length && !socket.trades.length)) {
        return
      }

      this.tickHistoricals(socket.ticks)

      this.tickTrades(socket.trades)

      if (range) {
        this.setRange(range / 2)
      } else if (this.chart) {
        this.chart.xAxis[0].setExtremes(min, max, true)
      }
    },
    onTrades(trades) {

    console.log('data')
    if (this.chart.series[0 ] != undefined){
    if (this.chart.series[0].yData.length > 30){
    for (var a = 0; a <=  this.chart.series[0].yData.length > 30; a++){
try {
this.chart.series[0].data[a].remove();
} catch(err){}
}

          }
          }
    if (this.chart.series[1] != undefined){
    if (this.chart.series[1].yData.length > 30){
for (var a = 0; a <=  this.chart.series[1].yData.length > 30; a++){
    try {

this.chart.series[1].data[a].remove();
} catch(err){}
}
          }
    }

    if (this.chart.series[2] != undefined){
    if (this.chart.series[2].yData.length > 30){
for (var a = 0; a <=  this.chart.series[2].yData.length > 30; a++){
    try {

this.chart.series[2].data[a].remove();
} catch(err){}
}
          }

    }
    if (this.chart.series[3] != undefined){
    if (this.chart.series[3].yData.length > 30){
for (var a = 0; a <=  this.chart.series[3].yData.length > 30; a++){
    try {

this.chart.series[3].data[a].remove();
} catch(err){}
}
          }
    }

    if (this.chart.series[4] != undefined){
    if (this.chart.series[4].yData.length > 20){
for (var a = 0; a <=  this.chart.series[4].yData.length > 30; a++){
    try {

this.chart.series[4].data[a].remove();
} catch(err){}
}
    }

    }
    if (this.chart.series[5] != undefined){
    if (this.chart.series[5].yData.length > 20){
for (var a = 0; a <=  this.chart.series[5].yData.length > 30; a++){
    try {

this.chart.series[5].data[a].remove();
} catch(err){}
}
    }
    }
    if (this.chart.series[6] != undefined){
    if (this.chart.series[6].yData.length > 20){
for (var a = 0; a <=  this.chart.series[6].yData.length > 30; a++){
    try {

this.chart.series[6].data[a].remove();
} catch(err){}
}
          }

    }
    if (this.chart.series[7] != undefined){
    if (this.chart.series[7].yData.length > 20){
for (var a = 0; a <=  this.chart.series[7].yData.length > 30; a++){
    try {

this.chart.series[7].data[a].remove();
} catch(err){}
}
          }
    }
          this.chart.redraw()

    console.log(this.chart.series[0].data)
    var thepair = this.pair
    for (var t in trades){
    if (trades[t][0] == 'bitmex'){
    console.log('bitmex')
    bm = (trades[t][2])
    console.log(bm)
    }
    }
        var qty = 0;
    if (this.tickData != undefined){
    if (this.tickData.exchanges[trades[trades.length-1][0]] != undefined){
    
    console.log(this.tickData.exchanges[trades[trades.length-1][0]])
    var test =((margin222*1.25*((margin222*this.tickData.exchanges[trades[trades.length-1][0]].close)*50))/2)
    console.log(test)
    test = test *2;
        test = test * 10 * 10
        if (thepair == 'ETHUSD'){
       // test = test * 3
        }
        //console.log(test)
    }
    }

    if (
    this.chart.series[1].data[this.chart.series[1].data.length-1] != undefined){
    console.log(this.chart.series[4].yData[26])
    console.log(this.chart.series[5].yData[26])
    }
    if(this.chart.series[5].yData[0] != undefined && this.tickData.exchanges[trades[trades.length-1][0]] != undefined){
        var num = this.chart.series[4].yData.length - 1
        if (num == 27){
        num = 26
        }
        if (this.chart.series[5].yData[num]<=  0.98 * this.chart.series[4].yData[num]){
        console.log('sells greater')
        if (buyHigh == undefined){
        buyHigh = true;
        }
        if (buyHigh == true){
        if (firsttrade < 2){
firsttrade++;
        }
        if (firsttrade == 2){
        firsttrade++;
        qty = -1*(margin222*this.tickData.exchanges[trades[trades.length-1][0]].close)/9
        if (thepair.indexOf('USD') == -1){
        qty = -1*(margin222*this.tickData.exchanges[trades[trades.length-1][0]].close)/9
        }
        }
        else {
        firsttrade++;
        qty = -1*(margin222*this.tickData.exchanges[trades[trades.length-1][0]].close)/9
        if (thepair.indexOf('USD') == -1){
        qty = -1*(margin222*this.tickData.exchanges[trades[trades.length-1][0]].close)/9
        }
        }
        if (marginperc < 0.3){
        if (thepair == "ETHUSD"){
        if (positionEth <= 0 && qty > 0){

        qty = 0.35 * positionEth * -1
        }
        } else if (thepair == "BTCUSD"){
        if (positionXbt <= 0 && qty > 0){

        qty = 0.35 * positionXbt * -1
        }
        }
        else if (thepair == "EOSBTC"){
        if (positionEos <= 0 && qty > 0){

        qty = 0.35 * positionEos * -1
        }
        }else if (thepair == "TRXBTC"){
        if (positionTrx <= 0 && qty > 0){

        qty = 0.35 * positionTrx * -1
        }
        }else if (thepair == "BCHBTC"){
        if (positionBch <= 0 && qty > 0){

        qty = 0.35 * positionBch * -1
        }
        }else if (thepair == "LTCBTC"){
        if (positionLtc <= 0 && qty > 0){

        qty = 0.35 * positionLtc * -1
        }
        }else if (thepair == "XRPBTC"){
        if (positionXrp <= 0 && qty > 0){

        qty = 0.35 * positionXrp * -1
        }
        }else if (thepair == "ADABTC"){
        if (positionAda <= 0 && qty > 0){

        qty = 0.35 * positionAda * -1
        }
        }
        }
       else if (marginperc < 0.4){
        qty = qty / 1.25
        }

        if (thepair == 'ETHUSD'){
        qty = qty * 13.4852071;
        }
        console.log('marginperc')
        console.log(marginperc)
        console.log(thepair)
        console.log(positionXbt)
        console.log(positionEth)
        if (thepair == 'BTCUSD'){
          if (positionXbt < 0){
            qty = qty * 2;
            if (qty < positionBtc)
            {
            qty = positionBtc * -1
            }
          }
          else 
          if (marginperc < 0.175){
        qty = 0
        
          }
        }
        else if (thepair == 'ETHUSD'){
          if (positionEth > 0){
            qty = qty * 2
            if (qty < positionEth)
            {
            qty = positionEth * -1
            }
          }else 
          if (marginperc < 0.175){
        qty = 0
        
          }
        }
        else if (thepair == 'ADABTC'){
          if (positionAda > 0){
            qty = qty * 2
            if (qty < positionAda)
            {
            qty = positionAda * -1
            }
          }else 
          if (marginperc < 0.175){
        qty = 0
        
          }
        }
        else if (thepair == 'EOSBTC'){
          if (positionEos > 0){
            qty = qty * 2
            if (qty < positionEos)
            {
            qty = positionEos * -1
            }
          }else 
          if (marginperc < 0.175){
        qty = 0
        
          }
        }
        else if (thepair == 'TRXBTC'){
          if (positionTrx > 0){
            qty = qty * 2
            if (qty < positionTrx)
            {
            qty = positionTrx * -1
            }
          }else 
          if (marginperc < 0.175){
        qty = 0
        
          }
        }
        else if (thepair == 'XRPBTC'){
          if (positionXrp > 0){
            qty = qty * 2
            if (qty < positionXrp)
            {
            qty = positionXrp * -1
            }
          }else 
          if (marginperc < 0.175){
        qty = 0
        
          }
        }
        else if (thepair == 'BCHBTC'){
          if (positionBch > 0){
            qty = qty * 2
            if (qty < positionBch)
            {
            qty = positionBch * -1
            }
          }else 
          if (marginperc < 0.175){
        qty = 0
        
          }
        }
        else if (thepair == 'LTCBTC'){
          if (positionLtc > 0){
            qty = qty * 2
            if (qty < positionLtc)
            {
            qty = positionLtc * -1
            }
          }else 
          if (marginperc < 0.175){
        qty = 0
        
          }
        }
        console.log(qty)
        
        qty = Math.round(qty)
       verb = 'GET',
  path = '/api/v1/instrument/active',
  expires = Math.round(new Date().getTime() / 1000) + 6660, // 1 min in the future
  data = ''
// Pre-compute the postBody so we can be sure that we're using *exactly* the same body in the request
// and in the signature. If you don't do this, you might get differently-sorted keys and blow the signature.
 postBody = JSON.stringify(data);

 signature = crypto.createHmac('sha256', apiSecret).update(verb + path + (expires) + data).digest('hex');

 headers = {
  'content-type' : 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'api-expires': expires,
  'api-key': apiKey,
  'api-signature': signature
};
 requestOptions = {
  headers: headers,
  url:'https://testnet.bitmex.com'+path,
  method: verb,
  body: {}
};
request(requestOptions, function(error, response, body) {
  if (error) { console.log(error); }
  var js = JSON.parse(body)
  var btcbid;
  var btcask;
  var ethbid;
  var ethask;
  var adabid;
  var adaask;
  var xrpbid;
  var xrpask;
  var bchbid;
  var bchask;
  var eosbid;
  var eosask;
  var ltcbid;
  var ltcask;
  var trxbid;
  var trxask;
  for (var j in js){
  if (js[j].symbol == 'XBTUSD'){
    btcbid = js[j].bidPrice
    btcbtc = parseFloat(js[j].midPrice)
    btcask = js[j].askPrice
  }
else if (js[j].symbol == 'ETHUSD'){
    ethbid = js[j].bidPrice
    ethask = js[j].askPrice
  }
else if (js[j].symbol == 'ADAU19'){
    adabid = js[j].bidPrice
    adaask = js[j].askPrice
  }
else if (js[j].symbol == 'TRXU19'){
    trxbid = js[j].bidPrice
    trxask = js[j].askPrice
  }
else if (js[j].symbol == 'EOSU19'){
    eosbid = js[j].bidPrice
    eosask = js[j].askPrice
  }
else if (js[j].symbol == 'BCHU19'){
    bchbid = js[j].bidPrice
    bchask = js[j].askPrice
  }
else if (js[j].symbol == 'LTCU19'){
    ltcbid = js[j].bidPrice
    ltcask = js[j].askPrice
  }
else if (js[j].symbol == 'XRPU19'){
    xrpbid = js[j].bidPrice
    xrpask = js[j].askPrice
  }
  }
        if (thepair == 'BTCUSD'){
        if (qty <= 0){
        pr = btcask
        }
        else {
        pr = btcbid
        }
        } else if (thepair == 'ETHUSD'){
        if (qty < 0){
        pr = ethask
        }
        else {
        pr = ethbid
        }
        }
        else if (thepair == 'TRXBTC'){
        if (qty < 0){
        pr = trxask
        }
        else {
        pr = trxbid
        }
        }
        else if (thepair == 'ADABTC'){
        if (qty < 0){
        pr = adaask
        }
        else {
        pr = adabid
        }
        }
        else if (thepair == 'EOSBTC'){
        if (qty < 0){
        pr = eosask
        }
        else {
        pr = eosbid
        }
        }
        else if (thepair == 'BCHBTC'){
        if (qty< 0){
        pr = bchask
        }
        else {
        pr = bchbid
        }
        }
        else if (thepair == 'LTCBTC'){
        if (qty < 0){
        pr = ltcask
        }
        else {
        pr = ltcbid
        }
        }
        else if (thepair == 'XRPBTC'){
        if (qty < 0){
        pr = xrpask
        }
        else {
        pr = xrpbid
        }
        }

        if (thepair == 'BTCUSD'){
        pr = Math.round(pr*2)/2;
        }
        else if (thepair == 'ETHUSD'){
        pr =  parseFloat((Math.round(pr * 4) / 4).toFixed(2));
        }
        else if (thepair == 'LTCBTC'){
        pr =   Math.round(pr*2)/2;
        }
        buyHigh = false;
if (marginperc < 0.095){
        qty = qty / 2
        qty = Math.floor(qty)
        verb = 'POST',
  path = '/api/v1/order',
  expires = Math.round(new Date().getTime() / 1000) + 6660, // 1 min in the future
  data = {symbol:thepair.replace('BTCUSD','XBTUSD').replace('BTC','U19'),orderQty:qty,ordType:"Market"};

// Pre-compute the postBody so we can be sure that we're using *exactly* the same body in the request
// and in the signature. If you don't do this, you might get differently-sorted keys and blow the signature.
 postBody = JSON.stringify(data);

signature = crypto.createHmac('sha256', apiSecret).update(verb + path + expires + postBody).digest('hex');

 headers = {
  'content-type' : 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'api-expires': expires,
  'api-key': apiKey,
  'api-signature': signature
};

 requestOptions = {
  headers: headers,
  url:'https://testnet.bitmex.com'+path,
  method: verb,
  body: postBody
};
setTimeout(function(){
request(requestOptions, function(error, response, body) {
  if (error) { console.log(error); }
  console.log(body);
  refreshMargin();
  })
  })
  }
         verb = 'DELETE',
  path = '/api/v1/order/all',
  expires = Math.round(new Date().getTime() / 1000) + 6660, // 1 min in the future
  data = {symbol:thepair.replace('BTCUSD','XBTUSD').replace('BTC','U19')};

// Pre-compute the postBody so we can be sure that we're using *exactly* the same body in the request
// and in the signature. If you don't do this, you might get differently-sorted keys and blow the signature.
postBody = JSON.stringify(data);

signature = crypto.createHmac('sha256', apiSecret).update(verb + path + expires + postBody).digest('hex');

headers = {
  'content-type' : 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'api-expires': expires,
  'api-key': apiKey,
  'api-signature': signature
};
requestOptions = {
  headers: headers,
  url:'https://testnet.bitmex.com'+path,
  method: verb,
  body: postBody
};
request(requestOptions, function(error, response, body) {
  if (error) { console.log(error); }
  console.log(body);
verb = 'POST',
  path = '/api/v1/order',
  expires = Math.round(new Date().getTime() / 1000) + 6660, // 1 min in the future
  data = {symbol:thepair.replace('BTCUSD','XBTUSD').replace('BTC','U19'),orderQty:qty,execInst:"ParticipateDoNotInitiate",price:pr,ordType:"Limit"};

// Pre-compute the postBody so we can be sure that we're using *exactly* the same body in the request
// and in the signature. If you don't do this, you might get differently-sorted keys and blow the signature.
 postBody = JSON.stringify(data);

signature = crypto.createHmac('sha256', apiSecret).update(verb + path + expires + postBody).digest('hex');

 headers = {
  'content-type' : 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'api-expires': expires,
  'api-key': apiKey,
  'api-signature': signature
};

 requestOptions = {
  headers: headers,
  url:'https://testnet.bitmex.com'+path,
  method: verb,
  body: postBody
};
setTimeout(function(){
request(requestOptions, function(error, response, body) {
  if (error) { console.log(error); }
  console.log(body);

verb = 'POST',
  path = '/api/v1/order',
  expires = Math.round(new Date().getTime() / 1000) + 6660, // 1 min in the future
  data = {symbol:thepair.replace('BTCUSD','XBTUSD').replace('BTC','U19'),orderQty:qty,price:pr,ordType:"Limit"};

// Pre-compute the postBody so we can be sure that we're using *exactly* the same body in the request
// and in the signature. If you don't do this, you might get differently-sorted keys and blow the signature.
 postBody = JSON.stringify(data);

signature = crypto.createHmac('sha256', apiSecret).update(verb + path + expires + postBody).digest('hex');

 headers = {
  'content-type' : 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'api-expires': expires,
  'api-key': apiKey,
  'api-signature': signature
};

 requestOptions = {
  headers: headers,
  url:'https://testnet.bitmex.com'+path,
  method: verb,
  body: postBody
};
setTimeout(function(){
/*request(requestOptions, function(error, response, body) {
  if (error) { console.log(error); }
  console.log(body);
});*/
}, 550);
});});
}, 550);

});

        }
        } 
        else if (this.chart.series[5].yData[num]>=  1.02 * this.chart.series[4].yData[num]){
        console.log('buys greater')
        if (firsttrade <2 ){
        firsttrade++;
        }
        else if (firsttrade == 2){
        firsttrade++;
        qty = (margin222*this.tickData.exchanges[trades[trades.length-1][0]].close)/9
if (thepair.indexOf('USD') == -1){
        qty = (margin222*this.tickData.exchanges[trades[trades.length-1][0]].close)/9
        }
        }
        else{
        firsttrade++
        qty = (margin222*this.tickData.exchanges[trades[trades.length-1][0]].close)/9
        if (thepair.indexOf('USD') == -1){
        qty = (margin222*this.tickData.exchanges[trades[trades.length-1][0]].close)/9
        }
        }

        if (marginperc < 0.3){
        if (thepair == "ETHUSD"){
        if (positionEth <= 0 && qty > 0){

        qty = 0.35 * positionEth * -1
        }
        } else if (thepair == "BTCUSD"){
        if (positionXbt <= 0 && qty > 0){

        qty = 0.35 * positionXbt * -1
        }
        }
        else if (thepair == "EOSBTC"){
        if (positionEos <= 0 && qty > 0){

        qty = 0.35 * positionEos * -1
        }
        }else if (thepair == "TRXBTC"){
        if (positionTrx <= 0 && qty > 0){

        qty = 0.35 * positionTrx * -1
        }
        }else if (thepair == "BCHBTC"){
        if (positionBch <= 0 && qty > 0){

        qty = 0.35 * positionBch * -1
        }
        }else if (thepair == "LTCBTC"){
        if (positionLtc <= 0 && qty > 0){

        qty = 0.35 * positionLtc * -1
        }
        }else if (thepair == "XRPBTC"){
        if (positionXrp <= 0 && qty > 0){

        qty = 0.35 * positionXrp * -1
        }
        }else if (thepair == "ADABTC"){
        if (positionAda <= 0 && qty > 0){

        qty = 0.35 * positionAda * -1
        }
        }
        }
        else if (marginperc < 0.4){
        qty = qty / 1.25
        }
        if (thepair == 'ETHUSD'){
        qty = qty * 13.4852071;
        }
        if (thepair == 'BTCUSD'){
          if (positionXbt < 0){
            qty = qty * 2;
            if (qty > positionBtc)
            {
            qty = positionBtc * -1
            }
          }else 
          if (marginperc < 0.175){
        qty = 0
        
          }
        }
        else if (thepair == 'ETHUSD'){
          if (positionEth < 0){
            qty = qty * 2
            if (qty > positionEth)
            {
            qty = positionEth * -1
            }
          }else 
          if (marginperc < 0.175){
        qty = 0
        
          }
        }
        else if (thepair == 'ADABTC'){
          if (positionAda < 0){
            qty = qty * 2
            if (qty > positionAda)
            {
            qty = positionAda * -1
            }
          }else 
          if (marginperc < 0.175){
        qty = 0
        
          }
        }
        else if (thepair == 'EOSBTC'){
          if (positionEos < 0){
            qty = qty * 2
            if (qty > positionEos)
            {
            qty = positionEos * -1
            }
          }else 
          if (marginperc < 0.175){
        qty = 0
        
          }
        }
        else if (thepair == 'TRXBTC'){
          if (positionTrx < 0){
            qty = qty * 2
            if (qty > positionTrx)
            {
            qty = positionTrx * -1
            }
          }else 
          if (marginperc < 0.175){
        qty = 0
        
          }
        }
        else if (thepair == 'XRPBTC'){
          if (positionXrp < 0){
            qty = qty * 2
            if (qty > positionXrp)
            {
            qty = positionXrp * -1
            }
          }else 
          if (marginperc < 0.175){
        qty = 0
        
          }
        }
        else if (thepair == 'BCHBTC'){
          if (positionBch < 0){
            qty = qty * 2
            if (qty > positionBch)
            {
            qty = positionBch * -1
            }
          }else 
          if (marginperc < 0.175){
        qty = 0
        
          }
        }
        else if (thepair == 'LTCBTC'){
          if (positionLtc < 0){
            qty = qty * 2
            if (qty > positionLtc)
            {
            qty = positionLtc * -1
            }
          }else 
          if (marginperc < 0.175){
        qty = 0
        
          }
        }

        
        qty = Math.round(qty)
        if (buyHigh == undefined){
        buyHigh = false;
        }
        console.log(qty)
        if (buyHigh == false){
        buyHigh = true;
        var pr = 0;
        verb = 'GET',
  path = '/api/v1/instrument/active',
  expires = Math.round(new Date().getTime() / 1000) + 6660, // 1 min in the future
  data = ''
// Pre-compute the postBody so we can be sure that we're using *exactly* the same body in the request
// and in the signature. If you don't do this, you might get differently-sorted keys and blow the signature.
postBody = JSON.stringify(data);

signature = crypto.createHmac('sha256', apiSecret).update(verb + path + (expires) + data).digest('hex');

 headers = {
  'content-type' : 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'api-expires': expires,
  'api-key': apiKey,
  'api-signature': signature
};
requestOptions = {
  headers: headers,
  url:'https://testnet.bitmex.com'+path,
  method: verb,
  body: {}
};
request(requestOptions, function(error, response, body) {
  if (error) { console.log(error); }
  var js = JSON.parse(body)
  var js = JSON.parse(body)
  var btcbid;
  var btcask;
  var ethbid;
  var ethask;
  var adabid;
  var adaask;
  var eosbid;
  var eosask;
  var bchbid;
  var bchask;
  var xrpbid;
  var xrpask;
  var ltcbid;
  var ltcask;
  var trxbid;
  var trxask;
  for (var j in js){
  if (js[j].symbol == 'XBTUSD'){
    btcbid = js[j].bidPrice

    btcbtc = parseFloat(js[j].midPrice)
    btcask = js[j].askPrice
  }
else if (js[j].symbol == 'ETHUSD'){
    ethbid = js[j].bidPrice
    ethask = js[j].askPrice
  }
else if (js[j].symbol == 'ADAU19'){
    adabid = js[j].bidPrice
    adaask = js[j].askPrice
  }
else if (js[j].symbol == 'TRXU19'){
    trxbid = js[j].bidPrice
    trxask = js[j].askPrice
  }
else if (js[j].symbol == 'EOSU19'){
    eosbid = js[j].bidPrice
    eosask = js[j].askPrice
  }
else if (js[j].symbol == 'BCHU19'){
    bchbid = js[j].bidPrice
    bchask = js[j].askPrice
  }
else if (js[j].symbol == 'LTCU19'){
    ltcbid = js[j].bidPrice
    ltcask = js[j].askPrice
  }
else if (js[j].symbol == 'XRPU19'){
    xrpbid = js[j].bidPrice
    xrpask = js[j].askPrice
  }
  }
        if (thepair == 'BTCUSD'){
        if (qty <= 0){
        pr = btcask
        }
        else {
        pr = btcbid
        }
        } else if (thepair == 'ETHUSD'){
        if (qty < 0){
        pr = ethask
        }
        else {
        pr = ethbid
        }
        }
        else if (thepair == 'TRXBTC'){
        if (qty < 0){
        pr = trxask
        }
        else {
        pr = trxbid
        }
        }
        else if (thepair == 'ADABTC'){
        if (qty < 0){
        pr = adaask
        }
        else {
        pr = adabid
        }
        }
        else if (thepair == 'EOSBTC'){
        if (qty < 0){
        pr = eosask
        }
        else {
        pr = eosbid
        }
        }
        else if (thepair == 'BCHBTC'){
        if (qty< 0){
        pr = bchask
        }
        else {
        pr = bchbid
        }
        }
        else if (thepair == 'LTCBTC'){
        if (qty < 0){
        pr = ltcask
        }
        else {
        pr = ltcbid
        }
        }
        else if (thepair == 'XRPBTC'){
        if (qty < 0){
        pr = xrpask
        }
        else {
        pr = xrpbid
        }
        }

        if (thepair == 'BTCUSD'){
        pr = Math.round(pr*2)/2;
        }
        else if (thepair == 'ETHUSD'){
        pr =  parseFloat((Math.round(pr * 4) / 4).toFixed(2));
        }
        else if (thepair == 'LTCBTC'){
        pr =   Math.round(pr*2)/2;
        }
if (marginperc < 0.095){
        qty = qty / 2
        qty = Math.floor(qty)
        verb = 'POST',
  path = '/api/v1/order',
  expires = Math.round(new Date().getTime() / 1000) + 6660, // 1 min in the future
  data = {symbol:thepair.replace('BTCUSD','XBTUSD').replace('BTC','U19'),orderQty:qty,ordType:"Market"};

// Pre-compute the postBody so we can be sure that we're using *exactly* the same body in the request
// and in the signature. If you don't do this, you might get differently-sorted keys and blow the signature.
 postBody = JSON.stringify(data);

signature = crypto.createHmac('sha256', apiSecret).update(verb + path + expires + postBody).digest('hex');

 headers = {
  'content-type' : 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'api-expires': expires,
  'api-key': apiKey,
  'api-signature': signature
};

 requestOptions = {
  headers: headers,
  url:'https://testnet.bitmex.com'+path,
  method: verb,
  body: postBody
};
setTimeout(function(){
request(requestOptions, function(error, response, body) {
  if (error) { console.log(error); }
  console.log(body);
  refreshMargin();
  })
  })

  }
        verb = 'DELETE',
  path = '/api/v1/order/all',
  expires = Math.round(new Date().getTime() / 1000) + 6660, // 1 min in the future
  data = {symbol:thepair.replace('BTCUSD','XBTUSD').replace('BTC','U19')};

// Pre-compute the postBody so we can be sure that we're using *exactly* the same body in the request
// and in the signature. If you don't do this, you might get differently-sorted keys and blow the signature.
postBody = JSON.stringify(data);

signature = crypto.createHmac('sha256', apiSecret).update(verb + path + expires + postBody).digest('hex');

headers = {
  'content-type' : 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'api-expires': expires,
  'api-key': apiKey,
  'api-signature': signature
};
 requestOptions = {
  headers: headers,
  url:'https://testnet.bitmex.com'+path,
  method: verb,
  body: postBody
};
request(requestOptions, function(error, response, body) {
  if (error) { console.log(error); }
  console.log(body);
 verb = 'POST',
  path = '/api/v1/order',
  expires = Math.round(new Date().getTime() / 1000) + 6660, // 1 min in the future
  data = {symbol:thepair.replace('BTCUSD','XBTUSD').replace('BTC','U19'),orderQty:qty,execInst:"ParticipateDoNotInitiate",price:pr,ordType:"Limit"};

// Pre-compute the postBody so we can be sure that we're using *exactly* the same body in the request
// and in the signature. If you don't do this, you might get differently-sorted keys and blow the signature.
 postBody = JSON.stringify(data);

 signature = crypto.createHmac('sha256', apiSecret).update(verb + path + expires + postBody).digest('hex');

 headers = {
  'content-type' : 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'api-expires': expires,
  'api-key': apiKey,
  'api-signature': signature
};

 requestOptions = {
  headers: headers,
  url:'https://testnet.bitmex.com'+path,
  method: verb,
  body: postBody
};
setTimeout(function(){
request(requestOptions, function(error, response, body) {
  if (error) { console.log(error); }
  console.log(body);
verb = 'POST',
  path = '/api/v1/order',
  expires = Math.round(new Date().getTime() / 1000) + 6660, // 1 min in the future
  data = {symbol:thepair.replace('BTCUSD','XBTUSD').replace('BTC','U19'),orderQty:qty,price:pr,ordType:"Limit"};

// Pre-compute the postBody so we can be sure that we're using *exactly* the same body in the request
// and in the signature. If you don't do this, you might get differently-sorted keys and blow the signature.
 postBody = JSON.stringify(data);

signature = crypto.createHmac('sha256', apiSecret).update(verb + path + expires + postBody).digest('hex');

 headers = {
  'content-type' : 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'api-expires': expires,
  'api-key': apiKey,
  'api-signature': signature
};

 requestOptions = {
  headers: headers,
  url:'https://testnet.bitmex.com'+path,
  method: verb,
  body: postBody
};
setTimeout(function(){
/*request(requestOptions, function(error, response, body) {
  if (error) { console.log(error); }
  console.log(body);
});*/
}, 550);
}); 
});
}, 550)
})
}
        }
        }
        var t = new Date().getTime() - 1000 * 420;
        var tt = [];
        for (var aa in trades){
          if (trades[aa][1] > t){
            tt.push(trades[aa])
          }
        }
        trades = tt;
        console.log('trades')
        console.log(trades)
      this.tickTrades(trades, true)

      this.updateChartedCount()
    },
    tickHistoricals(ticks) {
      if (!this.chart) {
        this.queuedTicks = this.queuedTicks.concat(ticks)

        return
      } else if (this.queuedTicks.length) {
        ticks = ticks.concat(
          this.queuedTicks.splice(0, this.queuedTicks.length)
        )
      }

      ticks = ticks.filter(
        (tick) =>
          this.actives.indexOf(tick.exchange) !== -1 &&
          this.exchanges[tick.exchange] &&
          this.exchanges[tick.exchange].ohlc !== false
      )

      if (!ticks.length) {
        return
      }

      this.createTick(ticks[0].timestamp)

      const formatedTicks = []

      ticks.forEach((tick, index) => {
        if (this.chartVolume) {
          this.tickData.buys += tick.buys
          this.tickData.sells += tick.sells
        }

        if (this.chartLiquidations) {
          this.tickData.liquidations += tick.liquidations || 0
        }

        this.tickData.exchanges[tick.exchange] = {
          open: tick.open,
          high: tick.high,
          low: tick.low,
          close: tick.close
        }

        if (
          !ticks[index + 1] ||
          this.tickData.timestamp !== ticks[index + 1].timestamp
        ) {
          const formatedTick = this.formatTickData(this.tickData)
          this.addTickToSeries(formatedTick)

          formatedTicks.push(formatedTick)

          if (ticks[index + 1]) {
            this.createTick(ticks[index + 1].timestamp)
          }
        }
      })

      this.tickData.added = true

      this.chart.redraw()

      this.updateChartedCount()
    },
    clearChart(timestamp = Infinity) {
      const now = socket.getCurrentTimestamp()

      for (let serie of this.chart.series) {
        serie.setData([], false)
      }

      this.tickData = null
      this.cursor = null

      this.createTick(
        Math.floor(
          Math.min(
            timestamp,
            socket.ticks[0] ? socket.ticks[0].timestamp : Infinity,
            socket.trades[0] ? socket.trades[0][1] : Infinity
          ) / this.timeframe
        ) * this.timeframe
      )

      this.chart.redraw()
    },
    tickTrades(trades, live = false) {
      const ticks = []

      if (!trades || !trades.length) {
        trades = []
      }

      // chart doesn't allow edit on invisible ticks when it is panned
      // we just process them when will get there
      if (this.busy || this.panning || this.isPanned()) {
        this.queuedTrades = this.queuedTrades.concat(trades)

        return
      } else if (this.queuedTrades.length) {
        // right here
        trades = this.queuedTrades
          .splice(0, this.queuedTrades.length)
          .concat(trades)
      }

      // first we trim trades
      // - equal or higer than current tick
      // - only from actives exchanges (enabled, matched and visible exchange)
      trades = trades
        .filter(
          (a) => a[1] >= this.cursor && this.actives.indexOf(a[0]) !== -1 // only process trades >= current tick time // only process trades from enabled exchanges (client side)
        )
        .sort((a, b) => a[1] - b[1])

      if (!trades.length) {
        return
      }

      // define range rounded to the current timeframe
      const from = Math.floor(trades[0][1] / this.timeframe) * this.timeframe
      const to =
        Math.ceil(trades[trades.length - 1][1] / this.timeframe) *
        this.timeframe

      // loop through ticks in range
      for (let t = from; t < to; t += this.timeframe) {
        let i

        if (!this.tickData || this.cursor < t) {
          this.createTick(t)
        }

        for (i = 0; i < trades.length; i++) {
          if (trades[i][1] >= t + this.timeframe) {
            break
          }

          if (trades[i][5]) {
            switch (+trades[i][5]) {
              case 1:
                if (this.chartLiquidations) {
                  this.tickData.liquidations += trades[i][3] * trades[i][2]
                }
                break
            }

            continue
          }

          if (this.exchanges[trades[i][0]].ohlc !== false) {
            if (!this.tickData.exchanges[trades[i][0]]) {
              this.tickData.exchanges[trades[i][0]] = {
                open: +trades[i][2],
                high: +trades[i][2],
                low: +trades[i][2],
                close: +trades[i][2],
                size: 0,
              }
            }

            this.tickData.exchanges[trades[i][0]].count++

            this.tickData.exchanges[trades[i][0]].high = Math.max(
              this.tickData.exchanges[trades[i][0]].high,
              +trades[i][2]
            )
            this.tickData.exchanges[trades[i][0]].low = Math.min(
              this.tickData.exchanges[trades[i][0]].low,
              +trades[i][2]
            )
            this.tickData.exchanges[trades[i][0]].close = +trades[i][2]
            this.tickData.exchanges[trades[i][0]].size += +trades[i][3]

            if (
              this.chartVolume &&
              (!this.chartVolumeThreshold ||
                trades[i][3] * trades[i][2] > this.chartVolumeThreshold)
            ) {
              this.tickData[(trades[i][4] > 0 ? 'buys' : 'sells') + 'Count']++
              this.tickData[trades[i][4] > 0 ? 'buys' : 'sells'] +=
                trades[i][3] * trades[i][2]
            }
          }
        }

        if (i) {
          trades.splice(0, i)
        }

        ticks.push(this.formatTickData(this.tickData))
      }

      if (!this.chart.series[0].data.length) {
        this.replaceEntireChart(ticks, live)
      } else {
        if (ticks.length && ticks[0].added) {
          this.updateLatestPoints(ticks[0], live)

          ticks.splice(0, 1)
        }

        for (let i = 0; i < ticks.length; i++) {
          this.addTickToSeries(ticks[i], live, i === ticks.length - 1)
        }
      }

      if (ticks.length) {
        this.chart.xAxis[0].setExtremes(
          this.chart.xAxis[0].min,
          this.chart.xAxis[0].max
        )
      }

      this.tickData.added = true

      window.chart = this.chart
    },
    createTick(timestamp = null) {
      if (timestamp) {
        if (isFinite(timestamp)) {
          this.cursor = timestamp
        } else {
          this.cursor = timestamp
        }
      } else if (this.cursor) {
        this.cursor += this.timeframe
      } else {
        this.cursor =
          Math.floor(socket.getCurrentTimestamp() / this.timeframe) *
          this.timeframe
      }

      if (this.tickData) {
        this.tickData.timestamp = this.cursor

        for (let exchange in this.tickData.exchanges) {
          this.tickData.exchanges[exchange].count = 0
          this.tickData.exchanges[exchange].open = this.tickData.exchanges[
            exchange
          ].close
          this.tickData.exchanges[exchange].high = this.tickData.exchanges[
            exchange
          ].close
          this.tickData.exchanges[exchange].low = this.tickData.exchanges[
            exchange
          ].close
        }

        this.tickData.open = parseFloat(this.tickData.close)
        this.tickData.high = null
        this.tickData.low = null
        this.tickData.close = 0
        this.tickData.liquidations = 0
        this.tickData.buys = 0
        this.tickData.sells = 0
        this.tickData.buysCount = 0
        this.tickData.sellsCount = 0
        this.tickData.added = false
      } else {
        this.tickData = {
          timestamp: this.cursor,
          exchanges: {},
          open: null,
          high: null,
          low: null,
          close: null,
          liquidations: 0,
          buys: 0,
          sells: 0,
          buysCount: 0,
          sellsCount: 0,
          added: false,
        }

        const closes = socket.getInitialPrices()

        for (let exchange in closes) {
          if (
            this.actives.indexOf(exchange) === -1 ||
            !this.exchanges[exchange] ||
            this.exchanges[exchange].ohlc === false
          ) {
            continue
          }

          this.tickData.exchanges[exchange] = {
            size: 0,
            count: 0,
            open: closes[exchange],
            high: closes[exchange],
            low: closes[exchange],
            close: closes[exchange],
          }
        }
      }
    },
    replaceEntireChart(ticks, live = false, snap = false) {
      const seriesData = {}

      for (let tick of ticks) {
        for (let serieIndex of Object.keys(tick)) {
          if (isNaN(serieIndex)) {
            continue
          }

          if (!seriesData[serieIndex]) {
            seriesData[serieIndex] = []
          }

          if (tick[serieIndex]) {
            seriesData[serieIndex].push(tick[serieIndex])
          }
        }
      }

      for (let serieIndex in seriesData) {
        this.chart.series[serieIndex].setData(seriesData[serieIndex], false)
      }
    },
    addTickToSeries(tick, live = false, snap = false) {
      for (let serieIndex in tick) {
        if (!isNaN(serieIndex) && tick[serieIndex]) {
          this.chart.series[serieIndex].addPoint(tick[serieIndex], false)
        }
      }

      if (snap && this.isSnaped) {
        this.snapRight(live)
      }
    },
    updateLatestPoints(tick, live = false) {
      for (let serieIndex in tick) {
        if (!isNaN(serieIndex) && tick[serieIndex]) {
          const point = this.chart.series[serieIndex].points[
            this.chart.series[serieIndex].points.length - 1
          ]

          if (point.y !== tick[serieIndex][1]) {
            point.update(tick[serieIndex], false)
          }
        }
      }

      this.chart.redraw()
    },
    formatTickData(tickData) {
      return {
        0: this.getExchangesAveragedOHLC(tickData.exchanges, tickData),
        1: this.chartVolume ? [tickData.timestamp, tickData.buys] : null,
        2: this.chartVolume ? [tickData.timestamp, tickData.sells] : null,
        3: this.chartLiquidations
          ? [tickData.timestamp, tickData.liquidations]
          : null,
        added: tickData.added,
      }
    },
    getExchangesAveragedOHLC(exchanges, tickData) {
      let totalWeight = 0
      let setOpen = false

      if (tickData.open === null) {
        setOpen = true
        tickData.open = 0
      }

      let high = 0
      let low = 0

      tickData.close = 0

      for (let exchange in exchanges) {
        let exchangeWeight = 1

        if (setOpen) {
          tickData.open += exchanges[exchange].open * exchangeWeight
        }

        high += exchanges[exchange].high * exchangeWeight
        low += exchanges[exchange].low * exchangeWeight
        tickData.close +=
          ((exchanges[exchange].close +
            exchanges[exchange].high +
            exchanges[exchange].low) /
            3) *
          exchangeWeight

        totalWeight += exchangeWeight
      }

      if (setOpen) {
        tickData.open /= totalWeight
      }

      high /= totalWeight
      low /= totalWeight
      tickData.close /= totalWeight

      tickData.high = Math.max(
        tickData.high === null ? 0 : tickData.high,
        setOpen ? 0 : tickData.open,
        high
      )
      tickData.low = Math.min(
        tickData.low === null ? Infinity : tickData.low,
        setOpen ? Infinity : tickData.open,
        low
      )

      return [
        tickData.timestamp,
        tickData.open,
        tickData.high,
        tickData.low,
        tickData.close,
      ]
    },
    startResize(event) {
      if (event.which === 3) {
        return
      }

      this.resizing = event.pageY
    },

    resetHeight(event) {
      delete this.resizing

      this.$store.commit('setChartHeight', null)

      this.updateChartHeight()
    },

    startScale(axis, event) {
      if (event.which === 3) {
        return
      }

      this._scaling[axis] = event['page' + axis.toUpperCase()]
    },

    updateChartHeight(height = null) {
      if (!this.chart) {
        return
      }

      const size = this.getChartSize()

      if (window.innerWidth >= 768) {
        height = this.$el.clientHeight
      }

      this.chart.setSize(size.width, height || size.height, false)
    },

    updateMiniMode() {
      const isMini = window.innerWidth < 380

      if (this.isMini !== isMini) {
        this.chart.update(
          {
            chart: {
              spacingBottom: isMini ? 0 : 5
            }
          },
          false
        )

        this.chart.xAxis[0].update(
          {
            visible: !isMini
          },
          false
        )

        this.chart.yAxis[1].update(
          {
            top: isMini ? '40%' : '75%',
            height: isMini ? '60%' : '25%',
          },
          false
        )

        this.chart.yAxis[2].update(
          {
            top: isMini ? '40%' : '75%',
            height: isMini ? '60%' : '25%',
          },
          false
        )

        setTimeout(this.chart.redraw.bind(this.chart), 1000)
      }

      this.isMini = isMini
    },

    resetScale(axis) {
      delete this._scaling[axis]

      this.updateChartScale(axis, null)
    },

    updateChartScale(axis, scale) {
      let min = this.chart[axis + 'Axis'][0].min
      let max = this.chart[axis + 'Axis'][0].max

      let range

      if (scale === null) {
        min = max = null
      } else if (scale) {
        range = (max - min) * (scale * (axis === 'x' ? -1 : 1))

        min -= range
        max += range
      }

      this.chart[axis + 'Axis'][0].setExtremes(min, max)

      if (axis === 'x') {
        range = this.chart.xAxis[0].max - this.chart.xAxis[0].min

        this.$store.commit('setChartRange', range)
        this.$store.commit(
          'setChartCandleWidth',
          this.chart.chartWidth / (range / this.timeframe)
        )
      }
    },

    getChartSize() {
      const w = this.$refs.chartContainer.offsetWidth
      const h = document.documentElement.clientHeight

      return {
        width: w,
        height:
          this.chartHeight > 0
            ? this.chartHeight
            : +Math.min(w / 2, Math.max(300, h / 3)).toFixed(),
      }
    },

    doResize(event) {
      clearTimeout(this._resizeTimeout)

      this._resizeTimeout = setTimeout(() => {
        this.updateMiniMode()
        this.updateChartHeight()
      }, 250)
    },

    doDrag(event) {
      if (!isNaN(this.resizing)) {
        this.updateChartHeight(
          this.chart.chartHeight + (event.pageY - this.resizing)
        )

        this.resizing = event.pageY
      } else if (
        typeof this._scaling['x'] !== 'undefined' &&
        !isNaN(this._scaling['x'])
      ) {
        this.updateChartScale(
          'x',
          (event.pageX - this._scaling['x']) / 100,
          true
        )

        this._scaling['x'] = event.pageX
      } else if (
        typeof this._scaling['y'] !== 'undefined' &&
        !isNaN(this._scaling['y'])
      ) {
        this.updateChartScale(
          'y',
          (event.pageY - this._scaling['y']) / 100,
          true
        )

        this._scaling['y'] = event.pageY
      }
    },

    stopDrag(event) {
      if (this.resizing) {
        this.$store.commit('setChartHeight', this.chart.chartHeight)

        delete this.resizing
      }

      for (let axis in this._scaling) {
        delete this._scaling[axis]
      }
    },

    snapRight(redraw = false) {
      if (this.busy || this.panning) {
        return
      }

      if (Object.keys(this._scaling).length) {
        return
      }

      const margin = this.chartRange * this.chartPadding
      const now = socket.getCurrentTimestamp()

      let from
      let to

      if (this.isReplaying) {
        from = this.chart.xAxis[0].dataMin
      } else {
        from = now - this.chartRange + margin
      }

      to = now + margin

      if (to < this.chart.xAxis[0].max) {
        return
      }

      from = Math.ceil(from / this.timeframe) * this.timeframe
      to = Math.ceil(to / this.timeframe) * this.timeframe

      this.chart.xAxis[0].setExtremes(from, to, redraw)
    },

    updateChartedCount() {
      let pendingExchanges = this.actives.filter(
        (id) => this.exchanges[id].ohlc !== false
      )

      if (this.tickData) {
        pendingExchanges = pendingExchanges.filter(
          (id) => Object.keys(this.tickData.exchanges).indexOf(id) === -1
        )
      }

      if (this.pendingExchanges.length !== pendingExchanges.length) {
        this.redrawChart()
      }

      this.pendingExchanges = pendingExchanges.map((a) => a.toUpperCase())

      this.isDirty = !this.isReplaying && this.pendingExchanges.length

      return this.isDirty
    },

    isPanned() {
      if (!this.chart || !this.chart.series.length) {
        return true
      }

      return (
        this.tickData &&
        this.chart.series[0].points.length &&
        this.chart.series[0].points[this.chart.series[0].points.length - 1].x <
          this.tickData.timestamp
      )
    },

    setRange(range, setExtremes = true) {
      this.$store.commit('setChartRange', range)

      if (this.chart) {
        const padding = this.chartRange * this.chartPadding
        const now = socket.getCurrentTimestamp()
        let from = now - this.chartRange
        let to = now

        if (!this.isReplaying) {
          from += padding
          to += padding
        }

        if (setExtremes) {
          this.chart.xAxis[0].setExtremes(from, to, true)
        }
      }
    },
    getChartOptions() {
      const options = JSON.parse(JSON.stringify(chartOptions))

      // time axis
      options.xAxis.labels.color = this.theme.labels
      options.xAxis.crosshair.color = this.theme.crosshair

      // price axis
      if (this.chartGridlines) {
        options.yAxis[0].labels.color = this.theme.labels
        options.yAxis[0].gridLineColor = this.theme.gridline
        options.yAxis[0].crosshair.color = this.theme.crosshair
        options.yAxis[0].tickPixelInterval = this.chartGridlinesGap || null
      } else {
        options.yAxis[0].visible = false
      }

      // candlesticks
      options.series[0].upColor = this.theme.up
      options.series[0].upLineColor = this.theme.up
      options.series[0].color = this.theme.down
      options.series[0].lineColor = this.theme.down
      options.series[0].name = this.pair

      // line
      options.series[0].type = this.chartCandlestick ? 'candlestick' : 'spline'
      options.series[0].lineColor = this.chartCandlestick
        ? options.series[0].down
        : 'white'
      options.series[0].lineWidth = this.chartCandlestick ? 1 : 2

      // buys
      options.series[1].color = this.theme.buys

      // sells
      options.series[2].color = this.theme.sells

      // liquidations bars
      options.series[3].color = this.theme.liquidations

      // sells EMA
      options.series[4].lineColor = this.theme.sellsMA

      // buys EMA
      options.series[5].lineColor = this.theme.buysMA

      // price MA
      options.series[6].lineColor = this.theme.priceMA
      options.series[7] && (options.series[7].lineColor = this.theme.priceMA)

      // Tooltip value formatter
      const formatPrice = this.$root.formatPrice
      const formatAmount = this.$root.formatAmount

      options.tooltip.backgroundColor = this.theme.tooltipBackground
      options.tooltip.style.color = this.theme.tooltipColor

      options.tooltip.pointFormatter = function() {
        if (!this.y) return ''

        const isPrice =
          this.series.options.id === 'price' ||
          (this.series.linkedParent &&
            this.series.linkedParent.options.id === 'price')

        const formatter = isPrice ? formatPrice : formatAmount

        return `<b>${this.series.name}</b> ${formatter(this.y)}`
      }

      options.chart.events = {
        _panStart: () => (this.panning = true),
        _panEnd: () => (this.panning = false),
        _pan: () => {
          const isPanned = this.chart.xAxis[0].max < this.chart.xAxis[0].dataMax

          if (!isPanned !== this.isSnaped) {
            this.$store.commit('toggleSnap', !isPanned)
          }
        },
        load: () => {
          setTimeout(this.applyChartStyles.bind(this), 200)
        },
      }

      return options
    },
    applyChartStyles() {
      if (this.chartVolumeOpacity < 1) {
        this.chart.series[1].group.element.style.opacity = this.chartVolumeOpacity
        this.chart.series[2].group.element.style.opacity = this.chartVolumeOpacity
      }

      if (!this.chartSma) {
        this.chart.series[6].update({ visible: false })
      } else if (this.chartSmaLength) {
        this.chart.series[6].update({ params: { period: this.chartSmaLength } })
      }

      if (!this.chartVolumeAverage) {
        this.chart.series[4].update({ visible: false })
        this.chart.series[5].update({ visible: false })
      } else if (this.chartVolumeAverageLength) {

        this.chart.series[4].update({
          params: { period: this.chartVolumeAverageLength },
        })
        this.chart.series[5].update({
          params: { period: this.chartVolumeAverageLength },
        })
      }
    },
    onClean(min) {
      this.redrawChart()
    },
  },
}
</script>

<style lang="scss">
@import '../../assets/sass/variables';

.chart__range {
  display: flex;
  justify-content: space-between;
  position: absolute;
  width: 100%;
  height: 0px;
  font-size: 14px;
  opacity: 0.4;
  font-family: monospace;
  font-weight: 300;
  letter-spacing: -0.5px;

  > div {
    padding: 10px;
  }
}

.chart__container {
  position: relative;
  width: calc(100% + 1px);

  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  .highcharts-container {
    width: 100% !important;
  }

  .chart__selection {
    position: absolute;
    top: 0;
    bottom: 0;
    background-color: rgba(white, 0.1);
    z-index: 1;
    pointer-events: none;
  }

  &.fetching {
    opacity: 0.5;
  }

  .highcharts-credits {
    visibility: hidden;
  }
}

.chart__scale-handler,
.chart__height-handler {
  position: absolute;
  bottom: 0;
  z-index: 2;
}

.chart__scale-handler {
  &.-y {
    right: 0;
    top: 0;
    width: 2em;
    cursor: ns-resize;
  }

  &.-x {
    bottom: 0;
    left: 0;
    right: 0;
    height: 1.5em;
    cursor: ew-resize;
  }
}

.chart__height-handler {
  left: 0;
  right: 0;
  height: 8px;
  margin-top: -4px;
  cursor: row-resize;

  @media screen and (min-width: 768px) {
    display: none;
  }
}

.chart__scale-mode {
  font-size: 14px;
  display: flex;
  align-items: center;
  z-index: 3;
  cursor: pointer;

  i {
    font-size: 14px;
    margin-left: 5px;
  }

  &:hover {
    opacity: 1;
  }
}

.chart__dirty-notice {
  background-color: rgba(black, 0.5);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  z-index: 4;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-direction: column;
  text-align: center;

  font-size: 1em;

  > strong {
    margin: 0 10%;
    font-weight: 600;
  }

  > p:nth-child(2) {
    margin: 1em 20%;
  }

  button {
    font-size: 1.2em;
  }
}

.chart__notice {
  position: absolute;
  z-index: 1;
  max-width: 200px;
  left: 50%;
  transform: translateX(-50%);

  text-align: center;
  font-size: 0.75em;
  margin-top: 1em;

  color: lighten($red, 10%);
}

.chart-controls {
  position: absolute;
  left: 0;
  right: 0;

  > div > div {
    position: relative;
  }

  &__left {
    position: absolute;
    top: 1em;
    left: 1em;
  }

  &__right {
    position: absolute;
    top: 1em;
    right: 1em;
    text-align: right;
  }
}

.highcharts-tooltip-box tspan {
  font-weight: 400 !important;
}

.highcharts-yaxis-grid path:first-child {
  display: none;
}
</style>
