"""Extract only commissioned website fields; keep workbook and output private.

Usage: python3 scripts/extract-project-workbook.py /absolute/path/source.xlsx
Uses the standard library. Never reads scientific-production sheets/columns.
"""
import datetime
import hashlib
import json
import pathlib
import re
import sys
import unicodedata
import xml.etree.ElementTree as ET
import zipfile

ROOT = pathlib.Path(__file__).resolve().parents[1]
NS = {"s": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}


def key(value):
    return re.sub(r"[^a-z0-9]", "", unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode().lower())


def extract(filename):
    source = json.loads((ROOT / ".local/projects/source.json").read_text())
    refs = {key(p["acronym"]): p["reference"] for p in source}
    refs.update({"solarshamsy": "solrshemsy", "nanolubrifiants": "nano-lubrifiants", "cspaitbaha": "csp-ait-baha"})
    new = {"PINREMAT": "pinremat", "SOLTANAIR": "soltanair", "EV Plan": "ev-plan", "Lenium SolarWater (LSWater)": "lswater", "RESTART": "restart", "E-PAVE": "e-pave", "STDSCWG": "stdscwg", "DAKH2A": "dakh2a", "GreenH2Hub": "greenh2hub", "GREAT-H2": "great-h2", "PRAGMA-E": "pragma-e"}
    refs.update({key(k): v for k, v in new.items()})
    with zipfile.ZipFile(filename) as archive:
        strings = ["".join(t.itertext()) for t in ET.fromstring(archive.read("xl/sharedStrings.xml")).findall("s:si", NS)]
        book = ET.fromstring(archive.read("xl/workbook.xml"))
        if book.find("s:sheets/s:sheet", NS).get("name") != "Tableau suivi technique":
            raise ValueError("Unexpected first worksheet")
        properties = book.find("s:workbookPr", NS)
        if properties is not None and properties.get("date1904") in ("1", "true"):
            raise ValueError("Unsupported 1904 date system")
        rows = []
        for row in ET.fromstring(archive.read("xl/worksheets/sheet1.xml")).findall("s:sheetData/s:row", NS):
            cells = {}
            for cell in row.findall("s:c", NS):
                col = re.sub(r"\d", "", cell.get("r"))
                if col not in list("ABCDEHIJKLMN") + ["F"]:
                    continue
                value = cell.find("s:v", NS)
                if cell.find("s:f", NS) is not None:
                    raise ValueError(f"Formula requires review: {cell.get('r')}")
                if cell.get("t") == "inlineStr":
                    value = "".join(cell.find("s:is", NS).itertext())
                elif value is not None:
                    value = strings[int(value.text)] if cell.get("t") == "s" else value.text
                else:
                    value = None
                cells[col] = value.strip() if isinstance(value, str) else value
            if int(row.get("r")) == 1:
                if cells.get("B") != "Référence du projet" or cells.get("N") != "Financement accordé par IRESEN":
                    raise ValueError("Workbook headers changed")
                continue
            if not cells.get("B"):
                if any(cells.values()):
                    raise ValueError(f"Nonempty row without reference: {row.get('r')}")
                continue
            reference = refs.get(key(cells["B"]))
            if reference is None:
                raise ValueError(f"Unreviewed reference: {cells['B']}")
            date = cells.get("K")
            date_note = None
            if date and re.fullmatch(r"\d+(?:\.\d+)?", date):
                date = (datetime.datetime(1899, 12, 30) + datetime.timedelta(days=float(date))).strftime("%Y-%m-%d")
            elif date and re.match(r"\d{2}/\d{2}/\d{4}", date):
                date_note = date
                date = datetime.datetime.strptime(date[:10], "%d/%m/%Y").strftime("%Y-%m-%d")
            elif date in (None, "", "NA"):
                date = None
            else:
                raise ValueError(f"Unreviewed date: {reference}/{date}")
            duration = cells.get("L")
            months = None
            if duration:
                if reference == "melhy" and duration == "1,2 (14 mois)":
                    months = 14
                elif re.fullmatch(r"\d+(?:\.0+)?", duration):
                    months = int(float(duration)) * 6
                else:
                    raise ValueError(f"Unreviewed duration: {reference}/{duration}")
            funding = cells.get("N")
            if funding:
                funding = float(re.sub(r"\s", "", funding).replace(",", "."))
                if funding < 0:
                    raise ValueError("Negative funding")
            status = cells.get("M") or None
            if status not in (None, "En cours", "en cours", "Achevé", "Clôturé", "En cours de démarrage"):
                raise ValueError(f"Unknown status: {status}")
            contact = cells.get("I") or ""
            emails = re.findall(r"[A-Za-z0-9_.+%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", contact)
            # Multiple addresses are retained privately; the first source-listed address is the action.
            rows.append(dict(reference=reference, row=int(row.get("r")), acronym=cells["B"], programme=cells.get("A") or None, title=cells.get("C") or None,
                             partners=cells.get("D") or None, theme=cells.get("E") or None, coordinator=cells.get("F") or None,
                             affiliation=cells.get("H") or None, email=emails[0] if emails else None,
                             location=cells.get("J") or None, date=date, dateNote=date_note,
                             durationMonths=months, durationSource=duration, status=status, fundingMAD=funding))
    if len(rows) != 70 or len({r["reference"] for r in rows}) != 70:
        raise ValueError("Expected 70 distinct reviewed projects")
    output = ROOT / ".local/projects/workbook-1026"
    output.mkdir(mode=0o700, parents=True, exist_ok=True)
    result = dict(filename=pathlib.Path(filename).name, sha256=hashlib.sha256(pathlib.Path(filename).read_bytes()).hexdigest(),
                  sheet="Tableau suivi technique", rows=rows,
                  absentReferences=sorted({p["reference"] for p in source} - {r["reference"] for r in rows}))
    target = output / "extracted.json"
    target.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
    target.chmod(0o600)
    print(f"Extracted {len(rows)} projects; {len(new)} new; absent: {result['absentReferences']}. Private output: {target}")


if __name__ == "__main__":
    extract(sys.argv[1])
