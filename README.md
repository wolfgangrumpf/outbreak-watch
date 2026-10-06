# outbreak-watch

A Claude skill that sets up and runs a live outbreak / public-health incident tracker: a published page with an escalation ladder, source-status labels (official, confirmed, reported, unverified, disputed), a schematic map of hubs and corridors, and a scheduled multilingual news sweep that updates the page and pings you when things escalate.

Think of it as a weather radar for "is this one suspected case turning into a Thing?" — minus the cheerful meteorologist.

## Install

**Easiest:** download [`outbreak-watch.skill`](outbreak-watch.skill) and upload it in Claude's skills settings.

**From source:** the [`outbreak-watch/`](outbreak-watch) folder is the same skill, unpacked, so you can read or modify it. To repackage after editing:

```bash
cd /path/to/this/repo && zip -r outbreak-watch.skill outbreak-watch
```

## Usage

Ask Claude things like:

- "Track the suspected plague case in Irkutsk"
- "Set up a watch on the Marburg outbreak"
- "Run a sweep of my outbreak tracker"

## What's inside

| Path | Purpose |
|---|---|
| `outbreak-watch/SKILL.md` | Instructions Claude follows (Mode A: set up a tracker; Mode B: run a sweep) |
| `outbreak-watch/assets/tracker-template.html` | Data-driven page template |
| `outbreak-watch/scripts/tracker.py` | build / strip / extract / inject helpers |
| `outbreak-watch/scripts/check.js` | Pre-publish validator (`node check.js PAGE.html`) |
| `outbreak-watch/references/` | Data schema, research playbook, scheduled-task prompt template |
| `outbreak-watch/examples/irkutsk-plague-2026.json` | The first tracker (Irkutsk Oblast, Oct 2026) |

Run scripts with `python3 tracker.py ...` and `node check.js ...` — file permissions aren't preserved by GitHub web uploads.

## Quick self-test

```bash
python3 outbreak-watch/scripts/tracker.py build outbreak-watch/assets/tracker-template.html outbreak-watch/examples/irkutsk-plague-2026.json /tmp/test.html
node outbreak-watch/scripts/check.js /tmp/test.html
```

Expected: `OK — sweep #3, level L1, 38 sources, 21 events`.

## Disclaimer

Trackers are compiled from public reporting and are **not official statistics** or medical advice. For authoritative information, consult WHO, national public-health agencies, and local health authorities.

## License

MIT — see [LICENSE](LICENSE).
