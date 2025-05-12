import axios from "axios";

const API_BASE = "http://20.244.56.144/evaluation-service/stocks";

export const fetchStocks = async () => {
  const res = await axios.get(API_BASE);
  return res.data.stocks;
};

export const fetchStockPrices = async (ticker: string, minutes: number) => {
  const res = await axios.get(`${API_BASE}/${ticker}?minutes=${minutes}`);
  return res.data;
};
