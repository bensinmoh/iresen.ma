"""Create reviewable EN/AR working translations of the public source text.

No coordinator names, emails, phones or portraits are sent to the translator.
The cache and output stay in ignored .local/projects. Never approves CMS locales.
"""
import concurrent.futures
import hashlib
import json
import pathlib
import re
import time
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1] / '.local/projects'
CACHE = ROOT / 'translation-cache'
CACHE.mkdir(exist_ok=True)
records = json.loads((ROOT / 'source.json').read_text())
editorial = json.loads((ROOT.parents[1] / 'src/data/project-editorial-fr.json').read_text())
records = [{**record, **editorial[record['reference']]} for record in records]
SEPARATOR = '\n\n##########\n\n'


def translate(job):
    record, language = job
    values = [record['title'], record['description'] or '', record['summary'], record['theme'] or '', record['location'] or '', record['startText'] or '', *record['objectives']]
    # Empty source values have no translation and remain empty.
    nonempty = [v for v in values if v]
    source = SEPARATOR.join(nonempty)
    cache = CACHE / (hashlib.sha256((language + source).encode()).hexdigest() + '.json')
    if cache.exists():
        translated = json.loads(cache.read_text())
    else:
        query = urllib.parse.urlencode({'client': 'gtx', 'sl': 'fr', 'tl': language, 'dt': 't', 'q': source})
        request = urllib.request.Request('https://translate.googleapis.com/translate_a/single?' + query, headers={'User-Agent': 'Mozilla/5.0'})
        for attempt in range(4):
            try:
                with urllib.request.urlopen(request, timeout=60) as response:
                    result = json.load(response)
                text = ''.join(part[0] for part in result[0] if part[0])
                translated = [part.strip() for part in re.split(r'\s*#{5,}\s*', text)]
                if len(translated) != len(nonempty):
                    raise ValueError(f'Boundary mismatch: {record["reference"]} {language}')
                cache.write_text(json.dumps(translated, ensure_ascii=False))
                break
            except Exception:
                if attempt == 3:
                    raise
                time.sleep(2 ** attempt)
    iterator = iter(translated)
    out = [next(iterator) if v else '' for v in values]
    copy = dict(zip(['title', 'description', 'summary', 'theme', 'location', 'startText'], out[:6]))
    copy['objectives'] = out[6:]
    print(record['reference'], language, flush=True)
    return record['reference'], language, copy


output = {r['reference']: {} for r in records}
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
    for reference, language, copy in pool.map(translate, [(r, lang) for r in records for lang in ['en', 'ar']]):
        output[reference][language] = copy
(ROOT / 'translations.json').write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n')
print('Translated', len(output), 'projects into EN and AR; editorial review pending.')
