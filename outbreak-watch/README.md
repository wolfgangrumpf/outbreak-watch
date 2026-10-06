# outbreak-watch

A Claude skill for setting up and running a live outbreak / public-health incident tracker: a published page with an escalation ladder, source-status labels (official, confirmed, reported, unverified, disputed), a schematic map of hubs and corridors, and a daily multilingual news sweep that updates the page and sends a short notification.

- `SKILL.md`: instructions Claude follows (Mode A: set up a tracker; Mode B: run a sweep)
- `assets/tracker-template.html`: the page template (data-driven; no per-event code edits)
- `scripts/tracker.py`: build / strip / extract / inject helpers
- `scripts/check.js`: pre-publish validator
- `references/`: data schema, research playbook, scheduled-task prompt template
- `examples/irkutsk-plague-2026.json`: the first tracker (Irkutsk Oblast, Oct 2026)

Compiled from public reporting; not official statistics.
