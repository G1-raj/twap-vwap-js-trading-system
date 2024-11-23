const takeProfit = (buyPrice) => {

    let profitPoints = (0.07 / 100) * buyPrice;
    let exitPrice = buyPrice + profitPoints;

    return exitPrice;
}

export default takeProfit;