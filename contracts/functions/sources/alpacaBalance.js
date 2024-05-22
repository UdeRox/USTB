console.log("0000000 ", JSON.stringify(secrets.alpacaSecret));
console.log("0000000 ", JSON.stringify(secrets.alpacaKey));
if (secrets.alpacaKey == "" || secrets.alpacaSecret == "") {
  throw new Error(">>>>>> need alpaca keys");
}

const alpacaRequest = Functions.makeHttpRequest({
  url: "https://paper-api.alpaca.markets/v2/account",
  headers: {
    accept: "application/json",
    method: 'GET',
    "APCA-API-KEY-ID": secrets.alpacaKey,
    "APCA-API-SECRET-KEY": secrets.alpacaSecret,
  },
});

const [response] = await Promise.all([alpacaRequest]);

console.log("|||||||| ", response);
const portfolioBalance = response.data.portfolio_value;
console.log("Balance of portfolio: " + portfolioBalance);

return Functions.encodeUint256(Math.round(portfolioBalance * 100));
