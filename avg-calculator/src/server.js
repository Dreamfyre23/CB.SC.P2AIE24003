const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
const TIMEOUT_MS = 500;

const numberStore = [];

const apiMap = {
  p: "http://20.244.56.144/evaluation-service/primes",
  f: "http://20.244.56.144/evaluation-service/fibo",
  e: "http://20.244.56.144/evaluation-service/even",
  r: "http://20.244.56.144/evaluation-service/rand",
};

app.get("/numbers/:numberid", async (req, res) => {
  const { numberid } = req.params;

  const apiUrl = apiMap[numberid];
  if (!apiUrl) {
    return res.status(400).json({ error: "Invalid number ID" });
  }

  const windowPrevState = [...numberStore];

  let numbersResponse;
  try {
    numbersResponse = await axios.get(apiUrl, {
      timeout: TIMEOUT_MS,
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ3MDU0MDY2LCJpYXQiOjE3NDcwNTM3NjYsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjhlNzVhYjY3LWQxYzQtNDM0Yy04ZmUyLTU3MWFjNWZiMWI0MCIsInN1YiI6ImNiLnNjLnAyYWllMjQwMDNAY2Iuc3R1ZGVudHMuYW1yaXRhLmVkdSJ9LCJlbWFpbCI6ImNiLnNjLnAyYWllMjQwMDNAY2Iuc3R1ZGVudHMuYW1yaXRhLmVkdSIsIm5hbWUiOiJkaW5lc2ggcmFtIHMgcCIsInJvbGxObyI6ImNiLnNjLnAyYWllMjQwMDMiLCJhY2Nlc3NDb2RlIjoiU3d1dUtFIiwiY2xpZW50SUQiOiI4ZTc1YWI2Ny1kMWM0LTQzNGMtOGZlMi01NzFhYzVmYjFiNDAiLCJjbGllbnRTZWNyZXQiOiJGdnpialJqS1BOSlVyVHFqIn0.oARhbgMTwv7j5I8clTImBzkYhqNcegC215q9PPcZYps",
      },
    });
  } catch (err) {
    // Timeout or request error — return early
    return res.json({
      windowPrevState,
      windowCurrState: windowPrevState,
      numbers: [],
      avg: average(numberStore),
    });
  }

  const incomingNumbers = numbersResponse.data.numbers || [];

  for (const num of incomingNumbers) {
    if (!numberStore.includes(num)) {
      numberStore.push(num);
    }
  }

  // Maintain window size
  while (numberStore.length > WINDOW_SIZE) {
    numberStore.shift();
  }

  const windowCurrState = [...numberStore];

  return res.json({
    windowPrevState,
    windowCurrState,
    numbers: incomingNumbers,
    avg: average(numberStore),
  });
});

function average(arr) {
  if (arr.length === 0) return 0;
  const sum = arr.reduce((acc, num) => acc + num, 0);
  return parseFloat((sum / arr.length).toFixed(2));
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
