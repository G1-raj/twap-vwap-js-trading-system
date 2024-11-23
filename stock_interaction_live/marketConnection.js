import { configDotenv } from "dotenv";
import { KiteTicker } from "kiteconnect";
import moment from "moment";
import order from "../orders/createOrder.js";
import trade from "../trading_strategy/trade.js";
import TWAPCalculator from "../data_structure/twapQueue.js";

configDotenv();

const api_Key = process.env.ZERODHA_API_KEY;
const access_token = process.env.ZERODHA_ACCESS_TOKEN;

const ticker = new KiteTicker(
    {
        api_key: api_Key,
        access_token: access_token
    }
);




const tokenAndSymbol = [
    [341249, "HDFCBANK"],
    [1270529, "ICICIBANK"],
    [1510401, "AXISBANK"],
    [492033, "KOTAKBANK"],
    [1346049, "INDUSINDBK"],
    [779521, "SBIN"],
    [2953217, "TCS"],
    [408065, "INFY"],
    [969473, "WIPRO"],
    [1850625, "HCLTECH"],
    [3465729, "TECHM"],
    [4268801, "BAJAJFINSV"],
    [81153, "BAJFINANCE"],
    [5582849, "SBILIFE"],
    [119553, "HDFCLIFE"],
    [1102337, "SHRIRAMFIN"],
    [424961, "ITC"],
    [356865, "HINDUNILVR"],
    [4598529,  "NESTLEIND"],
    [140033, "BRITANNIA"],
    [878593, "TATACONSUM"],
    [2815745,  "MARUTI"],
    [519937, "M&M"],
    [232961, "EICHERMOT"],
    [345089, "HEROMOTOCO"],
    [4267265,  "BAJAJ-AUTO"],
    [884737,  "TATAMOTORS"],
    [857857, "SUNPHARMA"],
    [177665, "CIPLA"],
    [40193, "APOLLOHOSP"],
    [225537, "DRREDDY"],
    [895745, "TATASTEEL"],
    [3001089, "JSWSTEEL"],
    [348929, "HINDALCO"],
    [738561, "RELIANCE"],
    [2977281, "NTPC"],
    [633601, "ONGC"],
    [134657,  "BPCL"],
    [98049, "BEL"],
    [3834113, "POWERGRID"],
    [5215745, "COALINDIA"],
    [2714625, "BHARTIARTL"],
    [60417, "ASIANPAINT"],
    [897537, "TITAN"],
    [502785, "TRENT"],
    [2939649, "LT"],
    [2952193, "ULTRACEMCO"],
    [315393, "GRASIM"],
    [6401, "ADANIENT"],
    [3861249, "ADANIPORTS"],
];

const tokenMap = Object.fromEntries(tokenAndSymbol);
const tokenIds = Object.keys(tokenMap).map(Number);

let ticksData = [];
const candleDuration = 1;
let lastCandleTime = moment().startOf('day'); 
let lastCandleClose = null;
let twa = new TWAPCalculator(10);
let signal = "";


ticker.connect();
ticker.on("ticks", onTicks);
ticker.on("connect", subscribe);
ticker.on("error", onError);

function onTicks(ticks) {
    const now = moment();
    
    ticks.forEach(tick => {
        const symbol = tokenMap[tick.instrument_token];

        if (symbol) {
            if (!stockData[symbol]) {
                stockData[symbol] = [];
            }

            stockData[symbol].push(tick);
        }
    });

    if (now.diff(lastCandleTime, 'minutes') >= candleDuration) {
        Object.keys(stockData).forEach(async symbol => {
            const ticksForSymbol = stockData[symbol];
            const candleData = calculateCandleStrength(ticksForSymbol);
            candleDataMap[symbol] = candleData; // Store candle data for the symbol
            console.log(`Candle Data for ${symbol} ${lastCandleTime.format('HH:mm')} - ${now.format('HH:mm')}:`, candleData);
            const twapClose = twa.addClose(candleData.close);
            console.log(twa.toString());
            const twaPrice = twa.calculateTWAP();

            console.log("High of candle: ", candleData.high);
            console.log("Low of candle: ", candleData.low);
            console.log("Close of candle: ", candleData.close);
            console.log("Volume of candle: ", candleData.volume);
            
            console.log("Twap price is: " + twaPrice);
            
            //marketDepth(ticks);

            if (twa.tLength == 10) {
                signal = trade(candleData.open, candleData.high, candleData.low, candleData.close, candleData.volume, twaPrice);
                console.log("Signal is: " + signal);

                if (lastCandleClose !== null && signal == "BUY") {
                    order(symbol ,"SELL", candleData.close);
                }

                if (lastCandleClose !== null && signal == "SELL") {
                    order(symbol ,"BUY", candleData.close);
                }

                if (signal == "BUY" && candleData.strength > 0.3) {
                    order(symbol,"BUY", candleData.close);
                    lastCandleClose = candleData.close;
                }

                if (signal == "SELL" && candleData.strength > 0.3) {
                    order(symbol, "SELL", candleData.close);
                    lastCandleClose = candleData.close;
                }
            }
        });

        lastCandleTime = now;
        ticksData = [];
    }
}



function subscribe() {
    ticker.subscribe(tokenIds);
    ticker.setMode(ticker.modeFull, tokenIds);
}

function onError(err) {
    console.log("Websocket error: ");
    console.log(err);
}


function calculateCandleStrength(ticks) {

    if(ticks.length == 0) return {open: 0, high: 0, low: 0, close: 0, strength: 0, color: 'none', volume: 0}

    console.log("This is tick data in strength function: ");
    console.log(ticks);

    const open = ticks[0].last_price;
    const high = Math.max(...ticks.map(tick => tick.last_price));
    const low = Math.min(...ticks.map(tick => tick.last_price));
    const close = ticks[ticks.length - 1].last_price;
    const volume = ticks.reduce((acc, tick) => acc + (tick.volume_traded || 0), 0);;

    const bodySize = Math.abs(close - open);
    const candleRange = high - low;
    const strength = candleRange > 0 ? (bodySize / candleRange) : 0;
    const color = close > open ? "green" : close < open ? "red" : "doji";

    console.log("Open is: " + open);
    console.log("close is: " + close);
    console.log("volume is: " + volume);

    return {open, high, low, close, strength, color, candleRange, volume};

}

function marketDepth(ticks) {

    if(ticks.length > 0 && ticks[0].depth) {

        const bid = ticks[0].depth.buy;
        const ask = ticks[0].depth.sell;

        console.log("This is depth buy: ");
        console.log(bid);

        console.log("This is depth sell: ");
        console.log(ask);
        
        console.log("Bid is: ")
        bid.forEach((order, index) => {
            console.log(`Buy price is: ${order.price}, Buy quantity is: ${order.quantity}`)
        });

        console.log("Ask is: ")
        ask.forEach((order, index) => {
            console.log(`Ask price is: ${order.price}, Ask quantity is: ${order.quantity}`)
        });
    } else {
        console.log("Market Depth is not present");
    }
}





