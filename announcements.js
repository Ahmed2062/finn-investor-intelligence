const feedUrl = "https://archives.nseindia.com/content/RSS/Online_announcements.xml";
const names = { RELIANCE: "Reliance Industries", HDFCBANK: "HDFC Bank", TCS: "Tata Consultancy Services", BHARTIARTL: "Bharti Airtel", TATAMOTORS: "Tata Motors", SUNPHARMA: "Sun Pharmaceutical", INFY: "Infosys", ITC: "ITC", ICICIBANK: "ICICI Bank", LT: "Larsen & Toubro", MARUTI: "Maruti Suzuki", TITAN: "Titan", AXISBANK: "Axis Bank", ASIANPAINT: "Asian Paints", NTPC: "NTPC", POWERGRID: "Power Grid", BAJFINANCE: "Bajaj Finance", HINDUNILVR: "Hindustan Unilever" };
const unescapeXml = s => s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").trim();
const field = (xml, tag) => { const m = xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i")); return m ? unescapeXml(m[1]) : ""; };
const classify = title => { const t=title.toLowerCase(); if(/result|financial results|board meeting|earnings/.test(t))return "results"; if(/acqui|merger|demerger|joint venture/.test(t))return "m&a"; if(/appoint|resign|cessation|retire|director|key managerial/.test(t))return "management_change"; if(/dividend|record date/.test(t))return "dividend"; if(/credit rating|rating rationale/.test(t))return "credit_rating"; if(/pledge|encumbrance/.test(t))return "pledging"; if(/litigation|order|penalty|fine|sebi/.test(t))return "litigation"; if(/capex|capital expenditure|plant|capacity/.test(t))return "capex"; if(/insider|trading window|shareholding/.test(t))return "insider_trading"; if(/transcript|earnings call|concall/.test(t))return "earnings_call"; return "unclassified"; };
module.exports = async (req, res) => {
  try {
    const response = await fetch(feedUrl, { headers: { "User-Agent": "FINN-demo/1.0", "Accept": "application/rss+xml, application/xml, text/xml" } });
    if (!response.ok) throw new Error(`NSE RSS returned ${response.status}`);
    const xml = await response.text(), items = [...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)].map(m => {
      const title=field(m[1],"title"), description=field(m[1],"description"), link=field(m[1],"link"), pubDate=field(m[1],"pubDate");
      const haystack=(title+" "+description).toLowerCase();
      const found=Object.entries(names).find(([sym,name])=>haystack.includes(sym.toLowerCase())||haystack.includes(name.toLowerCase()));
      return { title, description: description.replace(/<[^>]+>/g," ").slice(0,350), link, pubDate, symbol: found?.[0] || null, category: classify(title) };
    }).filter(x=>x.title).filter(x=>x.symbol);
    const days=Math.min(7,Math.max(1,Number(req.query.days)||1)), since=Date.now()-days*86400000;
    const recent=items.filter(x=>{const t=Date.parse(x.pubDate);return !Number.isFinite(t)||t>=since;});
    res.setHeader("Cache-Control","s-maxage=300, stale-while-revalidate=1800");
    return res.status(200).json({ fetchedAt:new Date().toISOString(), source:feedUrl, announcements:recent });
  } catch (error) { return res.status(502).json({ error:"Live NSE announcements unavailable; retry later.", detail:error.message }); }
};
