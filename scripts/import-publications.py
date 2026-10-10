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
import unicodedata
from urllib.parse import quote, unquote, urlparse
import zipfile
import xml.etree.ElementTree as ET


NS = {"s": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
REL = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
ROOT = Path(__file__).resolve().parents[1]


def read_publications(source, sheet_name="Publications", header_row=1, key_column="A"):
    with zipfile.ZipFile(source) as archive:
        strings = []
        if "xl/sharedStrings.xml" in archive.namelist():
            for item in ET.fromstring(archive.read("xl/sharedStrings.xml")):
                strings.append("".join(t.text or "" for t in item.findall(".//s:t", NS)))
        workbook = ET.fromstring(archive.read("xl/workbook.xml"))
        sheet = next(s for s in workbook.findall("s:sheets/s:sheet", NS)
                     if s.attrib["name"] == sheet_name)
        relationships = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
        target = next(r.attrib["Target"] for r in relationships
                      if r.attrib["Id"] == sheet.attrib[f"{{{REL}}}id"])
        member = target.lstrip("/") if target.startswith("/") else "xl/" + target
        tree = ET.fromstring(archive.read(member))
        headers = None
        for row in tree.findall("s:sheetData/s:row", NS):
            if int(row.attrib["r"]) < header_row:
                continue
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
            elif cells.get(key_column):
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


def doi_key(value):
    value = text(value)
    return re.sub(r"^https?://(?:dx\.)?doi\.org/", "", unquote(value), flags=re.I).casefold() if value else None


def title_key(value):
    return "".join(c for c in unicodedata.normalize("NFKC", value).casefold() if c.isalnum())


def source_url(value):
    value = text(value)
    if value is None:
        return None
    parsed = urlparse(value)
    if parsed.scheme != "https" or not parsed.netloc or parsed.username or parsed.password:
        raise ValueError("Invalid public ranking source URL")
    return value


def supplement_records(baseline_rows, source):
    master = list(read_publications(source, "Publications consolidées"))
    csv = list(read_publications(source, "CSV Scopus brut - 623", 4, "B"))
    baseline = {r["Identifiant (traçabilité)"]: r for r in baseline_rows}
    if len(master) != 1383 or len({r["ID publication"] for r in master}) != 1383:
        raise ValueError("Unexpected or duplicate consolidated corpus")
    if set(baseline) != {r["ID publication"] for r in master}:
        raise ValueError("Corpus identities differ: review before merging")
    if len(csv) != 623 or len({r["ID Master rapproché"] for r in csv}) != 623:
        raise ValueError("Unexpected or duplicate Scopus export")
    csv_by_id = {r["ID Master rapproché"]: r for r in csv}
    selected = [r for r in master if r["Retenue rapport 2011–2026"] == 1]
    if len(selected) != 1199:
        raise ValueError("Owner-approved 1,199-record selection changed")
    records = []
    changes = Counter()
    review_ids = []
    title_variant_ids = []
    types = {"Article": "Article", "Conference paper": "Conférence", "Book chapter": "Chapitre",
             "Review": "Synthèse", "Book": "Ouvrage", "Erratum": "Correction",
             "Editorial": "Éditorial", "Short survey": "Short survey", "Data paper": "Données"}
    for row in selected:
        ident = row["ID publication"]
        record = project(baseline[ident])
        for key, field in (("title", "Titre de la publication"), ("year", "Année du Master")):
            new = row[field]
            if new is not None and new != record[key]:
                changes[key] += 1
                record[key] = new
        if doi_key(row["DOI canonique"]) != doi_key(record["doiUrl"]):
            raise ValueError(f"Conflicting DOI: {ident}")
        record["journal"] = text(row["Revue ou support"])
        exported = csv_by_id.get(ident)
        if exported:
            if text(exported["EID"]) != text(row["Scopus EID déclaré"]):
                raise ValueError(f"Conflicting Scopus EID: {ident}")
            csv_doi = doi_key(exported["DOI"])
            if csv_doi and csv_doi != doi_key(record["doiUrl"]):
                raise ValueError(f"Conflicting Scopus DOI: {ident}")
            if not csv_doi and title_key(exported["Title"]) != title_key(record["title"]):
                raise ValueError(f"Unresolved title-only Scopus match: {ident}")
            if title_key(exported["Title"]) != title_key(record["title"]):
                title_variant_ids.append(ident)
            count = exported["Cited by"]
            if isinstance(count, str) and re.fullmatch(r"\d+", count):
                count = int(count)
            count = integer(count)
            if count != row["Citations relevées dans CSV"]:
                raise ValueError(f"Scopus count disagrees with consolidated record: {ident}")
            if count is not None:
                changes["scopusCitationSnapshots"] += 1
                changes["scopusCitationValues"] += count != record["scopusCitations"]
                record["scopusCitations"] = count
                record["scopusCitationsAsOf"] = "2026-10-10"
            new_type = types.get(text(exported["Document Type"]))
            if new_type and record["type"] != new_type:
                changes["type"] += 1
                record["type"] = new_type
        level = row["SJR 2025 : niveau de preuve"]
        checked = row["SJR 2025 : quartile contrôlé web"]
        record["quartileSourceUrl"] = None
        record["quartileEvidence"] = "unknown"
        if checked in {"Q1", "Q2", "Q3", "Q4"}:
            evidence_url = source_url(row["URL preuve SJR 2025"])
            if not evidence_url or level != "Sourcé web":
                raise ValueError(f"Incomplete 2025 ranking evidence: {ident}")
            changes["quartileValues"] += record["quartile"] != checked
            record.update(quartile=checked, quartileStatus="reported", quartileYear=2025,
                          quartileEvidence="source-reported", quartileSourceUrl=evidence_url)
        elif level == "Sans objet":
            record.update(quartile=None, quartileStatus="not-applicable", quartileYear=None)
            record["quartileEvidence"] = "not-applicable"
        elif record["quartile"]:
            record["quartileEvidence"] = "inherited-provisional"
        historical = row["SJR historique : quartile année publication"]
        record["historicalQuartile"] = None
        record["historicalQuartileYear"] = None
        record["historicalQuartileSourceUrl"] = None
        record["historicalQuartileEvidence"] = "unknown"
        if historical in {"Q1", "Q2", "Q3", "Q4"}:
            year = integer(row["SJR historique : année référence"], 1900)
            url = source_url(row["URL preuve SJR historique"])
            if year != record["year"] or year > 2025 or not url:
                raise ValueError(f"Invalid historical ranking evidence: {ident}")
            evidence = {"Sourcé - SCImago primaire": "primary-source-reported",
                        "Sourcé - historique secondaire": "secondary-source-reported"}.get(row["SJR historique : état de preuve"])
            if not evidence:
                raise ValueError(f"Unsupported historical ranking evidence: {ident}")
            record.update(historicalQuartile=historical, historicalQuartileYear=year,
                          historicalQuartileSourceUrl=url, historicalQuartileEvidence=evidence)
        elif historical == "Sans objet":
            record["historicalQuartileEvidence"] = "not-applicable"
        elif historical == "Sans objet 2026":
            record["historicalQuartileEvidence"] = "edition-unavailable"
        if row["Éligible éditorial 2011–2026"] != 1:
            review_ids.append(ident)
        records.append(record)
    old_ids = {r["Identifiant (traçabilité)"] for r in baseline_rows if r["État du dossier"] == "Comptabilisée"}
    new_ids = {r["id"] for r in records}
    reconciliation = {
        "sourceFilename": source.name,
        "sourceSha256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "sourceSheet": "Publications consolidées",
        "sourceRows": len(master), "scopusExportRows": len(csv),
        "addedIds": sorted(new_ids - old_ids), "removedIds": sorted(old_ids - new_ids),
        "changes": dict(sorted(changes.items())),
        "editorialReviewRequiredIds": sorted(review_ids),
        "scopusTitleVariantIds": sorted(title_variant_ids),
        "historicalQuartiles": dict(sorted(Counter(r["historicalQuartile"] or r["historicalQuartileEvidence"] for r in records).items())),
        "quartileEvidence": dict(sorted(Counter(r["quartileEvidence"] for r in records).items())),
    }
    return records, reconciliation


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("--check", action="store_true", help="Compare without writing")
    parser.add_argument("--supplement", type=Path, help="Owner-approved consolidated update workbook")
    args = parser.parse_args()
    current_metadata = ROOT / "docs/publications-import.json"
    if not args.supplement and current_metadata.exists() and json.loads(current_metadata.read_text()).get("reconciliation"):
        raise ValueError("This database has a consolidated update; supply --supplement to avoid reverting it")
    rows = list(read_publications(args.source))
    # Owner's explicit selection: 1,181 counted records, regardless of dashboard filters.
    selected = [r for r in rows if r["État du dossier"] == "Comptabilisée"]
    if len(rows) != 1383 or len(selected) != 1181:
        raise ValueError("Source selection changed; review the import scope before proceeding")
    records = [project(r) for r in selected]
    reconciliation = None
    if args.supplement:
        records, reconciliation = supplement_records(rows, args.supplement)
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
                      "excluded": len(rows) - len(records),
                      "sourceValue": "Retenue rapport 2011–2026 = 1" if reconciliation else "Comptabilisée"},
        "quartileBasis": "SJR 2025 — best journal quartile across categories, as supplied",
        "missing": {k: sum(r[k] is None for r in records)
                    for k in ("doiUrl", "year", "authors", "theme", "scopusCitations")},
        "quartiles": dict(sorted(Counter(r["quartile"] or r["quartileStatus"] for r in records).items())),
        "futureYearIds": [r["id"] for r in records if r["year"] and r["year"] > 2026],
    }
    if reconciliation:
        metadata["reconciliation"] = reconciliation
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
