"""Extract the owner-selected public catalogue without scientific-production counters.

Standard library only. Raw pages and contact-bearing data stay in ignored .local/.
"""
import concurrent.futures
import datetime
import hashlib
import json
import pathlib
import re
import urllib.parse
import urllib.request
from html.parser import HTMLParser

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / '.local/projects'
OUT.mkdir(parents=True, exist_ok=True)
SOURCE = 'https://iresen.org/agence-de-moyens/'


class Node:
    def __init__(self, tag='', attrs=(), parent=None):
        self.tag, self.attrs, self.parent, self.children = tag, dict(attrs), parent, []

    def all(self, tag=None, cls=None):
        found = []
        for c in self.children:
            if isinstance(c, Node):
                if (not tag or c.tag == tag) and (not cls or cls in c.attrs.get('class', '').split()):
                    found.append(c)
                found.extend(c.all(tag, cls))
        return found

    def text(self):
        return re.sub(r'\s+', ' ', ''.join(c.text() if isinstance(c, Node) else c for c in self.children)).strip()


class Tree(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.root = self.current = Node()
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs, self.current)
        self.current.children.append(node)
        if tag not in ('area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'):
            self.current = node

    def handle_startendtag(self, tag, attrs):
        self.current.children.append(Node(tag, attrs, self.current))

    def handle_endtag(self, tag):
        node = self.current
        while node.parent:
            if node.tag == tag:
                self.current = node.parent
                return
            node = node.parent

    def handle_data(self, data):
        self.current.children.append(data)


def fetch(url, name):
    cached = OUT / name
    if cached.exists():
        return cached.read_text()
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (IRESEN catalogue migration)'})
    with urllib.request.urlopen(req, timeout=40) as response:
        html = response.read().decode('utf-8')
    cached.write_text(html)
    return html


def first(nodes):
    return nodes[0] if nodes else Node()


def valid_image(url):
    parsed = urllib.parse.urlparse(url)
    return parsed.scheme == 'https' and parsed.hostname == 'iresen.org' and parsed.path.startswith('/wp-content/')


listing = Tree(fetch(SOURCE, 'listing.html')).root
programmes = {n.attrs['data-filter'].lstrip('.'): n.text() for n in listing.all('a') if n.attrs.get('data-filter', '').startswith('.')}
cards = listing.all(cls='ttm-box-col-wrapper')
entries = []
for card in cards:
    heading = first(card.all('h5'))
    link = first(heading.all('a'))
    url = link.attrs.get('href', '')
    if '/projects/' not in url:
        continue
    entries.append({'reference': url.rstrip('/').split('/')[-1], 'acronym': link.text(), 'sourceUrl': url,
                    'programme': next((programmes[c] for c in card.attrs.get('class', '').split() if c in programmes), None),
                    'cardImage': first(card.all('img')).attrs.get('src')})
assert len(entries) == 60 and len({e['reference'] for e in entries}) == 60


def extract(entry):
    html = fetch(entry['sourceUrl'], entry['reference'] + '.html')
    root = Tree(html).root
    boxes = root.all(cls='ttm-pf-single-content-wrapper-innerbox')
    if len(boxes) < 2:
        raise ValueError('Missing project structure: ' + entry['sourceUrl'])
    content, extra = boxes[:2]
    intro = first(content.all(cls='col-lg-6'))
    blocks = [n for n in intro.children if isinstance(n, Node) and n.tag in ('h4', 'h5', 'h6', 'p')]
    title = blocks[1] if len(blocks) > 1 else Node()
    metadata = {}
    for block in content.all(cls='ttm-pf-data-block'):
        metadata[first(block.all(cls='ttm-pf-data-title')).text()] = first(block.all(cls='ttm-pf-data-details')).text()
    objectives = []
    objective_heading = next((n for n in content.all('h5') if n.text() == 'OBJECTIFS'), None)
    if objective_heading:
        siblings = objective_heading.parent.children
        for node in siblings[siblings.index(objective_heading) + 1:]:
            if isinstance(node, Node):
                if node.tag not in ('p', 'ul', 'ol'):
                    break
                if node.tag in ('ul', 'ol'):
                    objectives.extend(n.text() for n in node.all('li') if n.text())
                elif node.text():
                    objectives.append(node.text())
    email = first(extra.all(cls='email-contact-pj'))
    encrypted = first(email.all(cls='__cf_email__')).attrs.get('data-cfemail')
    mail_link = first(email.all('a')).attrs.get('href', '')
    address = None
    if encrypted:
        raw = bytes.fromhex(encrypted)
        address = ''.join(chr(b ^ raw[0]) for b in raw[1:])
    elif mail_link.startswith('mailto:'):
        address = mail_link[7:]
    logo_box = first(extra.all(cls='project-img-iresen-rdor'))
    logos = [{'url': img.attrs.get('src'), 'label': img.attrs.get('alt') if img.attrs.get('alt') not in ('', '1', 'image') else None}
             for img in logo_box.all('img') if valid_image(img.attrs.get('src', ''))]
    date = metadata.get('Date début') or None
    year = re.search(r'\b(19|20)\d{2}\b', date or '')
    images = [n.attrs.get('src') for n in content.all('img') if valid_image(n.attrs.get('src', ''))]
    portrait = first(extra.all(cls='max-gep-prj')).attrs.get('src')
    result = {**entry, 'title': title.text() or None,
              'description': '\n\n'.join(n.text() for n in blocks[2:] if n.text()) or None,
              'objectives': objectives, 'coordinatorName': metadata.get('Coordinateur') or None,
              'startText': date, 'year': int(year[0]) if year else None,
              'location': metadata.get('Lieu') or None, 'theme': metadata.get('Thématique') or None,
              'contactName': first(extra.all(cls='title-contact-person')).text() or None,
              'email': address, 'phone': first(extra.all(cls='phone-contact')).text() or None,
              'portraitUrl': portrait if portrait and valid_image(portrait) else None,
              'imageUrls': list(dict.fromkeys(images)), 'consortiumLogos': logos,
              'sourceHash': hashlib.sha256(html.encode()).hexdigest(),
              'retrievedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(),
              'status': None, 'durationMonths': None, 'budgetMAD': None, 'hostingPlatform': None,
              'consortium': [], 'selectionCallReference': None}
    print(entry['reference'], flush=True)
    return result


with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
    records = list(pool.map(extract, entries))
(OUT / 'source.json').write_text(json.dumps(records, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'projects': len(records), 'themes': sorted({r['theme'] or '' for r in records}),
                  'missingTitles': [r['reference'] for r in records if not r['title']]}))
