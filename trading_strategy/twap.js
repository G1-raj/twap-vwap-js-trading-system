import average from "./average_candle.js";

const twap = ( open, high, low, close, volume) => {

    let totalWeightedPrice = 0;
    let totalVolume = 0;


        // let {open , high, low, close, volume} = price[index];
        let o = open;
        let h = high;
        let l = low;
        let c = close;
        let v = volume;
        let candle = average(o, h, l, c);
        
        totalWeightedPrice += candle * v;
        totalVolume += v;


    let twap = totalWeightedPrice / totalVolume;

    return twap;

}

export default twap;