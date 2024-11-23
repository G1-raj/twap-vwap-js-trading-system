import { KiteConnect } from "kiteconnect";
import { configDotenv } from "dotenv";

configDotenv();

const api_Key = process.env.ZERODHA_API_KEY;
const api_secret = process.env.ZERODHA_API_SECRET;

const kc = new KiteConnect(
    {
        api_key: api_Key
    }
);

const generateSession = async (req,res) => {

    try {

        const requestToken = req.query.request_token;
        const response = await kc.generateSession(requestToken, api_secret);
        kc.setAccessToken(response.access_token);
        console.log("access token: ", response.access_token);
        const profile = await kc.getProfile();

        console.log("Prfoile meta data is: ", profile);


        res.status(200).json(
            {
                success: true,
                data: profile,
                message: "Login successfully",
            }
        );
        
    } catch (error) {
        console.log(error);
        console.log("Execution is at catch block of generateSession function");

        res.status(500).json(
            {
                success: false,
                message: "Internal Server Error please check your code"
            }
        );
        
    }

}


export default generateSession;