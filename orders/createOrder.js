import { KiteConnect } from "kiteconnect";
import calculateQantity from "../trade_functions/quantity.js";


const api_Key = process.env.ZERODHA_API_KEY;
const access_token = process.env.ZERODHA_ACCESS_TOKEN;
const kc = new KiteConnect(
    {
        api_key: api_Key,
    }
);



kc.setAccessToken(access_token);
const order = async (tradingsymbol, transactionType, close) => {

    try {

        let quantity = calculateQantity(10000, close);
        

        const Order = await kc.placeOrder(kc.VARIETY_REGULAR,
            {
                exchange: kc.EXCHANGE_NSE,
                tradingsymbol: tradingsymbol,
                transaction_type: transactionType,
                quantity: quantity,
                product: "MIS",
                order_type: "LIMIT",
                price: close,
            }
        );

        console.log("Order summary: " + Order);
        
    } catch (error) {

        console.log(error);
        console.log("error in creating order");
        console.log("Execution is at catch block of createOrderFunction");
        
    }

}

export default order;