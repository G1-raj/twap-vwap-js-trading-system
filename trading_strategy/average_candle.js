const average = (open, low, high, close) => {

    const price = (open + low + high + close) / 4;
    return price

}

export default average;