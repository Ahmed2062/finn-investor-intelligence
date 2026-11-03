const feedUrl = "https://archives.nseindia.com/content/RSS/Online_announcements.xml";

// Match issuer names, not ticker substrings in arbitrary prose. For example,
// "LT" appears inside common words such as "results" and creates false hits.
const issuerAliases = {
  RELIANCE: ["Reliance Industries Limited", "Reliance Industries"],
  HDFCBANK: ["HDFC Bank Limited"],
  TCS: ["Tata Consultancy Services Limited", "Tata Consultancy Services"],
  BHARTIARTL: ["Bharti Airtel Limited", "Bharti Airtel"],
  TATAMOTORS: ["Tata Motors Passenger Vehicles Limited", "Tata Motors Passenger Vehicles"],
  SUNPHARMA: ["Sun Pharmaceutical Industries Limited", "Sun Pharmaceutical Industries"],
  INFY: ["Infosys Limited"],
  ITC: ["ITC Limited"],
  ICICIBANK: ["ICICI Bank Limited"],
  LT: ["Larsen & Toubro Limited", "Larsen and Toubro Limited", "Larsen & Toubro"],
  MARUTI: ["Maruti Suzuki India Limited", "Maruti Suzuki India"],
  TITAN: ["Titan Company Limited", "Titan Company"],
  AXISBANK: ["Axis Bank Limited"],
  ASIANPAINT: ["Asian Paints Limited"],
  NTPC: ["NTPC Limited"],
  POWERGRID: ["Power Grid Corporation of India Limited", "Power Grid Corporation of India"],
  BAJFINANCE: ["Bajaj Finance Limited"],
  HINDUNILVR: ["Hindustan Unilever Limited"]
};

const unescapeXml = value => value
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
  .replace(/&amp;/g, "&")
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">")
  .replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'")
  .trim();

const field = (xml, tag) => {
  const match = xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? unescapeXml(match[1]) : "";
};

const normalize = value => ` ${value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()} `;

const classify = value => {
  const text = value.toLowerCase();
  if (/financial results|quarterly results|unaudited results|audited results|earnings/.test(text)) return "results";
  if (/acqui|merger|demerger|joint venture/.test(text)) return "m&a";
  if (/appoint|resign|cessation|retire|director|key managerial/.test(text)) return "management_change";
  if (/dividend|record date/.test(text)) return "dividend";
  if (/credit rating|rating rationale/.test(text)) return "credit_rating";
  if (/pledge|encumbrance/.test(text)) return "pledging";
  if (/litigation|order|penalty|fine|sebi/.test(text)) return "litigation";
  if (/capex|capital expenditure|plant|capacity/.test(text)) return "capex";
  if (/insider|trading window|shareholding/.test(text)) return "insider_trading";
  if (/transcript|earnings call|concall/.test(text)) return "earnings_call";
  return "unclassified";
};

const findIssuer = value => {
  const normalized = normalize(value);
  for (const [symbol, aliases] of Object.entries(issuerAliases)) {
    if (aliases.some(alias => normalized.includes(normalize(alias)))) return symbol;
  }
  return null;
};

module.exports = async (req, res) => {
  try {
    const response = await fetch(feedUrl, {
      headers: {
        "User-Agent": "FINN-demo/1.0",
        "Accept": "application/rss+xml, application/xml, text/xml"
      }
    });
    if (!response.ok) throw new Error(`NSE RSS returned ${response.status}`);

    const xml = await response.text();
    const items = [...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)]
      .map(match => {
        const item = match[1];
        const title = field(item, "title");
        const description = field(item, "description");
        const link = field(item, "link");
        const pubDate = field(item, "pubDate");
        const symbol = findIssuer(title);
        return {
          title,
          description: description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 350),
          link,
          pubDate,
          symbol,
          category: classify(`${title} ${description}`)
        };
      })
      .filter(item => item.title && item.symbol);

    const days = Math.min(7, Math.max(1, Number(req.query.days) || 1));
    const since = Date.now() - days * 86400000;
    const recent = items.filter(item => {
      const timestamp = Date.parse(item.pubDate);
      return Number.isFinite(timestamp) && timestamp >= since;
    });

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=1800");
    return res.status(200).json({ fetchedAt: new Date().toISOString(), source: feedUrl, announcements: recent });
  } catch (error) {
    console.error("FINN announcement fetch failed:", error);
    return res.status(502).json({ error: "Live NSE announcements unavailable; retry later." });
  }
};
