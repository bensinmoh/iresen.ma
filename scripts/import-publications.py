"""Import owner-selected bibliography only; never publish or copy the source workbook.

Uses Python's standard library. Cached formula results and embedded instructions
are not used to decide which records to import.
"""

import argparse
from collections import Counter
import hashlib
import json
from pathlib import Path
import re
from urllib.parse import quote
import zipfile
import xml.etree.ElementTree as ET


NS = {"s": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
REL = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
ROOT = Path(__file__).resolve().parents[1]


def read_publications(source):
    with zipfile.ZipFile(source) as archive:
        strings = []
        if "xl/sharedStrings.xml" in archive.namelist():
            for item in ET.fromstring(archive.read("xl/sharedStrings.xml")):
                strings.append("".join(t.text or "" for t in item.findall(".//s:t", NS)))
        workbook = ET.fromstring(archive.read("xl/workbook.xml"))
        sheet = next(s for s in workbook.findall("s:sheets/s:sheet", NS)
                     if s.attrib["name"] == "Publications")
        relationships = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
        target = next(r.attrib["Target"] for r in relationships
                      if r.attrib["Id"] == sheet.attrib[f"{{{REL}}}id"])
        member = target.lstrip("/") if target.startswith("/") else "xl/" + target
        tree = ET.fromstring(archive.read(member))
        headers = None
        for row in tree.findall("s:sheetData/s:row", NS):
            cells = {}
            for cell in row:
                column = re.sub(r"\d", "", cell.attrib["r"])
                if cell.find("s:f", NS) is not None:
                    continue
                value = cell.find("s:v", NS)
                kind = cell.attrib.get("t")
                if kind == "inlineStr":
                    data = "".join(t.text or "" for t in cell.findall(".//s:t", NS))
                elif value is None or value.text is None:
                    data = None
                elif kind == "s":
                    data = strings[int(value.text)]
                elif kind in ("str", "e"):
                    data = value.text
                else:
                    number = float(value.text)
                    data = int(number) if number.is_integer() else number
                cells[column] = data
            if headers is None:
                headers = cells
            elif cells.get("A"):
                yield {name: cells.get(column) for column, name in headers.items() if name}


def text(value):
    return str(value).strip() if value is not None and str(value).strip() else None


def integer(value, minimum=0):
    if value is None:
        return None
    if not isinstance(value, int) or value < minimum:
        raise ValueError(f"Invalid numeric value: {value!r}")
    return value


def project(row):
    doi = text(row["Identifiant DOI"])
    if doi:
        doi = re.sub(r"^(?:https?://(?:dx\.)?doi\.org/|doi:\s*)", "", doi, flags=re.I)
        if not re.fullmatch(r"10\.\d{4,9}/\S+", doi):
            raise ValueError(f"Invalid DOI in {row['Identifiant (traçabilité)']}")
    authors = text(row["Auteurs"])
    # Scopus numeric author identifiers are administrative metadata, not names.
    authors = re.sub(r"\s*\(\d+\)", "", authors) if authors else None
    q = text(row["Quartile SJR 2025"])
    status = {"Sans objet": "not-applicable", "A documenter": "unknown",
              "Support a confirmer": "unknown", None: "unknown"}.get(q, "reported")
    if status == "reported" and q not in {"Q1", "Q2", "Q3", "Q4"}:
        raise ValueError(f"Invalid quartile: {q}")
    citations = integer(row["Citations Scopus"])
    result = {
        "id": text(row["Identifiant (traçabilité)"]),
        "doiUrl": "https://doi.org/" + quote(doi, safe="/():;._-") if doi else None,
        "year": integer(row["Année"], 1900),
        "title": text(row["Titre de la publication"]),
        "authors": authors,
        "theme": text(row["Domaine"]),
        "type": text(row["Type de document"]),
        "quartile": q if status == "reported" else None,
        "quartileStatus": status,
        "quartileYear": integer(row["Annee du SJR"], 1900) if status == "reported" else None,
        "scopusCitations": citations,
        "scopusCitationsAsOf": text(row["Date_citations_Scopus"]) if citations is not None else None,
    }
    if not result["id"] or not result["title"]:
        raise ValueError("Missing record identity/title")
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("--check", action="store_true", help="Compare without writing")
    args = parser.parse_args()
    rows = list(read_publications(args.source))
    # Owner's explicit selection: 1,181 counted records, regardless of dashboard filters.
    selected = [r for r in rows if r["État du dossier"] == "Comptabilisée"]
    if len(rows) != 1383 or len(selected) != 1181:
        raise ValueError("Source selection changed; review the import scope before proceeding")
    records = [project(r) for r in selected]
    if len({r["id"] for r in records}) != len(records):
        raise ValueError("Duplicate record identifiers")
    dois = [r["doiUrl"].casefold() for r in records if r["doiUrl"]]
    if len(set(dois)) != len(dois):
        raise ValueError("Duplicate DOI; resolve explicitly rather than merging titles")
    metadata = {
        "sourceFilename": args.source.name,
        "sourceSha256": hashlib.sha256(args.source.read_bytes()).hexdigest(),
        "sourceSheet": "Publications",
        "referencePeriod": "T4 2026",
        "publicationStatus": "staged-not-public",
        "selection": {"sourceRows": len(rows), "imported": len(records),
                      "excluded": len(rows) - len(records), "sourceValue": "Comptabilisée"},
        "quartileBasis": "SJR 2025 — best journal quartile across categories, as supplied",
        "missing": {k: sum(r[k] is None for r in records)
                    for k in ("doiUrl", "year", "authors", "theme", "scopusCitations")},
        "quartiles": dict(sorted(Counter(r["quartile"] or r["quartileStatus"] for r in records).items())),
        "futureYearIds": [r["id"] for r in records if r["year"] and r["year"] > 2026],
    }
    outputs = {ROOT / "src/data/publications.json": records,
               ROOT / "docs/publications-import.json": metadata}
    for path, data in outputs.items():
        contents = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
        if args.check:
            if json.loads(path.read_text()) != data:
                raise ValueError(f"Import differs: {path.name}")
        else:
            path.write_text(contents)
    print(json.dumps(metadata, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
