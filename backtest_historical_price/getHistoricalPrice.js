import { KiteConnect } from "kiteconnect";
import { configDotenv } from "dotenv";
import sanitize from "../helpers/sanitizeFile.js";
import fs from 'fs';
import formatDate from "../helpers/formatData.js";

configDotenv();

const api_Key = process.env.ZERODHA_API_KEY;
const api_secret = process.env.ZERODHA_API_SECRET;

const kc = new KiteConnect(
    {
        api_key: api_Key
    }
);

const getHistoricalData = async (req, res) => {

    try {

        const {accessToken, token, interval, from, to, continous} = req.body;
        if(!accessToken || !token || !interval || !from || !to) {
            res.status(400).json(
                {
                    success: false,
                    message: "Please fill out the required data"
                }
            );
        }

        kc.setAccessToken(accessToken);
        const price = await kc.getHistoricalData(token, interval, from, to , continous);
        console.log("Executed successfully")

        const priceJson = JSON.stringify(price, null, 2);
        const formattedfrom = formatDate(from);
        let file = `${formattedfrom}.js`;
        file = file.replace(/[:\s]/g, "-");
        const fileContent = `const data = ${priceJson};`;
        fs.writeFileSync(file, fileContent, "utf-8");

        res.status(200).json(
            {
                success: true,
                message: `Data fetched successfully for instrument id: ${token}`,
                data: price
            }
        );
        
    } catch (error) {
        console.log(error);
        console.log("Execution is at catch block of getHistorical Data function");
        console.error(error);

        res.status(500).json(
            {
                success: false,
                message: "Internal Server error please check your code"
            }
        );
        
    }

}



export default getHistoricalData;