#!/usr/bin/env python3
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import json
import re
import urllib.request

ROOT = Path(__file__).resolve().parent
VERKAMI_URL = "https://www.verkami.com/projects/42698-7a-escala-como-puedas"


def parse_followers(html: str):
    text = re.sub(r"<script[\s\S]*?</script>", " ", html, flags=re.I)
    text = re.sub(r"<style[\s\S]*?</style>", " ", text, flags=re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    text = text.replace("&nbsp;", " ")
    text = re.sub(r"\s+", " ", text)
    patterns = [
        r"([\d.,]{1,9})\s+are\s+already\s+following\s+it",
        r"([\d.,]{1,9})\s+people\s+are\s+following",
        r"([\d.,]{1,9})\s+already\s+following",
        r"(\d{1,6})\s+personas?\s+(?:siguen|sigue|siguiendo)",
        r"(\d{1,6})\s+(?:seguidores|followers)",
        r"(?:siguen|siguiendo)\s+(\d{1,6})\s+personas?",
        r'"followers_count"\s*:\s*(\d{1,6})',
        r'"followers"\s*:\s*(\d{1,6})',
        r'"watchers_count"\s*:\s*(\d{1,6})',
    ]
    for pattern in patterns:
        m = re.search(pattern, text if not pattern.startswith('"') else html, flags=re.I)
        if m:
            return int(re.sub(r"[.,\s]", "", m.group(1)))
    return None


class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith('/api/verkami-followers'):
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Cache-Control', 'no-store')
            self.end_headers()
            try:
                req = urllib.request.Request(
                    VERKAMI_URL,
                    headers={
                        'User-Agent': 'Mozilla/5.0 7a-crowdfunding-counter',
                        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
                    },
                )
                with urllib.request.urlopen(req, timeout=10) as r:
                    html = r.read().decode('utf-8', errors='ignore')
                followers = parse_followers(html)
                if followers:
                    payload = {'followers': followers, 'source': VERKAMI_URL}
                else:
                    payload = {'error': 'No se encontró el contador'}
            except Exception as e:
                payload = {'error': str(e)}
            self.wfile.write(json.dumps(payload).encode('utf-8'))
            return
        return super().do_GET()


if __name__ == '__main__':
    import os
    os.chdir(ROOT)
    server = ThreadingHTTPServer(('localhost', 8000), Handler)
    print('Abre http://localhost:8000')
    print('El contador intentará actualizarse desde Verkami.')
    server.serve_forever()
