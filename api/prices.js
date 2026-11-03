const PORTFOLIO = ["RELIANCE", "HDFCBANK", "TCS", "BHARTIARTL", "TATAMOTORS", "SUNPHARMA", "INFY", "ITC", "ICICIBANK", "LT", "MARUTI", "TITAN", "AXISBANK", "ASIANPAINT", "NTPC", "POWERGRID", "BAJFINANCE", "HINDUNILVR"];
const RESEARCH_SYMBOLS = [...PORTFOLIO, "ZOMATO", "ADANIPORTS"];
const YAHOO_SYMBOLS = { TATAMOTORS: "TMPV", ZOMATO: "ETERNAL" };

module.exports = async (req, res) => {
  const requested = String(req.query.symbols || req.query.symbol || PORTFOLIO.join(",")).split(",").map(x => x.trim().toUpperCase()).filter(Boolean);
  const symbols = [...new Set(requested)];
  const unsupported = symbols.filter(x => !RESEARCH_SYMBOLS.includes(x));
  if (unsupported.length) return res.status(400).json({ error: "Unsupported NSE symbol.", unsupported, supported: RESEARCH_SYMBOLS });
  if (!symbols.length) return res.status(400).json({ error: "Provide at least one supported NSE symbol." });
  try {
    const results = await Promise.all(symbols.map(async symbol => {
      const yahooSymbol = YAHOO_SYMBOLS[symbol] || symbol;
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}.NS?range=1mo&interval=1d`;
      const response = await fetch(url, { headers: { "User-Agent": "FINN-demo/1.0" } });
      if (!response.ok) throw new Error(`${symbol}: upstream ${response.status}`);
      const payload = await response.json();
      const result = payload.chart?.result?.[0];
      if (!result) throw new Error(`${symbol}: no chart data`);
      const q = result.indicators?.quote?.[0] || {}, rawCloses = q.close || [], closes = rawCloses.filter(Number.isFinite), vols = (q.volume || []).filter(Number.isFinite);
      if (closes.length < 2) throw new Error(`${symbol}: insufficient history`);
      const last = closes.at(-1), prev = closes.at(-2), recent = vols.slice(-21, -1), avg = recent.length ? recent.reduce((a,b)=>a+b,0)/recent.length : null;
      const first = closes[0];
      const validTimestamps = result.timestamp || [];
      return { symbol, yahooSymbol, price: last, previousClose: prev, changePct: (last / prev - 1) * 100, monthChangePct: (last / first - 1) * 100, volume: vols.at(-1) ?? null, averageVolume20d: avg, volumeMultiple: avg && vols.at(-1) != null ? vols.at(-1)/avg : null, timestamp: validTimestamps.at(-1) || null, currency: result.meta?.currency || "INR", history: closes.slice(-22), source: `https://finance.yahoo.com/quote/${yahooSymbol}.NS/` };
    }));
    res.setHeader("Cache-Control", "s-maxage=900, stale-while-revalidate=3600");
    return res.status(200).json({ fetchedAt: new Date().toISOString(), source: "Yahoo Finance chart data (unofficial endpoint; EOD bars)", prices: results });
  } catch (error) {
    return res.status(502).json({ error: "Live price source unavailable; retry later.", detail: error.message });
  }
};
