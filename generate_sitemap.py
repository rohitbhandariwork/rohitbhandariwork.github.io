#!/usr/bin/env python3
"""Generate sitemap.xml from HTML files in the gh-pages-repo directory and deploy."""
import os
import subprocess
from xml.sax.saxutils import escape

REPO_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_URL = "https://rohitbhandariwork.github.io"

DEPTH_PRIORITY = {
    0: 1.0,
    1: 0.8,
    2: 0.7,
    3: 0.6,
}

EXCLUDE_DIRS = {"assets", ".git"}
EXCLUDE_FILES = {"googled20b74a1470f8b7e.html"}

PRIORITY_OVERRIDES = {
    "portfolio-details.html": 0.8,
}

NEWS_PREFIXES = ("news/202", "news/201")


def get_changefreq(path: str) -> str:
    for prefix in NEWS_PREFIXES:
        if path.startswith(prefix):
            return "never"
    return "monthly"


def get_priority(path: str) -> float:
    basename = os.path.basename(path)
    if basename in PRIORITY_OVERRIDES:
        return PRIORITY_OVERRIDES[basename]
    for prefix in NEWS_PREFIXES:
        if path.startswith(prefix):
            if "06" in path:
                return 0.5
            return 0.3
    depth = path.count("/")
    return DEPTH_PRIORITY.get(depth, 0.3)


def url_path(relpath: str) -> str:
    if relpath == "index.html":
        return "/"
    if relpath.endswith("/index.html"):  # news/2026/06/27/index.html → /news/2026/06/27/
        return "/" + relpath.replace("/index.html", "/")
    return "/" + relpath  # portfolio-details.html → /portfolio-details.html


def collect_html_files(root: str) -> list[str]:
    files = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]
        for f in filenames:
            if f == "index.html" or (f.endswith(".html") and f != "index.html"):
                fpath = os.path.relpath(os.path.join(dirpath, f), root)
                if fpath not in EXCLUDE_FILES:
                    files.append(fpath)
    files.sort()
    return files


def generate_sitemap(files: list[str]) -> str:
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for f in files:
        loc = f"{BASE_URL}{url_path(f)}"
        priority = get_priority(f)
        changefreq = get_changefreq(f)
        lines.append("  <url>")
        lines.append(f"    <loc>{escape(loc)}</loc>")
        lines.append(f"    <priority>{priority}</priority>")
        lines.append(f"    <changefreq>{changefreq}</changefreq>")
        lines.append("  </url>")
    lines.append("</urlset>")
    return "\n".join(lines) + "\n"


def main():
    os.chdir(REPO_DIR)
    files = collect_html_files(REPO_DIR)
    sitemap = generate_sitemap(files)
    sitemap_path = os.path.join(REPO_DIR, "sitemap.xml")
    with open(sitemap_path, "w") as f:
        f.write(sitemap)
    print(f"Generated sitemap.xml with {len(files)} URLs")

    subprocess.run(["git", "add", "sitemap.xml"], check=True)
    result = subprocess.run(["git", "commit", "-m", f"Auto-update sitemap.xml ({len(files)} URLs)"], capture_output=True, text=True)
    if "nothing to commit" not in result.stderr and "nothing to commit" not in result.stdout:
        subprocess.run(["git", "push"], check=True)
        print("Deployed to GitHub Pages")
    else:
        print("No changes to deploy")


if __name__ == "__main__":
    main()
