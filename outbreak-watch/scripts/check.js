// Usage: node check.js PAGE.html   — exits 1 on any problem.
const fs = require("fs");
const h = fs.readFileSync(process.argv[2], "utf8");
const errs = [], warn = [];
if (/<!doctype/i.test(h)) errs.push("file still has the service <!doctype> wrapper — run tracker.py strip");
if (!h.trimStart().startsWith("<title>")) errs.push("file must start with <title>");
if (h.includes("{{TITLE}}") || h.includes("__TRACKER_DATA__")) errs.push("template placeholders left in file");
const m = h.match(/<script id="tracker-data" type="application\/json">([\s\S]*?)<\/script>/);
let D;
try { D = JSON.parse(m[1]); } catch (e) { errs.push("JSON: " + e.message); }
if (D) {
  const req = ["title","lastSweep","sweepNumber","level","levels","summary","figures","sites","timeline","claims","regions","sources","history","log","nexus","keyDates","map"];
  req.filter(k => !(k in D)).forEach(k => errs.push("missing key " + k));
  if (!(D.level >= 0 && D.level < (D.levels || []).length)) errs.push("level out of range: " + D.level);
  const ids = new Set((D.sources || []).map(s => s.id));
  if (ids.size !== (D.sources || []).length) errs.push("duplicate source ids");
  [...(D.timeline || []), ...(D.regions || [])].forEach(r => (r.src || []).forEach(id => { if (!ids.has(id)) errs.push("unknown source id " + id); }));
  const ST = ["official","confirmed","reported","unverified","disputed"];
  (D.timeline || []).forEach(t => { if (!ST.includes(t.status)) errs.push("bad timeline status " + t.status); if (!/^\d{4}-\d{2}-\d{2}$/.test(t.date)) errs.push("bad date " + t.date); });
  (D.claims || []).forEach(c => { if (!ST.includes(c.status)) errs.push("bad claim status " + c.status); });
  const K = ["index","quarantine","hub","watch","focus"];
  (D.sites || []).forEach(s => { if (!K.includes(s.kind)) errs.push("bad site kind " + s.id); if (!(Math.abs(s.lat) <= 90 && Math.abs(s.lon) <= 180)) errs.push("bad coords " + s.id); });
  if (!D.keyDates || !D.keyDates.indexDate) errs.push("keyDates.indexDate missing");
  if (!D.map || !D.map.main) errs.push("map.main bounds missing");
  if (D.history && D.log && D.history.length !== D.log.length) warn.push("history and log lengths differ");
  if (isNaN(Date.parse(D.lastSweep))) errs.push("lastSweep not ISO");
  // aggregator homepages should not back specific facts
  const agg = new Set((D.sources || []).filter(s => s.type === "aggregator").map(s => s.id));
  (D.timeline || []).forEach(t => (t.src || []).forEach(id => { if (agg.has(id) && t.src.length === 1) warn.push(`timeline item cites only aggregator ${id}: "${t.text.slice(0,50)}…"`); }));
}
const js = h.match(/<script>\n([\s\S]*?)<\/script>/);
try { new Function(js[1]); } catch (e) { errs.push("page script does not compile: " + e.message); }
warn.forEach(w => console.log("WARN", w));
if (errs.length) { errs.forEach(e => console.log("ERROR", e)); process.exit(1); }
console.log(`OK — sweep #${D.sweepNumber}, level L${D.level}, ${D.sources.length} sources, ${D.timeline.length} events`);
