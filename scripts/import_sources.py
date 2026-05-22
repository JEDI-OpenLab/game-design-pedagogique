#!/usr/bin/env python3
"""Importe les exports Moodle CSV en Markdown et données JS.

Le script ne republie pas les PDF ou documents tiers : il transforme uniquement
les exports internes structurés en ressources éditables pour le dépôt.
"""

from __future__ import annotations

import csv
import html
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from typing import Iterable


REPO = Path(__file__).resolve().parents[1]
WORKSPACE = REPO.parent.parent
SOURCES = WORKSPACE / "01_Projets" / "Jeux_serieux"
EXPORTS = REPO / "sources" / "exports"
KNOWLEDGE = REPO.parent / "knowledge" / "04_Jeux_serieux"
ODYSSEE = REPO.parent / "livre-jeu-odyssee-enseignement-main"


class TextExtractor(HTMLParser):
    block_tags = {"p", "div", "li", "tr", "h1", "h2", "h3", "h4", "h5", "h6"}

    def __init__(self) -> None:
        super().__init__()
        self.parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in {"br", "hr"}:
            self.parts.append("\n")
        if tag == "li":
            self.parts.append("\n- ")

    def handle_endtag(self, tag: str) -> None:
        if tag in self.block_tags:
            self.parts.append("\n")

    def handle_data(self, data: str) -> None:
        self.parts.append(data)

    def text(self) -> str:
        return "".join(self.parts)


def clean(value: str | None) -> str:
    if not value:
        return ""
    value = value.replace("\xa0", " ")
    value = value.replace("\r\n", "\n").replace("\r", "\n")
    value = value.replace("@@PLUGINFILE@@/", "")
    parser = TextExtractor()
    parser.feed(value)
    text = html.unescape(parser.text())
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def slugify(value: str) -> str:
    value = value.lower()
    value = (
        value.replace("à", "a")
        .replace("â", "a")
        .replace("ä", "a")
        .replace("ç", "c")
        .replace("é", "e")
        .replace("è", "e")
        .replace("ê", "e")
        .replace("ë", "e")
        .replace("î", "i")
        .replace("ï", "i")
        .replace("ô", "o")
        .replace("ö", "o")
        .replace("ù", "u")
        .replace("û", "u")
        .replace("ü", "u")
        .replace("œ", "oe")
    )
    value = re.sub(r"[^a-z0-9]+", "-", value).strip("-")
    return value or "item"


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8-sig") as handle:
        return [{key: clean(value) for key, value in row.items()} for row in csv.DictReader(handle)]


def write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content.rstrip() + "\n", encoding="utf-8")


def markdown_list(items: Iterable[str]) -> str:
    return "\n".join(f"- {item}" for item in items)


def add_unique(parts: list[str], value: str) -> None:
    value = value.strip()
    if value and value != "N/A" and value not in parts:
        parts.append(value)


def lexique_files() -> list[Path]:
    candidates = [
        *sorted(EXPORTS.glob("*lexique*.csv")),
        SOURCES / "Lexique de la ludification pédagogique-59-records-20230605_1344-comma_separated.csv",
        SOURCES / "Contenus de niveau 1 notions et définitions-57-records-20230605_1344-comma_separated.csv",
    ]
    seen: set[Path] = set()
    files: list[Path] = []
    for file in candidates:
        if file.exists() and file not in seen:
            seen.add(file)
            files.append(file)
    return files


def build_lexique() -> list[dict[str, str]]:
    merged: dict[str, dict[str, object]] = {}
    files = lexique_files()
    for file in files:
        for row in read_csv(file):
            term = row.get("Notion ou terme à définir", "").strip()
            if not term:
                continue
            key = term.casefold()
            definition = row.get("Définition", "")
            details = row.get("Autres explications, exemples, etc. (N/A si vide)", "")
            if key not in merged:
                merged[key] = {
                    "terme": term,
                    "definitions": [],
                    "details": [],
                    "sources": [],
                }
            add_unique(merged[key]["definitions"], definition)  # type: ignore[arg-type]
            add_unique(merged[key]["details"], details)  # type: ignore[arg-type]
            add_unique(merged[key]["sources"], file.name)  # type: ignore[arg-type]

    lexique = []
    for item in merged.values():
        definitions = item["definitions"]  # type: ignore[assignment]
        details = item["details"]  # type: ignore[assignment]
        definition = definitions[0] if definitions else ""
        detail_parts = [f"Définition complémentaire : {value}" for value in definitions[1:]]
        detail_parts.extend(details)
        lexique.append(
            {
                "terme": item["terme"],
                "definition": definition,
                "details": "\n\n".join(detail_parts),
                "source": ", ".join(item["sources"]),  # type: ignore[arg-type]
            }
        )
    return sorted(lexique, key=lambda item: item["terme"].casefold())


def build_examples() -> list[dict[str, str]]:
    file = SOURCES / "Contenus de niveau 2 types de jeux, exemples et cas d’usage-16-records-20230605_1345_comma_separated.csv"
    if not file.exists():
        file = SOURCES / "Contenus de niveau 2 types de jeux, exemples et cas d’usage-16-records-20230605_1345-comma_separated.csv"
    rows = []
    for row in read_csv(file):
        rows.append(
            {
                "nom": row.get("Nom de l’exemple", ""),
                "type_jeu": row.get("Type de jeu (stratégie, simulation, rôle, etc.)", ""),
                "support": row.get("Type de support (plateau, cartes, jeu vidéo, etc.)", ""),
                "description": row.get("Description (principe, contexte, objectifs sérieux et ludiques, etc.)", ""),
            }
        )
    return rows


def build_tools() -> list[dict[str, str]]:
    file = SOURCES / "Boîte à outils ressources-20-records-20230605_1344-comma_separated.csv"
    rows = []
    for row in read_csv(file):
        rows.append(
            {
                "nom": row.get("Nom", ""),
                "description": row.get("Description", ""),
                "type": row.get("Type", ""),
                "lien": row.get("Lien", ""),
                "categorie": row.get("Catégorie", ""),
            }
        )
    return rows


def build_bibliography() -> list[dict[str, str]]:
    notes = {
        "Alvarez_2007_du_jeu_video_au_serious_game.pdf": (
            "Thèse de référence pour cadrer la notion de serious game et ses familles.",
            "Notices et citations courtes uniquement.",
        ),
        "Alvarez_2007_presentation_these_serious_games.pdf": (
            "Support synthétique utile pour présenter les distinctions conceptuelles.",
            "Notices et citations courtes uniquement.",
        ),
        "Alvarez_HDR_design_dispositifs_experiences_jeu_serieux.pdf": (
            "Approfondissement sur le design de dispositifs et d'expériences de jeu sérieux.",
            "Notices et citations courtes uniquement.",
        ),
        "Atelier_EDU_pedagogie_du_jeu.pdf": (
            "Repères pratiques sur la pédagogie du jeu et l'animation d'ateliers.",
            "Vérifier les droits avant republication.",
        ),
        "Canope_apprendre_avec_les_serious_games.pdf": (
            "Ressource institutionnelle pour introduire l'apprentissage avec les serious games.",
            "Privilégier lien et résumé.",
        ),
        "How_to_create_a_serious_game.pdf": (
            "Guide méthodologique pour passer de l'intention au prototype.",
            "Privilégier lien et résumé.",
        ),
        "IDATE_2008_serious_games_advergaming_edugaming_training.pdf": (
            "Rapport de contexte sur les marchés et catégories de serious games.",
            "Notices et citations courtes uniquement.",
        ),
        "Introduction_au_serious_game.pdf": (
            "Introduction générale utile pour les premières pages de cadrage.",
            "Vérifier les droits avant republication.",
        ),
    }
    bibliography = []
    for file in sorted(KNOWLEDGE.glob("*.pdf")):
        interest, status = notes.get(file.name, ("Ressource à qualifier.", "Droits à vérifier."))
        bibliography.append(
            {
                "reference": file.stem.replace("_", " "),
                "fichier_source": str(file.relative_to(REPO.parent)),
                "type": "PDF / ressource de veille",
                "interet": interest,
                "notions": "serious game, jeu pédagogique, design pédagogique",
                "priorite": "haute" if "Alvarez" in file.name or "How_to" in file.name else "moyenne",
                "statut": status,
            }
        )
    return bibliography


def emit_markdown(lexique: list[dict[str, str]], examples: list[dict[str, str]], tools: list[dict[str, str]], bibliography: list[dict[str, str]]) -> None:
    lexique_md = [
        "# Lexique du game design pédagogique",
        "",
        "Lexique importé et nettoyé depuis les exports Moodle internes. Les définitions doivent encore être relues éditorialement avant publication stable.",
        "",
        f"Nombre d'entrées fusionnées : {len(lexique)}.",
        "",
    ]
    for item in lexique:
        lexique_md.extend(
            [
                f"## {item['terme']}",
                "",
                item["definition"] or "Définition à compléter.",
                "",
            ]
        )
        if item["details"]:
            lexique_md.extend(["### Notes et exemples", "", item["details"], ""])
    write(REPO / "ressources" / "lexique" / "lexique.md", "\n".join(lexique_md))

    examples_md = [
        "# Typologie et exemples de jeux pédagogiques",
        "",
        "Exemples importés depuis l'ancien espace de cours. Certains liens ou images Moodle historiques ont été retirés du texte nettoyé.",
        "",
    ]
    for item in examples:
        examples_md.extend(
            [
                f"## {item['nom']}",
                "",
                f"- Type de jeu : {item['type_jeu'] or 'à préciser'}",
                f"- Support : {item['support'] or 'à préciser'}",
                "",
                item["description"] or "Description à compléter.",
                "",
            ]
        )
    write(REPO / "ressources" / "exemples" / "typologie-jeux.md", "\n".join(examples_md))

    tools_md = [
        "# Boîte à outils",
        "",
        "Ressources externes à vérifier avant diffusion publique. Les descriptions sont issues des exports internes et doivent être relues.",
        "",
    ]
    for item in tools:
        link = item["lien"].split()[0] if item["lien"] else ""
        tools_md.extend(
            [
                f"## {item['nom']}",
                "",
                f"- Catégorie : {item['categorie'] or 'à classer'}",
                f"- Type : {item['type'] or 'à préciser'}",
                f"- Lien : {link or 'à vérifier'}",
                "",
                item["description"] or "Description à compléter.",
                "",
            ]
        )
    write(REPO / "ressources" / "boite_a_outils" / "boite-a-outils.md", "\n".join(tools_md))

    biblio_md = [
        "# Bibliographie commentée",
        "",
        "Cette page ne republie pas les documents tiers. Elle sert de base de notices, résumés, liens et statuts juridiques à compléter.",
        "",
    ]
    for item in bibliography:
        biblio_md.extend(
            [
                f"## {item['reference']}",
                "",
                f"- Type : {item['type']}",
                f"- Intérêt : {item['interet']}",
                f"- Notions associées : {item['notions']}",
                f"- Priorité : {item['priorite']}",
                f"- Statut juridique : {item['statut']}",
                f"- Source locale : `{item['fichier_source']}`",
                "",
            ]
        )
    write(REPO / "ressources" / "bibliographie" / "bibliographie-commentee.md", "\n".join(biblio_md))


def emit_data_js(lexique: list[dict[str, str]], examples: list[dict[str, str]], tools: list[dict[str, str]], bibliography: list[dict[str, str]]) -> None:
    payload = {
        "lexique": [{**item, "slug": slugify(item["terme"])} for item in lexique],
        "exemples": [{**item, "slug": slugify(item["nom"])} for item in examples],
        "outils": [{**item, "slug": slugify(item["nom"])} for item in tools],
        "bibliographie": bibliography,
        "mecaniques": [
            {
                "nom": "Choix à conséquences",
                "usages": ["comprendre", "appliquer", "décider"],
                "supports": ["livre-jeu", "simulation", "jeu de rôle"],
                "vigilance": "Les conséquences doivent produire du feedback pédagogique, pas seulement de la fiction.",
            },
            {
                "nom": "Questions progressives",
                "usages": ["mémoriser", "comprendre", "s'entraîner"],
                "supports": ["cartes", "plateau", "quiz scénarisé"],
                "vigilance": "Le quiz devient ludique seulement si les règles et feedbacks servent l'engagement.",
            },
            {
                "nom": "Énigmes",
                "usages": ["appliquer", "analyser", "coopérer"],
                "supports": ["escape game", "parcours", "jeu d'enquête"],
                "vigilance": "Une énigme trop opaque bloque l'apprentissage ; prévoir indices et remédiation.",
            },
            {
                "nom": "Prototype à construire",
                "usages": ["créer", "évaluer", "collaborer"],
                "supports": ["atelier", "cartes", "plateau"],
                "vigilance": "Le livrable doit rester au service de la conceptualisation, pas de la décoration.",
            },
            {
                "nom": "Boucle essai-feedback-remédiation",
                "usages": ["s'entraîner", "corriger", "progresser"],
                "supports": ["numérique", "papier", "hybride"],
                "vigilance": "Le feedback doit expliciter pourquoi une action fonctionne ou non.",
            },
        ],
    }
    content = "window.GDP_DATA = " + json.dumps(payload, ensure_ascii=False, indent=2) + ";\n"
    write(REPO / "assets" / "data.js", content)


def emit_inventory() -> None:
    lines = [
        "# Inventaire des sources",
        "",
        "Inventaire initial des contenus repérés pour construire le dépôt.",
        "",
        "## Sources internes principales",
        "",
        markdown_list(
            [
                "`01_Projets/Jeux_serieux/AP_Serious_Game` : atelier narratif Moodle et fiche ADDIE.",
                "`01_Projets/Jeux_serieux/Trivial_Pursuit` : atelier de dégamification, méthode D.I.C.E., gabarits de cartes et règles.",
                "`01_Projets/Jeux_serieux/Escape_Game` : notes Genially, escape game évaluation, gabarits d'énigmes et fiches de synthèse.",
                "`01_Projets/Jeux_serieux/Ludification` : méthode visuelle et exemples de parcours ludifié.",
                "`01_Projets/Jeux_serieux/HDVELH` : source historique de L'Odyssée de l'enseignement.",
                "`JEDI-OpenLab/livre-jeu-odyssee-enseignement-main` : version web publiable du livre-jeu.",
                "`JEDI-OpenLab/knowledge/04_Jeux_serieux` : corpus de veille à citer sous forme de notices.",
            ]
        ),
        "",
        "## Exports structurés importés",
        "",
        markdown_list(
            [
                "`Lexique de la ludification pédagogique`",
                "`sources/exports/lexique-ludification-pedagogique-75-records-20260522-1445.csv`",
                "`Contenus de niveau 1 notions et définitions`",
                "`Contenus de niveau 2 types de jeux, exemples et cas d’usage`",
                "`Boîte à outils ressources`",
            ]
        ),
        "",
        "## Règles de publication",
        "",
        markdown_list(
            [
                "Publier en Markdown les contenus originaux réécrits ou nettoyés.",
                "Transformer les documents tiers en notices commentées plutôt qu'en copies.",
                "Conserver les anciens fichiers Word/PPT/PDF comme sources locales, sans les intégrer au dépôt public tant que les droits ne sont pas clarifiés.",
                "Préférer les gabarits éditables Markdown/HTML aux fichiers binaires pour GitHub.",
            ]
        ),
    ]
    write(REPO / "ressources" / "inventaire-sources.md", "\n".join(lines))


def main() -> None:
    lexique = build_lexique()
    examples = build_examples()
    tools = build_tools()
    bibliography = build_bibliography()
    emit_markdown(lexique, examples, tools, bibliography)
    emit_data_js(lexique, examples, tools, bibliography)
    emit_inventory()
    print(
        f"Import terminé : {len(lexique)} notions, {len(examples)} exemples, "
        f"{len(tools)} outils, {len(bibliography)} notices bibliographiques."
    )


if __name__ == "__main__":
    main()
