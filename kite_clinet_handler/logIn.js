import { KiteConnect } from "kiteconnect";
import { configDotenv } from "dotenv";

configDotenv();

const api_Key = process.env.ZERODHA_API_KEY;
//const api_secret = process.env.ZERODHA_API_SECRET;

const kc = new KiteConnect(
    {
        api_key: api_Key
    }
);

const logIn = (req, res) => {
    try {

        const loginUrl = kc.getLoginURL();
        res.redirect(loginUrl);
        
        console.log("Log in function executed successfully");
    } catch (error) {
        console.log(error);
        console.log("Execution is at catch block of login function");

        res.status(500).json(
            {
                success: false,
                message: "Internal Server Error please check your code"
            }
        );
        
    }
}

export default logIn;