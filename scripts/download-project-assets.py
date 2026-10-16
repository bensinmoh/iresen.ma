"""Preserve source media privately; only guarded project endpoints serve derivatives."""
import concurrent.futures
import hashlib
import json
import pathlib
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1] / '.local/projects'
records = json.loads((ROOT / 'source.json').read_text())


def download(record):
    folder = ROOT / 'originals' / record['reference']
    folder.mkdir(parents=True, exist_ok=True)
    assets = []
    for key, url in [('image', next(iter(record['imageUrls']), None)), ('portrait', record['portraitUrl'])]:
        if not url:
            continue
        file = folder / key
        try:
            if not file.exists():
                request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(request, timeout=35) as response:
                    if not response.headers.get('Content-Type', '').startswith('image/'):
                        raise ValueError('Not an image')
                    content = response.read(15_000_001)
                    if len(content) > 15_000_000:
                        raise ValueError('Oversized image')
                file.write_bytes(content)
            assets.append({'kind': key, 'url': url, 'sha256': hashlib.sha256(file.read_bytes()).hexdigest()})
        except Exception as error:
            print(record['reference'], key, type(error).__name__, flush=True)
    print(record['reference'], len(assets), flush=True)
    return record['reference'], assets


with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
    manifest = dict(pool.map(download, records))
(ROOT / 'assets.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
