import { KiteConnect } from "kiteconnect";
import { configDotenv } from "dotenv";
import createFile from "../helpers/createFile.js";

configDotenv();

const api_Key = process.env.ZERODHA_API_KEY;
const api_secret = process.env.ZERODHA_API_SECRET;

const kc = new KiteConnect(
    {
        api_key: api_Key
    }
);

const getTokens = async (req, res) => {

    try {

        const {accessToken, name} = req.body;

        if(!accessToken || !name) {
            res.status(400).json(
                {
                    success: false,
                    message: "Please fill the accessToken and name"
                }
            );
        }

        kc.setAccessToken(accessToken);
        const instrument = await kc.getInstruments("NSE");
        console.log(instrument);

        createFile(instrument, "instrument ids", name);

        res.status(200).json(
            {
                success: true,
                message: "Instrument id fetched from NSE successfully"
            }
        );

        
    } catch (error) {
        console.log(error);
        console.log("Execution is at error block of getTokens function");
        console.error(error);

        res.status(500).json(
            {
                success: false,
                data: error.message,
                message: "Internal server error please check your code"
            }
        );
        
    }

}

export default getTokens;