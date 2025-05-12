import React, { useEffect, useState } from "react";
import { fetchStocks, fetchStockPrices } from "../services/api";
import {
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  CircularProgress,
  TextField,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const StockPage = () => {
  const [stocks, setStocks] = useState<{ [name: string]: string }>({});
  const [selectedTicker, setSelectedTicker] = useState("");
  const [minutes, setMinutes] = useState(30);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStocks().then(setStocks);
  }, []);

  useEffect(() => {
    if (!selectedTicker) return;
    setLoading(true);
    fetchStockPrices(selectedTicker, minutes).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [selectedTicker, minutes]);

  const average =
    data.length > 0
      ? data.reduce((sum, d) => sum + d.price, 0) / data.length
      : 0;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Stock Price Viewer
      </Typography>
      <FormControl fullWidth sx={{ my: 2 }}>
        <InputLabel>Select Stock</InputLabel>
        <Select
          value={selectedTicker}
          label="Select Stock"
          onChange={(e) => setSelectedTicker(e.target.value)}
        >
          {Object.entries(stocks).map(([name, ticker]) => (
            <MenuItem key={ticker} value={ticker}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Time Frame (minutes)"
        type="number"
        value={minutes}
        onChange={(e) => setMinutes(parseInt(e.target.value))}
        fullWidth
        sx={{ my: 2 }}
      />
      {loading ? (
        <CircularProgress />
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <XAxis dataKey="lastUpdatedAt" hide />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#8884d8" dot />
            <ReferenceLine y={average} label="Avg" stroke="red" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default StockPage;
