import express from 'express';
import getTokens from '../backtest_historical_price/getNseTokens.js';
import getHistoricalData from '../backtest_historical_price/getHistoricalPrice.js';

const routes = express.Router();

routes.post("/getTokens", getTokens);
routes.post("/historyPrice", getHistoricalData);

export default routes;