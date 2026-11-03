const PORTFOLIO = ["RELIANCE", "HDFCBANK", "TCS", "BHARTIARTL", "TATAMOTORS", "SUNPHARMA", "INFY", "ITC", "ICICIBANK", "LT", "MARUTI", "TITAN", "AXISBANK", "ASIANPAINT", "NTPC", "POWERGRID", "BAJFINANCE", "HINDUNILVR"];

module.exports = async (req, res) => {
  const requested = String(req.query.symbols || PORTFOLIO.join(",")).split(",").map(x => x.trim().toUpperCase()).filter(Boolean);
  const symbols = [...new Set(requested)].filter(x => PORTFOLIO.includes(x));
  if (!symbols.length) return res.status(400).json({ error: "No supported portfolio symbols requested." });
  try {
    const results = await Promise.all(symbols.map(async symbol => {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.NS?range=1mo&interval=1d`;
      const response = await fetch(url, { headers: { "User-Agent": "FINN-demo/1.0" } });
      if (!response.ok) throw new Error(`${symbol}: upstream ${response.status}`);
      const payload = await response.json();
      const result = payload.chart?.result?.[0];
      if (!result) throw new Error(`${symbol}: no chart data`);
      const q = result.indicators.quote[0], closes = (q.close || []).filter(Number.isFinite), vols = (q.volume || []).filter(Number.isFinite);
      if (closes.length < 2) throw new Error(`${symbol}: insufficient history`);
      const last = closes.at(-1), prev = closes.at(-2), recent = vols.slice(-21, -1), avg = recent.length ? recent.reduce((a,b)=>a+b,0)/recent.length : null;
      return { symbol, price: last, previousClose: prev, changePct: (last / prev - 1) * 100, volume: vols.at(-1) || null, averageVolume20d: avg, volumeMultiple: avg ? vols.at(-1)/avg : null, timestamp: result.timestamp.at(-1), currency: result.meta.currency, source: `https://finance.yahoo.com/quote/${symbol}.NS/` };
    }));
    res.setHeader("Cache-Control", "s-maxage=900, stale-while-revalidate=3600");
    return res.status(200).json({ fetchedAt: new Date().toISOString(), source: "Yahoo Finance chart data (unofficial endpoint; EOD bars)", prices: results });
  } catch (error) {
    return res.status(502).json({ error: "Live price source unavailable; retry later.", detail: error.message });
  }
};
