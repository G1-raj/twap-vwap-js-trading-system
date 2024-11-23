const stopLoss = (buyPrice) => {

    let lossPoints = (0.07 / 100) * buyPrice;
    let exitPrice = buyPrice - lossPoints;

    return exitPrice;
}

export default stopLoss;