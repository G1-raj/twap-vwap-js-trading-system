The flow of the program starts with login function when we execute login function and login with zerodha(Indian stock broker) then it will redirect us and generate access token.

That access token is being used everywhere in program

Then first we execute insrument id-s function so we can get all the instrument id-s for stocks and FnO contracts with help of these id-s we will going to fetch live price data

Now we will establish websocket connection with market to fetch live price and execute our strategy to place trades with help of risk managment and our strategy