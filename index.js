import express from 'express';
import { configDotenv } from 'dotenv';
import generateSession from './kite_clinet_handler/getProfile.js';
import logIn from './kite_clinet_handler/logIn.js';
import { KiteConnect } from 'kiteconnect';
import routes from './routes/routes.js';


configDotenv();

const app = express();
const port = process.env.PORT || 4000;
app.use(express.json());
app.use("/api/v1", routes);

const api_Key = process.env.ZERODHA_API_KEY;
const api_secret = process.env.ZERODHA_API_SECRET;

const kc = new KiteConnect(
    {
        api_key: api_Key
    }
);

app.listen(port, () => {
    console.log(`Trading system is running at port: ${port}`);
});

app.get("/", (req, res) => {
    res.send("<h1>Welocme to trading system</h1>");
});

app.get("/login", logIn);
app.get("/redirect", generateSession);


