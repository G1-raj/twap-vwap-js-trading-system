const calculateQantity = (capital, stockPrice) => {

    let leverage = capital * 5;
    let quantity = Math.ceil(leverage / stockPrice);

    return quantity;

}

export default calculateQantity;