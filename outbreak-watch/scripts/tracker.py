#!/usr/bin/env python3
"""Outbreak-watch page helper.

  build   TEMPLATE DATA.json OUT.html   new page from template + data (title taken from data.title)
  strip   IN.html OUT.html              remove the service skeleton a read adds (<!doctype ...<body> ... </body></html>)
  extract PAGE.html OUT.json            pull the tracker-data JSON out of a page
  inject  PAGE.html DATA.json           write DATA.json back into the page's tracker-data block (in place)
"""
import json, re, sys

BLOCK = re.compile(r'(<script id="tracker-data" type="application/json">)(.*?)(</script>)', re.S)

def read(p): return open(p, encoding="utf8").read()
def write(p, s): open(p, "w", encoding="utf8").write(s)
def dump(d): return "\n" + json.dumps(d, ensure_ascii=False, indent=1) + "\n"

def strip(h):
    i = h.find("<title>")
    if i > 0 and "<!doctype" in h[:i].lower():
        h = h[i:]
    return re.sub(r"\s*</body>\s*</html>\s*$", "\n", h)

def main(a):
    cmd = a[0]
    if cmd == "build":
        t, d = read(a[1]), json.loads(read(a[2]))
        t = t.replace("{{TITLE}}", d["title"].replace("<", "&lt;"))
        write(a[3], t.replace("\n__TRACKER_DATA__\n", dump(d)))
    elif cmd == "strip":
        write(a[2], strip(read(a[1])))
    elif cmd == "extract":
        write(a[2], json.dumps(json.loads(BLOCK.search(read(a[1])).group(2)), ensure_ascii=False, indent=1))
    elif cmd == "inject":
        h, d = read(a[1]), json.loads(read(a[2]))
        m = BLOCK.search(h)
        write(a[1], h[:m.start(2)] + dump(d) + h[m.end(2):])
    else:
        sys.exit(__doc__)

if __name__ == "__main__":
    main(sys.argv[1:]) if len(sys.argv) > 2 else sys.exit(__doc__)
