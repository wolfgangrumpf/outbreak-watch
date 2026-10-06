# Scheduled-task prompt template

Fill in the `<…>` parts and pass the result as `prompt` to `create_trigger`. Every firing starts a fresh session, so the prompt must stand alone. It points back at this skill, but it also restates the essentials in case the skill isn't installed in that session.

---

You maintain the "<TITLE>" tracker page for <USER>: <ARTIFACT_URL> . This is the DAILY sweep (about <HH>:00 <TZ>; the page's "Next" label assumes <sweepHours> h). <USER> reads its final message as the daily update. If the `outbreak-watch` skill is available, load it and follow Mode B.

Context: <2–4 sentences: index event, date, official vs reported cause, contacts>. Treat <NEXUS> as the nexus and watch the surrounding regions, expanding outward as needed: <REGION LIST>. Pay special attention to population centers and transport hubs (<HUB LIST>).

Steps:
1. Get the page file: call the Artifact tool with action "read" and the url above (no path). Read every line of the saved file it names. Copy it to /home/claude/work/page.html and STRIP THE SERVICE WRAPPER: delete everything before "<title>" and the trailing "</body></html>". Edit ONLY the JSON in <script id="tracker-data" type="application/json"> (extract it, change it in Python, inject it back). Never rewrite the HTML/CSS/JS.
2. Research everything new since "lastSweep". Search in <LANGUAGES> at minimum: <OFFICIAL SOURCES>, WHO/ECDC/CDC, <INDEPENDENT OUTLETS>, <STATE MEDIA>, regional sites near the nexus, neighboring health ministries, international wires, aggregators (for leads only) and Telegram claims (label unverified). Aim for 10–20 searches; fetch key articles.
3. Update the JSON: lastSweep (UTC ISO now), sweepNumber+1, level (0–5 per "levels"; raise only on evidence), summary, figures, keyDates if needed, assessment (keep the day count current), watchFor, sites (lat/lon; kind index|quarantine|hub|watch|focus), timeline (append; status official|confirmed|reported|unverified|disputed; source ids), claims, regions, sources (new ids continue from the highest sN). Cite a source only if it supports that item; never reuse an existing id (e.g. an aggregator homepage) for a new fact. Append one history {t,<METRICS>,level} and one log {t,n,changes}. Write in your own words, no long quotes.
4. Sanity check: node must confirm that the JSON parses, every src id exists, the level is in range, the file has no "<!doctype" and starts with "<title>", and the page script compiles. (If the skill is available, run scripts/check.js.) Fix any errors.
5. Publish with the Artifact tool, passing url <ARTIFACT_URL> and the file path. Don't create a new artifact. On a conflict, merge your JSON into the returned version and publish again.
6. Final message (the notification), 3–6 lines: level and whether it changed, the key developments, anything near a population center or hub, and a one-line spread-risk read. Put any escalation (level rose, confirmed secondary case, case outside <NEXUS REGION>, case at a hub) in the first line. Add a short "Your to-do" only if <USER> must act.
7. Wind-down: after <INDEX DATE + QUARANTINE DAYS>, if the level is still ≤<CONTAINED RUNG> with no secondary cases, suggest ending or reducing the sweeps.
Report any bugs you hit in the page or this process at the end of the message.
