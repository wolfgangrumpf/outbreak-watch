---
name: outbreak-watch
description: Set up and run a live outbreak / public-health incident tracker as a published Artifact page with scheduled multilingual news sweeps, an escalation ladder, source-status labels, a schematic map of hubs and corridors, and push alerts on escalation. Use when the user wants to watch, track, monitor or follow a disease outbreak, suspected case, lab incident, epidemic, or similar emerging event (e.g. "track this plague case", "set up a watch on the Marburg outbreak", "monitor H5N1 in Cambodia"), wants to run or fix a sweep of an existing tracker, change its schedule, or wind one down. Also use when a scheduled task asks for a tracker sweep.
---

# Outbreak Watch

A tracker is one **Artifact page** (built from `assets/tracker-template.html`) whose data lives in a single JSON block, plus one **scheduled task** that runs a daily sweep: research, update the JSON, check, republish, notify.

The first tracker was **Irkutsk Plague Watch** (Oct 2026). `examples/irkutsk-plague-2026.json` is its full data: use it as the reference for tone, depth and every field.

## Files

- `assets/tracker-template.html`: the page. Never edit its HTML/CSS/JS during a sweep. It holds `{{TITLE}}` and a `__TRACKER_DATA__` placeholder.
- `scripts/tracker.py`: `build` (template + JSON → page), `strip` (remove the service wrapper), `extract` / `inject` (JSON out of a page / back in).
- `scripts/check.js`: the pre-publish gate. Run it with `node check.js PAGE.html`. It exits 1 on errors.
- `references/data-schema.md`: every JSON field.
- `references/sweep-prompt.md`: the scheduled-task prompt template.
- `references/research-playbook.md`: sources, languages, status labels, escalation rules.
- `examples/irkutsk-plague-2026.json`: worked example.

Copy the skill folder somewhere writable (e.g. `/home/claude/ow/`) before running scripts.

## Mode A: set up a new tracker

1. **Scope it with the user** (one AskUserQuestion if they're present): the event, the nexus (index site), the geography to watch, the cadence (default daily, about 8am in their time zone), and whether they want push alerts.
2. **Research first** (see the playbook): build the baseline timeline, claims, regions, sources and figures. Aim for 20+ sources across the local language and English.
3. **Write the data JSON** following `references/data-schema.md`:
   - Write a 6-rung `levels` ladder suited to the event. The Irkutsk ladder works for most single-case incidents: no signal → suspected/contained → confirmed → local secondary → elsewhere in country or at a hub → abroad.
   - Fill `keyDates.indexDate`, `indexLabel` and the incubation / quarantine days for the pathogen.
   - Fill `sites` (index, quarantine sites, hubs, cities, natural foci) with real lat/lon. Use `mainLabel` on the index site if its main-map label should differ.
   - Set `map.main` bounds to frame all sites (about 30°×11° worked well), and an `inset` of about 1.5° around the nexus, or omit `inset`.
   - For `map.geo`, draw coarse polylines in [lon, lat]: borders, main rail or road corridors, large water bodies. Coarse is fine; the page labels them approximate.
   - Set `history`/`log` to one baseline entry each, with `sweepNumber` 1.
4. **Build and check** with `python3 tracker.py build assets/tracker-template.html data.json page.html`, then `node check.js page.html`. Render it once with Playwright (wrap it in a minimal doctype/body shell for local viewing only) and look at the map. Nudge `labelOffsets` where labels collide.
5. **Publish** `page.html` with the Artifact tool (new artifact, icon "map" or "chart"). The file must start with `<title>`; the service adds the skeleton itself.
6. **Schedule** with the remote scheduled-task tool (`create_trigger`, never local cron). Fill `references/sweep-prompt.md` with the artifact URL, event context and watch list. Use `CRON_TZ=<user tz>`, jittered a few minutes before the hour (e.g. `52 7 * * *` for "8am"). Turn on push notifications if they want alerts. Use one task per tracker. Don't run a separate silent evening task unless they ask; if they need faster escalation alerts, offer a separate midday check that alerts only on escalation.
7. Tell the user in one or two lines what the page is, the cadence, and the wind-down rule.

## Mode B: run a sweep (scheduled or on request)

Follow the steps in `references/sweep-prompt.md`. The essentials:

1. Read the artifact (action `read`, no `path`) and **Read every line** of the saved file it names; otherwise a republish is refused.
2. Copy that file, then run `tracker.py strip`. The read returns the page wrapped in a `<!doctype html><html><head>…<body>` skeleton plus `</body></html>`, which must come off before you republish.
3. Run `extract`, edit the JSON in Python, then `inject`. Never hand-retype the file.
4. Research everything since `lastSweep`, then update the fields (see the schema). Append to `timeline`, `sources`, `history` and `log`.
5. Run `node check.js`, fix everything it reports, and publish to the same `url`.
6. Write the final message, 3–6 lines (this is the notification). Escalation goes in the first line.

## Rules that came from real bugs

- **Wrapper:** always strip before you publish (check.js enforces this).
- **Source misattribution:** cite a source only if it actually supports that item. Never pin a new fact on an existing id such as an aggregator homepage; add a new source. check.js warns when an aggregator is the only cite.
- **Rerunning setup:** if a tracker was created manually just before the first scheduled run, the first gap is short. That's expected, not a cron bug.
- **Changing the cadence:** update the JSON `sweepHours` (it drives the page's "Next ≈" label) and the trigger. To retire a task that started the current session, **disable** it; deleting it deletes this session.
- **Unfetchable sources (403):** record them with the headline only, and say so in the run's bug report.
- **Contradictory official wording**, such as a neighbor's ministry paraphrasing the origin country: log it as a `reported` claim, not as fact.

## Wind-down

Once the index date is more than the quarantine period past (default 21 days) with level ≤ the "contained" rung and no secondary cases, the daily message suggests ending or reducing sweeps. On the user's yes, disable the task and add a final log entry ("Tracker closed"). The page stays as a record.

## Starting the next tracker from this one

Copy the example JSON, then replace everything event-specific (title, eyebrow, nexus, levels if needed, sites, map, timeline, claims, regions, sources), keeping the shape. Reset `sweepNumber`, `history` and `log`. The template needs no edits.
