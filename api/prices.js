const PORTFOLIO = ["RELIANCE", "HDFCBANK", "TCS", "BHARTIARTL", "TATAMOTORS", "SUNPHARMA", "INFY", "ITC", "ICICIBANK", "LT", "MARUTI", "TITAN", "AXISBANK", "ASIANPAINT", "NTPC", "POWERGRID", "BAJFINANCE", "HINDUNILVR"];

// Tata Motors Passenger Vehicles changed its NSE symbol to TMPV in October 2025.
// Keep the demo's portfolio key stable while querying the current Yahoo symbol.
const YAHOO_SYMBOL = { TATAMOTORS: "TMPV" };

async function fetchPrice(symbol) {
  const yahooSymbol = YAHOO_SYMBOL[symbol] || symbol;
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}.NS?range=1mo&interval=1d`;
  const response = await fetch(url, { headers: { "User-Agent": "FINN-demo/1.0" } });
  if (!response.ok) throw new Error(`Yahoo Finance returned ${response.status}`);

  const payload = await response.json();
  const result = payload.chart?.result?.[0];
  if (!result) throw new Error(payload.chart?.error?.description || "No chart data returned");

  const quote = result.indicators?.quote?.[0] || {};
  const closes = (quote.close || []).filter(Number.isFinite);
  const volumes = quote.volume || [];
  if (closes.length < 2) throw new Error("Insufficient price history");

  const last = closes.at(-1);
  const previousClose = closes.at(-2);
  const validVolumes = volumes.filter(Number.isFinite);
  const recentVolumes = validVolumes.slice(-21, -1);
  const averageVolume20d = recentVolumes.length
    ? recentVolumes.reduce((sum, value) => sum + value, 0) / recentVolumes.length
    : null;
  const volume = Number.isFinite(volumes.at(-1)) ? volumes.at(-1) : null;

  return {
    symbol,
    yahooSymbol,
    price: last,
    previousClose,
    changePct: (last / previousClose - 1) * 100,
    volume,
    averageVolume20d,
    volumeMultiple: averageVolume20d && volume !== null ? volume / averageVolume20d : null,
    timestamp: result.timestamp?.at(-1) || null,
    currency: result.meta?.currency || "INR",
    source: `https://finance.yahoo.com/quote/${yahooSymbol}.NS/`
  };
}

module.exports = async (req, res) => {
  const requested = String(req.query.symbols || PORTFOLIO.join(","))
    .split(",")
    .map(value => value.trim().toUpperCase())
    .filter(Boolean);
  const symbols = [...new Set(requested)].filter(symbol => PORTFOLIO.includes(symbol));
  if (!symbols.length) return res.status(400).json({ error: "No supported portfolio symbols requested." });

  const settled = await Promise.allSettled(symbols.map(fetchPrice));
  const prices = [];
  const errors = [];
  settled.forEach((result, index) => {
    if (result.status === "fulfilled") prices.push(result.value);
    else errors.push({ symbol: symbols[index], error: result.reason?.message || "Price source unavailable" });
  });

  res.setHeader("Cache-Control", "s-maxage=900, stale-while-revalidate=3600");
  if (!prices.length) {
    return res.status(502).json({ error: "Live price source unavailable; retry later.", errors });
  }
  return res.status(200).json({
    fetchedAt: new Date().toISOString(),
    source: "Yahoo Finance chart data (unofficial endpoint; EOD bars)",
    prices,
    errors
  });
};
