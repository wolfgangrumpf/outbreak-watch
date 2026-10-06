# Tracker data schema (JSON in `<script id="tracker-data">`)

All text is written in the tracker's own words; there are no long quotes.

| Field | Type | Notes |
|---|---|---|
| `title` | string | Page H1 and `<title>` (the title is baked in at build time). Two to four words, e.g. "Irkutsk Plague Watch". |
| `eyebrow` | string | Small line above the title, e.g. "Outbreak watch · nexus Irkutsk Oblast, Russia". |
| `sweepHours` | number | Sweep interval; drives the "Next ≈" label. Default 24. |
| `schema` | 1 | |
| `lastSweep` | ISO UTC | Time of this sweep. |
| `sweepNumber` | int | +1 per sweep. |
| `nexus` | {name, lat, lon} | Index site; the origin for distances and rings. |
| `level` | int | Index into `levels`. Raise only on evidence; never lower without an official resolution. |
| `levels` | string[6] | Escalation ladder, L0–L5. |
| `summary` | string | 3–5 sentences: the state of play now. |
| `figures` | [{label, value, sub, status}] | Headline tiles. `value` is a string ("~200", "1–5", "No"). |
| `keyDates` | {indexDate, indexLabel, incubationMaxDays?, quarantineDays?, …} | `indexDate` is YYYY-MM-DD. The incubation and quarantine tiles are computed from it, and each is skipped if its field is absent. |
| `assessment` | string[] | Paragraphs: spread risk, information quality, timing, geographic exposure. |
| `watchFor` | string[] | Concrete escalation and de-escalation signals, with dates where known. |
| `sites` | [{id, name, lat, lon, kind, pop, note, inset?, label?, mainLabel?}] | `kind`: index, quarantine, hub, watch or focus. `inset: true` shows the site on the inset only (unless it's the index). `label` is the short map label. |
| `timeline` | [{date, text, status, src[]}] | Append only, in chronological order. |
| `claims` | [{claim, status, note}] | Contested items. Update status as they resolve. |
| `regions` | [{name, country, status, note, src[]}] | `status` adds `none` (shown as "no reports"). |
| `history` | [{t, deaths, contacts, secondary, countriesMeasures, level}] | One per sweep; feeds the sparklines. Rename the metrics in the template if the event needs others. |
| `log` | [{t, n, changes}] | One per sweep. |
| `sources` | [{id, outlet, title, url, type}] | Ids are s1, s2, … continuing from the highest. `type`: official, state, independent, intl, regional, academic, aggregator, low. |
| `map` | object | See below. |

Status labels (all lists): **official** (a government or WHO statement, possibly contested), **confirmed** (multiple independent outlets agree), **reported** (one outlet), **unverified** (anonymous or social media, including Telegram), **disputed** (contradicted by a credible source).

## `map`

```json
{
  "main":  {"lonMin":88,"lonMax":120.5,"latMin":46.5,"latMax":57.5},
  "inset": {"lonMin":103.45,"lonMax":105.15,"latMin":51.38,"latMax":52.7},
  "caption": "…", "insetCaption": "…", "note": "optional override of the distance note",
  "ringsKm": [300,600], "insetRingKm": 15,
  "insetLabels": [["Lake Baikal",104.75,51.62]],
  "labelOffsets": {"main": {"siteId":[dx,dy,"end"?]}, "inset": {…}},
  "geo": {
    "water":   [ [[lon,lat],…] ],
    "borders": [ [[lon,lat],…] ],
    "rail":    [ [[lon,lat],…] ],
    "labels":  [["REGION",lon,lat], ["Lake name",lon,lat,true]]
  }
}
```

Omit `inset` to get a single full-width map. Sites outside `main` are skipped on the map (logged to the console) but still listed in the hubs table. Equirectangular projection with cos(lat) scaling: keep the bounds under about 35° wide.
