import takeProfit from "../risk_management_system/takeProfit_system.js";
import twap from "./twap.js";

const trade = (open, high, low, close, volume, twap) => {
  
   // let twa = twap(open, high, low, close, volume);
   // console.log(`Twap is: ${twa}`);
    let openPosition = 0;

    let tp = 0;

    if(open > twap && close > twap && close > open) {
       openPosition = close;
       tp = takeProfit(openPosition);
        console.log("This is profit point" + tp.toFixed(3));

        return "BUY";

    }

    if(open < twap && close < twap && close < open) {
       // openPosition = price[i].close;
        return "SELL";
    }



    return "";

}

export default trade;