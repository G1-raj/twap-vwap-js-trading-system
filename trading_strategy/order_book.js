import { configDotenv } from "dotenv";
import { KiteTicker } from "kiteconnect";


const api_Key = "t5it7hu9a8gmbjo2";
const access_token = "lJ6feStOL3WuLwZha02N5eltgiQtk59P";

const ticker = new KiteTicker(
    {
        api_key: api_Key,
        access_token: access_token
    }
);

const token = 492033;


ticker.connect();
ticker.on("ticks", onTicks);
ticker.on("connect", subscribe);
ticker.on("error", onError);

function onTicks(ticks) {
    
    let last_traded_price = ticks[0].last_price;
    console.log(`Last traded price is: ${last_traded_price}`);

    console.log(`This is order book of token: ${token}`);
    orderBook(ticks);

}

function subscribe() {
    ticker.subscribe([token]);
    ticker.setMode(ticker.modeFull, [token]);
}

function onError() {
    console.log("Websocket error: ");
    console.log(err);
}

function orderBook(ticks) {
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